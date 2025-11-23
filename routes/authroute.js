const {Sellersignup,login,Usersignup} = require('../controller/authcontroller');
const express = require('express');

const router = express.Router();

router.post("/Sellersignup",Sellersignup);
router.post("/login",login);
router.post("/Usersignup",Usersignup);

module.exports = router;