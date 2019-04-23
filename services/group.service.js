let Group = require('../models/group.model');
let Task = require('../models/task.model');
let Project = require('../models/project.model');
let mongoose = require('mongoose');
let config = require('config.json');

mongoose.connect(config.connectionString);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

exports.getGroups = async function (query) {
    try{
        return await Group.find(query);
    }catch (e){
        throw Error(`getGroups:Error ${e}`)
    }
};

exports.getUserGroups = async function(id){
    try{
        return await Group.find({'$or': [{ owner: mongoose.Types.ObjectId(id) }, {'members._id': mongoose.Types.ObjectId(id) }]});
    }catch(e){
        throw Error(`getTeacherGroups:Error ${e}`)
    }
};

exports.addGroup = async function (group) {
  try{

      let newGroup = new Group({
          title: group.title,
          owner: group.owner,
          owner_name: group.owner_name,
          owner_email: group.owner_email,
          description: group.description,
          tasks: group.tasks,
          date_created: group.date_created
          });

      await newGroup.save();

      return newGroup;

  }catch(e){
      throw Error(`addGroup:Error ${e}`)
  }
};

exports.joinGroup = async function(id, member){
    try{
        let newMember = await Group.findOne({_id: mongoose.Types.ObjectId(id), 'members._id': mongoose.Types.ObjectId(member._id)});

        if(newMember) {
            throw new Error("You are in this group already.");
        }else {
            newMember = await Group.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, {$push: {members: member}});
        }
        return newMember;
    }catch (e) {
        throw Error(`joinGroup:Error ${e}`)
    }
};

exports.updateGroupAbout = async function(id, about){
    try{
        await Group.findByIdAndUpdate(id, about)
    }catch (e) {
        throw Error(`updateGroupAbout:Error ${e}`)
    }
};

exports.updateGroupMember = async function(id, member){
    try{
        await Group.findByIdAndUpdate(id, {$pull: {members: {'_id': mongoose.Types.ObjectId(member._id)}}});
    }catch (e) {
        throw Error(`updateGroupMember:Error ${e}`)
    }
};

exports.addGroupTask = async function(id, task){
    try{
        let newTask = new Task({
           _id: mongoose.Types.ObjectId(task._id),
           title: task.title,
           description: task.description
        });
        await Group.findByIdAndUpdate(id, {$push: {tasks: newTask}});
    }catch (e) {
        throw Error(`addGroupTask:Error ${e}`)
    }
};

exports.removeGroupTask = async function(id, task){
    try{
        await Group.findByIdAndUpdate(id, {$pull: {tasks: {'_id': mongoose.Types.ObjectId(task._id)}}});
    }catch (e) {
        throw Error(`updateGroupTask:Error ${e}`)
    }
};

exports.getGroupTask = async function (groupID, taskID){
    try{
        let task = await Group.findOne({_id: mongoose.Types.ObjectId(groupID), 'tasks._id': mongoose.Types.ObjectId(taskID)}, {'tasks.$': 1});
        return task.tasks[0];
    }catch (e) {
        throw Error(`getGroupTask:Error ${e}`)
    }
};

exports.updateGroupTask = async function (groupID, taskID, task) {
    try{
        await Group.update({
                "_id": mongoose.Types.ObjectId(groupID),
                "tasks": {
                    "$elemMatch": {
                        "_id": mongoose.Types.ObjectId(taskID)
                    }
                }
            },
            {
                "$set": {
                    "tasks.$.title": task.title,
                    "tasks.$.description": task.description
                }
            });

    }catch (e) {
        throw Error(`updateGroupTask:Error ${e}`)
    }
};

exports.addTaskProject = async function(groupID, taskID, projectID, project){
    try{
        let newProject = new Project({
            _id: mongoose.Types.ObjectId(projectID),
            title: project.title,
            description: project.description,
            authors: project.authors,
            date_created: project.date_created
        });

        await Promise.all([
            await Group.update(
                {
                    "_id": mongoose.Types.ObjectId(groupID),
                    "tasks": {
                        "$elemMatch": {
                            "_id": mongoose.Types.ObjectId(taskID)
                        }
                    }
                },
                {
                    "$push": { "tasks.$.user_projects":
                            {
                            "_id": mongoose.Types.ObjectId(projectID),
                            "title": project.title,
                            "description": project.description,
                            "authors": project.authors
                            }
                    }
                }
            ),
            await newProject.save()
        ]);

    }catch (e) {
        throw Error(`addTaskProject:Error ${e}`)
    }
};

exports.removeGroup = async function(id) {
    try{
        return await Group.findByIdAndRemove(id);
    }catch(e){
        throw Error(`deleteGroup:Error ${e}`)
    }
};

exports.getGroup = async function (id) {
    try{
        return await Group.findById(id);
    }catch (e) {
        throw Error(`getGroup:Error ${e}`)
    }
};

exports.getGroupMembers = async function (id) {
    try{
        let group =  await Group.findById(id);
        return group.members;
    }catch (e) {
        throw Error(`getGroup:Error ${e}`)
    }
};