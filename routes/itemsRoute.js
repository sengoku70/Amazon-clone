const express = require("express");
const router = express.Router();
const { createitem } = require("../controller/itemcontroller");
const upload = require("../middleware/upload");

router.post("/createitem", upload.single('image'), createitem);

module.exports = router;
