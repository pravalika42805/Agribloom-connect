const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
{
  members: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User"
  },
  cropId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Crop"
  }
},
{ timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);
