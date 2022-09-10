import mongoose, { Schema, Types } from "mongoose";

export interface DeletedInfoProps {
  user: mongoose.Schema.Types.ObjectId;
  isVisible: boolean;
  isVisibleLatestMessage: boolean;
  time: Date;
}

interface MessageProps {
  content: string;
  sender: string;
}

export interface LatestMessageProps {
  user: string;
  message: MessageProps | null;
}

export interface ChatSchemaProps {
  chatName: string;
  isGroupChat: boolean;
  users: mongoose.Schema.Types.ObjectId[];
  groupAdmin: mongoose.Schema.Types.ObjectId;
  latestMessage: mongoose.Schema.Types.ObjectId[];
  deletedInfo: DeletedInfoProps[];
}

const chatSchema = new Schema<ChatSchemaProps>(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "UserAuth" }],
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAuth",
    },
    latestMessage: [
      {
        message: {
          content: { type: String },
          sender: { type: String },
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "UserAuth",
        },
      },
    ],
    deletedInfo: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "UserAuth",
        },
        time: { type: Date },
        isVisible: { type: Boolean },
        isVisibleLatestMessage: { type: Boolean },
      },
    ],
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
