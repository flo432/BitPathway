let express = require('express');
let router = express.Router();
let users = require('./api/users.route');
let groups = require('./api/groups.route');


router.use('/users', users);
router.use('/groups', groups);


module.exports = router;