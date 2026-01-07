const express = require("express");
const signupController = require("../controllers/sign-up-controller.js");
const signinController = require("../controllers/sign-in-controller.js");
const refreshController = require("../controllers/refresh-token-controller.js");
const logoutController = require("../controllers/logout-controller.js");

const router = express.Router();

router.post("/signup", signupController);
router.post("/signin", signinController);
router.post("/refresh", refreshController);
router.post("/logout", logoutController);

module.exports = router;
