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
    status: {
        type: Boolean,
        default: false
    },
    object_id: {
        type: Types.ObjectId,
        ref: "Object"
    },
    phase_id: {
        type: Types.ObjectId,
        ref: "Phases"
    },
    dwelling_id: {
        type: Types.ObjectId,
        ref: "Dwelling"
    },
    floor_id: {
        type: Types.ObjectId,
        ref: "Floors"
    }
})

module.exports = {
    ApartmentModel: model('Apartments', schema)
}