let userService = require('services/user.service');

exports.authenticateUser = async function (req, res) {
  try{
      let authenticateUser = await userService.authenticateUser(req.body);
      return res.status(200).json(authenticateUser);
  } catch (e){
      return res.status(400).json({status: 400, message: e.message});
  }
};

exports.getUsers = async function(req, res){
    try{
        let users = await userService.getUsers({});
        return res.status(200).json(users);
    }catch(e){
        return res.status(400).json({status: 400, message: e.message});
    }
};

exports.addUser = async function(req, res) {
    try{
        let user = await userService.addUser(req.body);
        return res.status(200).json({status: 200, data: user, message: "Successfully added."});
    }catch(e){
        return res.status(400).json({status: 400, message: e.message});
    }
};

exports.getUser = async function(req, res) {
    try{
        let user = await userService.getUser(req.params.id);
        return res.status(200).json(user);
    }catch(e){
        return res.status(400).json({status: 400, message: e.message});
    }
};

exports.updateUser =  async function(req, res){

    if(!req.body._id || !req.body.first_name || !req.body.last_name){
        return res.status(400).json({status: 400., message: "Error while getting data."})
    }

    try{
        let updatedUser = await userService.updateUser(req.body);
        return res.status(200).json({status: 200, data: updatedUser, message: "Successfully updated."})
    }catch(e){
        return res.status(400).json({status: 400., message: e.message})
    }
};

exports.removeUser = async function(req, res){
    try {
        await userService.deleteUser(req.params.id);
        return res.status(204).json({status:204, message: "Successfully deleted."})
    }catch(e) {
        return res.status(400).json({status: 400, message: e.message})
    }

};
