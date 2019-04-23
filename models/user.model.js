let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let UserSchema = new mongoose.Schema({
    email : { type: String, unique: true, lowercase: true, trim: true },
    password: String,
    first_name : String,
    last_name : String,
    isAdmin : {
        type: Boolean,
        default : false
    },
    isTeacher : {
        type: Boolean,
        default : false
    },
    date_joined : {
        type: Date,
        default: Date.now
    },
    private_projects : [
            {
                type: Schema.Types.ObjectId,
                ref: 'Project'
            }
        ],
    groups : [
            {
                type: Schema.Types.ObjectId,
                ref: 'Group'
            }
        ]
});

UserSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        delete ret.password;
        return ret;
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;