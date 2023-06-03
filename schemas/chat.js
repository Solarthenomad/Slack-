const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId } } = Schema;
const chatSchema = new Schema({
  room: {
    type: ObjectId, //방에 대한 아이디(룸에 대한 오브첵트 아이디)
    required: true,
    ref: 'Room',
  },
  user: { //대화 누가 보냈는지
    type: String,
    required: true,
  },
  chat: String,
  gif: String, //이미지만 보내거나 채팅만 보내거나
  createdAt: {
    type: Date,
    default: Date.now, //채팅 입력한 시간
  },
});

module.exports = mongoose.model('Chat', chatSchema);