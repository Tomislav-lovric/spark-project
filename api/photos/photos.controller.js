const fs = require("fs");

const {
    addPhoto,
    getOnePhoto,
    deletePhoto,
    getPhotos,
    changePhoto,
    sortPhotosBySizeASC,
    sortPhotosBySizeDESC,
    searchByName
} = require('./photos.service');

let today = new Date();
let dd = today.getDate();
let mm = today.getMonth() + 1;
const yyyy = today.getFullYear();

if (dd < 10) {
    dd = `0${dd}`;
}
if (mm < 10) {
    mm = `0${mm}`;
}

today = `${yyyy}-${mm}-${dd}`;


module.exports = {
    addPhoto: (req, res) => {
        const body = req.body;
        if (!req.file) return res.send("Please upload a photo");
        const path = req.file.path;
        const stats = fs.statSync(req.file.path);
        const fileSizeInBytes = stats["size"];
        const fileSizeInKilobytes = fileSizeInBytes / 1024.0;
        const size = Math.floor(fileSizeInKilobytes * 10) / 10;
        addPhoto(path, body, size, today, (err, results) => {
            if (err) {
                console.log(err);
            }
            if (!results) {
                return res.json({
                    message: "Invalid upload"
                });
            }
            return res.status(200).json({
                message: "Photo uploaded"
            });
        });
    },
    changePhoto: (req, res) => {
        const photo_id = req.params.photo_id;
        const body = req.body;
        if (!req.file) return res.send("Please upload a photo with extension jpeg or png");
        const path = req.file.path;
        if (body.photo_name == null || body.photo_type == null || body.user_id == null) {
            return res.json({
                message: "Invalid data"
            });
        } else {
            changePhoto(photo_id, path, body, today, (err, results) => {
                if (err) {
                    console.log(err);
                }
                if (!results) {
                    res.json({
                        message: "Invalid upload"
                    });
                }
                return res.status(200).json({
                    message: `Photo with id ${photo_id} has been changed`
                });
            });
        }
    },
    getPhotoByPhotoId: (req, res) => {
        const photo_id = req.params.photo_id;
        const userKey = req.query.userKey;
        getOnePhoto(photo_id, userKey, (err, results) => {
            if (err) {
                console.log(err);
            }
            if (!results) {
                return res.json({
                    message: "Invalid photo id"
                });
            }
            return res.status(200).json({
                message: "Retrived one photo",
                data: results
            });
        })
    },
    getMultiplePhotos: (req, res) => {
        const limit = parseInt(req.query.limit, 10);
        const page = parseInt((req.query.page - 1) * limit, 10);
        const body = req.body;
        getPhotos(body, page, limit, (err, results) => {
            if (err) {
                console.log(err);
            }
            if (!results) {
                return res.json({
                    message: "error"
                });
            }
            return res.status(200).json({
                message: "Got multiple photos",
                data: results
            });
        })
    },
    getPhotoByName: (req, res) => {
        const userKey = req.query.userKey;
        const name = req.query.photo_name;
        searchByName(userKey, name, (err, results) => {
            if(err) {
                console.log(err);
            }
            if(!results) {
                res.json({
                    message: "Invalid user key or photo/s by that name do/does not exist"
                });
            }
            return res.status(200).json({
                data: results
            })
        })
    },
    sortPhotosASC: (req, res) => {
        const userKey = req.params.userKey;
        sortPhotosBySizeASC(userKey, (err, results) => {
            if (err) {
                console.log(err);
            }
            if (!results) {
                return res.json({
                    message: "Error"
                });
            }
            return res.status(200).json({
                message: `Photos orderd by size ASC`,
                data: results
            })
        });
    },
    sortPhotosDESC: (req, res) => {
        const userKey = req.params.userKey;
        sortPhotosBySizeDESC(userKey, (err, results) => {
            if (err) {
                console.log(err);
            }
            if (!results) {
                return res.json({
                    message: "Error"
                });
            }
            return res.status(200).json({
                message: `Photos orderd by size DESC`,
                data: results
            })
        });
    },
    deletePhotoByPhotoId: (req, res) => {
        const photo_id = req.query.photo_id;
        const userKey = req.query.userKey;
        deletePhoto(photo_id, userKey, (err, results) => {
            if (err) {
                console.log(err);
            }
            if (!results) {
                return res.json({
                    message: "Deleted one photo"
                });
            }
            return res.status(200).json({
                message: "Deleted one photo" // same message so the unauthorized user doesn't know if he deleted a photo or not
            });
        })
    }
};