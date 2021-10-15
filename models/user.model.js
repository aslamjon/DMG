const {Schema, model, Types} = require('mongoose');

const schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  rule: {
    type: String,
    required: true
  }
})

module.exports = {
  UserModel: model('User', schema)
}