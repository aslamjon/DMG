const { Schema, model, Types } = require('mongoose');

const phaseSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    viewbox: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
    object_id: {
        type: Types.ObjectId,
        ref: "Object"
    }
})
// dwellings: [dwellingSchema]
module.exports = {
    PhasesModel: model('Phases', phaseSchema)
}