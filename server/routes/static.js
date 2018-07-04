const router = require("express").Router();
const controllers = require('../controllers');
const { staticControllers } = controllers;
const { checkErrors,validateAll } = require('../middlewares')

router.post('/signup',checkErrors,validateAll, staticControllers.signup)
router.post('/login', staticControllers.login)
router.post('/facebookLogin',staticControllers.facebookLogin)

module.exports = router