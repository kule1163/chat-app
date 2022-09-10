import mongoose, { Schema, Types } from "mongoose";

interface MessageSchemaProps {
  sender: mongoose.Schema.Types.ObjectId;
  content: string;
  chat: mongoose.Schema.Types.ObjectId;
  readBy: mongoose.Schema.Types.ObjectId[];
  users: mongoose.Schema.Types.ObjectId[];
}

const messageSchema = new Schema<MessageSchemaProps>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAuth",
      required: true,
    },
    content: { type: String, trim: true, required: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat", required: true },
    readBy: [
      { type: mongoose.Schema.Types.ObjectId, ref: "UserAuth", required: true },
    ],
    users: [
      { type: mongoose.Schema.Types.ObjectId, ref: "UserAuth", required: true },
    ],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
