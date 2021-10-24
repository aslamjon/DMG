const { Schema, model, Types } = require('mongoose');

const schema = new Schema({
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
    // logo: {
    //     type: String,
    //     required: true,
    // },
    path: {
        type: String,
        required: true,
    },
    object_id: {
        type: Types.ObjectId,
        ref: "Object"
    },
    phase_id: {
        type: Types.ObjectId,
        ref: "Phases"
    }
})

module.exports = {
    DwellingModel: model('Dwelling', schema)
}