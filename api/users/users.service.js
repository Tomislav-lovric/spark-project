const pool = require("../../config/db.js");

module.exports = {
  create: (data, userKey, callBack) => {
    pool.query(
      `INSERT INTO users(firstName, lastName, email, password, repeatedPassword, userKey) 
       VALUES(?, ?, ?, ?, ?, ?)`,
      [
        data.firstName,
        data.lastName,
        data.email,
        data.password,
        data.repeatedPassword,
        userKey
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  getUserByUserEmail: (email, callBack) => {
    pool.query(
      `SELECT * FROM users WHERE email = ?`,
      [email],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  updateUser: (data, callBack) => {
    pool.query(
      `UPDATE users SET firstName = ?, lastName = ?, email = ?
       WHERE email = ?`,
      [
        data.firstName,
        data.lastName,
        data.newEmail,
        data.email
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results[0]);
      }
    );
  },
  changePassword: (email, pass, repeatedPass, callBack) => {
    pool.query(
      `UPDATE users SET password = ?, repeatedPassword = ?
       WHERE email = ?`,
      [
        pass,
        repeatedPass,
        email
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  expireTokens: (email, date, callBack) => {
    pool.query(
      `UPDATE resetTokens SET used = 1
       WHERE email = ? AND expiration < ?`,
      [
        email,
        date
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  addToken: (email, token, expiration, callBack) => {
    pool.query(
      `INSERT INTO resetTokens(email, token, expiration) 
       VALUES(?, ?, ?)`,
      [
        email,
        token,
        expiration
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  },
  checkToken: (email, token, callBack) => {
    pool.query(
      `SELECT * FROM resetTokens WHERE email = ? AND token = ?`,
      [
        email,
        token
      ],
      (error, results, fields) => {
        if (error) {
          callBack(error);
        }
        return callBack(null, results);
      }
    );
  }
}