const mongoose = require('mongoose');

const { Schema } = mongoose;
const roomSchema = new Schema({
  title: { //방제
    type: String,
    required: true,
  },
  max: { //최대 몇명까지 수용가능한지
    type: Number,
    required: true,
    default: 10,
    min: 2,
  },
  owner: {  //방장누군지
    type: String,
    required: true,
  },
  password: String, //방 비밀번호 있어도 되고 없어도 되고 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Room', roomSchema);