let express = require('express');
let router = express.Router();
let GroupController = require('../../controllers/group.controller');


router.get('/', GroupController.getGroups);
router.get('/user/:id', GroupController.getUserGroups);
router.get('/:id', GroupController.getGroup);
router.post('/', GroupController.addGroup);
// router.put('/:id', GroupController.updateGroup);
router.delete('/:id', GroupController.removeGroup);
router.put("/member/:id", GroupController.joinGroup);
router.put("/about/:id", GroupController.updateGroupAbout);
router.put("/remove-member/:id", GroupController.updateGroupMember);
router.put("/tasks/:id", GroupController.addGroupTask);
router.put("/remove-task/:id", GroupController.removeGroupTask);
router.get("/:id/task/:taskID", GroupController.getGroupTask);
router.put("/:id/task/:taskID", GroupController.updateGroupTask);
router.put("/:id/task/:taskID/project/:projectID", GroupController.addTaskProject);
router.get("/members/:id", GroupController.getGroupMembers);


// router.get();
// router.post();
// router.put();
// router.delete();

module.exports = router;