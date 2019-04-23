let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let GroupSchema = new mongoose.Schema({
    title: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    owner_name: String,
    owner_email: String,
    description: String,
    tasks: [],
    date_created : {
        type: Date,
        default: Date.now
    },
    members: [
        {
            _id: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            name: String,
            email: String
        }
    ]
});


const Group = mongoose.model('Group', GroupSchema);

module.exports = Group;
