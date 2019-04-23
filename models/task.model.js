let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let TaskSchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    title: String,
    description: String,
    user_projects: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Project'
        }
    ],
    date_created : {
        type: Date,
        default: Date.now
    },
});


const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
