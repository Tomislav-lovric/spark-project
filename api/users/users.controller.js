const {
    create,
    getUserByUserEmail,
    updateUser,
    changePassword,
    expireTokens,
    addToken,
    checkToken
} = require("./users.service");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const validateEmail = function (email) {
    const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return pattern.test(email);
}
const validatePassword = function (pass) {
    const pattern = /^(?=.*[0-9])(?=.*[.,!@#$%^&*])[a-zA-Z0-9.,!@#$%^&*]{8,16}$/;
    return pattern.test(pass);
}
const validateName = function (name) {
    const pattern = /[a-zA-Z]{5,}/
    return pattern.test(name);
}

Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
}

let date = new Date();
date.addHours(2); // did this because new date is early by 2 hours (if its 17:01 its actually gonna log 15:01)
const iso = date.toISOString().match(/(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})/);
const correctDate = iso[1] + " " + iso[2];

module.exports = {
    createUser: (req, res) => {
        const body = req.body;
        const userKey = Math.random().toString(36).slice(-8);
        if (validateEmail(body.email) && validateName(body.firstName) && validateName(body.lastName)) {
            getUserByUserEmail(body.email, (err, results) => {
                if (err) {
                    console.log(err);
                }
                if (!results) {
                    if (!validatePassword(body.password) || body.password != body.repeatedPassword) {
                        return res.status(400).json({
                            message: "Invalid password. Password has to have more than 8 and less than 16 characters, it has to contain at least on number and one special character"
                        });
                    } else {
                        const salt = bcrypt.genSaltSync(10);
                        body.password = bcrypt.hashSync(body.password, salt);
                        body.repeatedPassword = bcrypt.hashSync(body.repeatedPassword, salt);
                        create(body, userKey, (err, results) => {
                            if (err) {
                                console.log(err);
                                return res.status(500).json({
                                    message: "Database connection errror"
                                });
                            }
                            return res.status(200).json({
                                message: "User created",
                                data: results
                            });
                        });
                    }
                } else {
                    res.json({
                        message: "Invalid data"
                    });
                }
            });
        } else {
            res.status(400).json({
                message: "Invalid data"
            });
        }
    },
    login: (req, res) => {
        const body = req.body;
        getUserByUserEmail(body.email, (err, results) => {
            if (err) {
                console.log(err);
            }
            if (!results) {
                return res.json({
                    data: "Invalid email or password"
                });
            }
            const result = bcrypt.compareSync(body.password, results.password);
            if (result) {
                results.password = undefined;
                const jsontoken = jsonwebtoken.sign({
                    result: results
                }, "secret", {
                    expiresIn: "1h"
                });
                return res.json({
                    message: "login successfully",
                    userId: results.userKey,
                    token: jsontoken
                });
            } else {
                return res.json({
                    data: "Invalid email or password"
                });
            }
        });
    },
    updateUser: (req, res) => {
        const body = req.body;
        getUserByUserEmail(body.email, (err, results) => {
            if (err) {
                console.log(err);
            }
            if (!results) {
                res.json({
                    message: "Invalid data1"
                });
            }
            if (body.firstName == null) {
                body.firstName = results.firstName;
            }
            if (body.lastName == null) {
                body.lastName = results.lastName;
            }
            if (body.newEmail == null) {
                body.newEmail = results.email;
                if (validateName(body.firstName) && validateName(body.lastName)) {
                    updateUser(body, (err, results) => {
                        if (err) {
                            console.log(err);
                        }
                        return res.json({
                            message: "User data has been updated"
                        });
                    })
                }
            } else {
                if (validateName(body.firstName) && validateName(body.lastName) && validateEmail(body.newEmail)) {
                    getUserByUserEmail(body.newEmail, (err, results) => {
                        if (err) {
                            console.log(err);
                        }
                        if (!results) {
                            updateUser(body, (err, results) => {
                                if (err) {
                                    console.log(err);
                                }
                                return res.json({
                                    message: "User data has been updated"
                                });
                            });
                        } else {
                            res.json({
                                message: "Invalid data2"
                            });
                        }
                    });
                } else {
                    res.json({
                        message: "Invalid data3"
                    });
                }
            }
        });
    },
    resetPassword: (req, res) => {
        const body = req.body;
        if (body.email == null || !validateEmail(body.email)) {
            res.json({
                message: "Invalid data"
            });
        } else {
            getUserByUserEmail(body.email, (err, results) => {
                if (err) {
                    console.log(err);
                }
                if (!results) {
                    res.json({
                        message: "Email has been sent1"
                    });
                }
                expireTokens(body.email, correctDate, (err, results) => {
                    if (err) {
                        console.log(err);
                    }
                });
                const token = crypto.randomBytes(64).toString('base64');
                let expireDate = new Date();
                expireDate.addHours(1);
                addToken(body.email, token, expireDate, (err, results) => {
                    if (err) {
                        console.log(err);
                    }
                });
                const transporter = nodemailer.createTransport({
                    host: "localhost",
                    secure: false,
                    port: 25,
                    service: "gmail",
                    auth: {
                        user: "project.passreset@gmail.com",
                        pass: "passReset.123"
                    },
                    tls: {
                        rejectUnauthorized: false
                    }
                });
                const mailOptions = {
                    from: "project.passreset@gmail.com",
                    to: `${results.email}`,
                    subject: "Password reset",
                    text: `Your password has been reset. Visit this link (in postman) to create your new password: http://localhost:3000/user/changePass?token=${token}&&email=${results.email}`
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Email sent: " + info.response);
                    }
                });
            });
            return res.json({
                message: "Email has been sent3"
            });
        }
    },
    changePass: (req, res) => {
        const body = req.body;
        const token = req.query.token;
        const email = req.query.email;
        checkToken(email, token, (err, results) => {
            if (err) {
                console.log(err);
            }
            if (!results) {
                res.json({
                    message: "Token expired1"
                });
            }
            if (results.used == 1 || results.expiration < correctDate) {
                res.json({
                    message: "Token expired2"
                });
            } else {
                if (!validatePassword(body.password) || body.password != body.repeatedPassword) {
                    return res.status(400).json({
                        message: "Invalid password. Password has to have more than 8 and less than 16 characters, it has to contain at least on number and one special character"
                    });
                } else {
                    const salt = bcrypt.genSaltSync(10);
                    body.password = bcrypt.hashSync(body.password, salt);
                    body.repeatedPassword = bcrypt.hashSync(body.repeatedPassword, salt);
                    changePassword(email, body.password, body.repeatedPassword, (err, results) => {
                        if (err) {
                            console.log(err);
                        }
                        return res.json({
                            message: "Password has been changed"
                        });
                    });
                }
            }
        })
    },
    changePassword: (req, res) => {
        const body = req.body;
        getUserByUserEmail(body.email, (err, results) => {
            if (err) {
                console.log(err);
            }
            if (!results) {
                res.json({
                    message: "Invalid data"
                });
            }
            const result = bcrypt.compareSync(body.oldPassword, results.password);
            if (!validatePassword(body.password) || body.password != body.repeatedPassword || !result) {
                res.json({
                    message: "Invalid data"
                });
            } else {
                const salt = bcrypt.genSaltSync(10);
                body.password = bcrypt.hashSync(body.password, salt);
                body.repeatedPassword = bcrypt.hashSync(body.repeatedPassword, salt);
                changePassword(body.email, body.password, body.repeatedPassword, (err, results) => {
                    if (err) {
                        console.log(err);
                    }
                    return res.json({
                        message: "Password has been changed"
                    });
                });
            }
        });
    }
};