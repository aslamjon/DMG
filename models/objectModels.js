const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
  img: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  apartments: {
    type: Number,
    required: true
  },
  doneApartments: {
    type: Number,
    required: true
  },
  feld: {
    type: Number,
    required: true
  },
  status: {
    type: String,
  },
  assignedTo: {
    type: Types.ObjectId,
    ref: "User"
  }
})

module.exports = {
  ObjectModel: model('Object', schema)
}