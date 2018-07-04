const router = require("express").Router();
const listRoute = require("./list.js");
const staticRoute = require("./static.js")

router.use('/',staticRoute)
router.use('/list', listRoute)

module.exports = router