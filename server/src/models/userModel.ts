import mongoose, { Schema } from "mongoose";

export interface UserSchemaProps {
  fullName: string;
  email: string;
  password: string;
  isOnline: boolean;
  profilePhoto: {
    url: string;
    public_id: string;
  };
  isAdmin: boolean;
  notifications: [
    {
      message: mongoose.Schema.Types.ObjectId;
      chat: mongoose.Schema.Types.ObjectId;
    }
  ];
}

const userSchema = new Schema<UserSchemaProps>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isOnline: {
      type: Boolean,
      required: true,
      default: false,
    },
    profilePhoto: {
      url: {
        type: String,
      },
      public_id: {
        type: String,
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },

    notifications: [
      {
        message: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Message",
        },
        chat: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Chat",
        },
      },
    ],
  },
  { timestamps: true }
);

const UserAuth = mongoose.model("UserAuth", userSchema);

export default UserAuth;
