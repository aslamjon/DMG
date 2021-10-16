const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    assignedTo: {
        type: Types.ObjectId,
        ref: "User"
    }
})

module.exports = {
    PathModel: model('Paths', schema)
}