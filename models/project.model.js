let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ProjectSchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    title: String,
    description: String,
    authors: [],
    date_created : {
        type: Date,
        default: Date.now
    },
});


const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
