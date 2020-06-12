const router = require("express").Router();

const { checkToken } = require("../../auth/token_validation");
const user = require("./users.controller");

router.post("/registration", user.createUser);

router.post("/login", user.login);

router.patch("/update", checkToken, user.updateUser);

router.post("/resetPassword", user.resetPassword);

router.patch("/changePass", user.changePass);

router.patch("/changePassword", checkToken, user.changePassword);

module.exports = router;