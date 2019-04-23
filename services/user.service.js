let User = require('../models/user.model');
let mongoose = require('mongoose');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
let config = require('config.json');

mongoose.connect(config.connectionString);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


exports.authenticateUser = async function (user) {
    try{
        let authenticateUser = await User.findOne({email: user.email});
            if(authenticateUser === null){
                throw new Error("Login failed.");
            }
            if( authenticateUser && bcrypt.compareSync(user.password, authenticateUser.password)){
                authenticateUser = {
                    first_name: authenticateUser.first_name,
                    last_name: authenticateUser.last_name,
                    email: authenticateUser.email,
                    _id: authenticateUser._id,
                    token: jwt.sign({ sub: authenticateUser._id }, config.secret)
                };
            }else {
                throw new Error("Login failed.");
            }
            return authenticateUser;

    }catch (e){
        throw Error(`authenticateUser ${e}`)
    }
};

exports.getUsers = async function (query) {
    try{
        return await User.find(query);
    }catch (e){
        throw Error(`getUsers:Error ${e}`)
    }
};

exports.addUser = async function (user) {

    try{
        let newUser = await User.findOne({ email : user.email});
        if(newUser){
            throw new Error("User with this email address already exists.");
        } else {

            newUser = new User({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                password: bcrypt.hashSync(user.password, 10),
                isTeacher: user.isTeacher
            });
            await newUser.save();
        }
        return newUser;
    } catch (e) {
        throw Error(`addUser:Error ${e}`)
    }

};

exports.getUser = async function (id) {
    try{
        return await User.findById(id);
    }catch (e){
        throw Error(`getUser:Error ${e}`)
    }
};

exports.updateUser = async function(user){
    try{
        return await User.findByIdAndUpdate(user._id, user);
    }catch(e){
        throw Error(`updateUser:Error ${e}`)
    }
};

exports.deleteUser = async function(id) {
    try{
        return await User.findByIdAndRemove(id);
    }catch(e){
        throw Error(`deleteUser:Error ${e}`)
    }
};