const express = require('express');
const router = express.Router();
const createUserInternal  = require("../controllers/create-user-controller");
const getUserProfile= require("../controllers/get-user-controller");
const updateProfile= require("../controllers/update-user-controller");

router.post("/internal/users", createUserInternal);
router.get("/getProfile", getUserProfile)
router.get("/updateProfile", updateProfile)


module.exports = router;