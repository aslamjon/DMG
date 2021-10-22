const {Schema, model, Types} = require('mongoose');

const floorSchema = new Schema({
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
  apartments: {
    type: Number,
    required: true
  }
})

const dwellingSchema = new Schema({
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
  floors: [floorSchema]
})



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
  // apartments: {
  //   type: Number,
  //   required: true
  // },
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
  // phases: {
  //   type: Types.ObjectId,
  // },
  assignedTo: {
    type: Types.ObjectId,
    ref: "User"
  }
})

module.exports = {
  ObjectModel: model('Object', schema)
}