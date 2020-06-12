const pool = require("../../config/db.js");



module.exports = {
    addPhoto: (photo, data, size, created_at, callBack) => {
        pool.query(
            `INSERT INTO photos(photo, photo_name, photo_type, userKey, size, created_at) 
            VALUES(?, ?, ?, ?, ?, ?)`,
            [
                photo,
                data.photo_name,
                data.photo_type,
                data.userKey,
                size,
                created_at
            ],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        );
    },
    changePhoto: (photo_id, photo, data, created_at, callBack) => {
        pool.query(
            `UPDATE photos SET photo = ?, photo_name = ?, photo_type = ?, created_at = ?
             WHERE photo_id = ? && userKey = ?`,
            [
                photo,
                data.photo_name,
                data.photo_type,
                created_at,
                photo_id,
                data.userKey
            ],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        )
    },
    getOnePhoto: (photo_id, userKey, callBack) => {
        pool.query(
            `SELECT * FROM photos Where photo_id = ? && userKey = ?`,
            [
                photo_id,
                userKey
            ],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    },
    getPhotos: (data, page, limit, callBack) => {
        pool.query(
            `SELECT * FROM photos WHERE created_at = ? && userKey = ? LIMIT ?,?`,
            [
                data.created_at,
                data.userKey,
                page,
                limit
            ],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        )
    },
    searchByName: (userKey, name, callBack) => {
        pool.query(
            `SELECT * FROM photos WHERE userKey = ? && photo_name LIKE "%${name}%"`,
            [
                userKey
            ],
            (error, results, fields) => {
                if (error) {
                    callBack(error)
                }
                return callBack(null, results);
            }
        )
    },
    sortPhotosBySizeASC: (userKey, callBack) => {
        pool.query(
            `SELECT * FROM photos WHERE userKey = ? ORDER BY size ASC`,
            [userKey],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        )
    },
    sortPhotosBySizeDESC: (userKey, callBack) => {
        pool.query(
            `SELECT * FROM photos WHERE userKey = ? ORDER BY size DESC`,
            [userKey],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results);
            }
        )
    },
    deletePhoto: (photo_id, userKey, callBack) => {
        pool.query(
            `DELETE FROM photos WHERE photo_id = ? && userKey = ?`,
            [
                photo_id,
                userKey
            ],
            (error, results, fields) => {
                if (error) {
                    callBack(error);
                }
                return callBack(null, results[0]);
            }
        );
    }
}