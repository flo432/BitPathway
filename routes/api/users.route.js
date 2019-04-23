let express = require('express');
let router = express.Router();
let UserController = require('../../controllers/user.controller');

router.get('/', UserController.getUsers);
router.get('/:id', UserController.getUser);
router.post('/register', UserController.addUser);
router.post('/authenticate', UserController.authenticateUser);
router.put('/', UserController.updateUser);
router.delete('/:id', UserController.removeUser);



// router.get();
// router.post();
// router.put();
// router.delete();

module.exports = router;