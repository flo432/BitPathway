let groupService = require('services/group.service');

exports.getGroups = async function(req, res){
    try{
        let groups = await groupService.getGroups({});
        return res.status(200).json(groups);
    }catch(e){
        return res.status(400).json({status: 400, message: e.message});
    }
};

exports.getUserGroups = async function(req, res){
    try{
        let teacherGroups = await groupService.getUserGroups(req.params.id);
        return res.status(200).json(teacherGroups);
    }catch(e){
        return res.status(400).json({status: 400, message: e.message});
    }
};

exports.addGroup = async function(req, res){
    try{
        let group = await groupService.addGroup(req.body);
        return res.status(200).json({status: 200, data: group, message: "Successfully added."});
    }catch(e){
        return res.status(400).json({status: 400, message: e.message});
    }
};

exports.removeGroup = async function(req, res) {
    try{
        await groupService.removeGroup(req.params.id);
        return res.status(204).json({status:204, message: "Successfully deleted."})
    }catch (e) {
        return res.status(400).json({status: 400, message: e.message});
    }
};

exports.joinGroup = async function (req, res) {
    try{
        await groupService.joinGroup(req.params.id, req.body);
        return res.status(200).json({status: 200, message: "Successfully updated."})
    }catch (e) {
        return res.status(400).json({status: 400, message: e.message});
    }
};

exports.getGroup = async function (req, res) {
    try{
        let group = await groupService.getGroup(req.params.id);
        return res.status(200).json(group);
    }catch (e) {
        return res.status(400).json({status: 400, message: e.message});
    }
};

exports.getGroupMembers = async function (req, res) {
    try{
        let members = await groupService.getGroupMembers(req.params.id);
        return res.status(200).json(members);
    }catch (e) {
        return res.status(400).json({status: 400, message: e.message});
    }
};

exports.updateGroupAbout = async function (req, res) {
    if(!req.body.title){
        return res.status(400).json({status: 400., message: "Error while getting data."})
    }

    try{
        await groupService.updateGroupAbout(req.params.id, req.body);
        return res.status(200).json({status: 200, message: "Successfully updated."})
    }catch(e){
        return res.status(400).json({status: 400., message: e.message})
    }
};

exports.updateGroupMember = async function (req, res) {
    console.log(req.body);
    if(!req.body._id){
        return res.status(400).json({status: 400., message: "Error while getting data."})
    }

    try{
        await groupService.updateGroupMember(req.params.id, req.body);
        return res.status(200).json({status: 200, message: "Successfully updated."})
    }catch (e) {
        return res.status(400).json({status: 400., message: e.message})
    }
};

exports.addGroupTask = async function (req, res) {
    console.log(req.body);

    try{
        await groupService.addGroupTask(req.params.id, req.body);
        return res.status(200).json({status: 200, message: "Task added."})
    }catch (e) {
        return res.status(400).json({status: 400., message: e.message})
    }
};

exports.removeGroupTask = async function (req, res) {
    console.log(req.body);
    if(!req.body._id){
        return res.status(400).json({status: 400., message: "Error while getting data."})
    }

    try{
        await groupService.removeGroupTask(req.params.id, req.body);
        return res.status(200).json({status: 200, message: "Successfully updated."})
    }catch (e) {
        return res.status(400).json({status: 400., message: e.message})
    }
};

exports.getGroupTask = async function (req, res) {
    try{
        console.log("jestem");
        console.log(req.params);
        let task = await groupService.getGroupTask(req.params.id, req.params.taskID);
        return res.status(200).json(task)
    }catch (e) {
        return res.status(400).json({status: 400., message: e.message})
    }
};

exports.updateGroupTask = async function (req, res) {
    if(!req.body.title){
        return res.status(400).json({status: 400., message: "Error while getting data."})
    }

    try{
        await groupService.updateGroupTask(req.params.id, req.params.taskID, req.body);
        return res.status(200).json({status: 200, message: "Successfully updated."})
    }catch(e){
        return res.status(400).json({status: 400., message: e.message})
    }
};

exports.addTaskProject = async function (req, res) {
    if(!req.body.title){
        return res.status(400).json({status: 400., message: "Error while getting data."})
    }

    try{
        await groupService.addTaskProject(req.params.id, req.params.taskID, req.params.projectID, req.body);
        return res.status(200).json({status: 200, message: "Successfully updated."})
    }catch(e){
        return res.status(400).json({status: 400., message: e.message})
    }
};


// exports.getUser = async function(req, res) {
//     try{
//         let user = await userService.getUser(req.params.id);
//         return res.status(200).json(user);
//     }catch(e){
//         return res.status(400).json({status: 400, message: e.message});
//     }
// };
// exports.updateUser =  async function(req, res){
//
//     if(!req.body._id || !req.body.first_name || !req.body.last_name){
//         return res.status(400).json({status: 400., message: "Error while getting data."})
//     }
//
//     try{
//         let updatedUser = await userService.updateUser(req.body);
//         return res.status(200).json({status: 200, data: updatedUser, message: "Successfully updated."})
//     }catch(e){
//         return res.status(400).json({status: 400., message: e.message})
//     }
// };
