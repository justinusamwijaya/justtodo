const router = require("express").Router();
const controllers = require('../controllers');
const {listControllers} = controllers
const middlewares = require('../middlewares');


router.get('/',middlewares.authenticate, listControllers.getAllList)
router.get('/:id',middlewares.authenticate, listControllers.getOneList)
router.get('/search/:name',middlewares.authenticate, listControllers.searchList)
router.post('/',middlewares.authenticate, listControllers.addList)
router.put('/changeFinishedStatus',middlewares.authenticate, listControllers.changeFinishTask)
router.put('/',middlewares.authenticate, listControllers.updateList)
router.post('/delete',middlewares.authenticate, listControllers.deleteList)
router.delete('/:id',middlewares.authenticate, listControllers.deleteList)

module.exports = router