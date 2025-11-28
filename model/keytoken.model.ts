// model/keytoken.model.ts
import { Document, Schema, model } from "mongoose";

export const DOCUMENT_NAME = "Key";
export const COLLECTION_NAME = "Keys";

// Interface cho KeyToken document
export interface IKeyTokenDocument extends Document {
  userId: Schema.Types.ObjectId; // ObjectId string
  publicKey: string;
  privateKey: string;
  refreshTokenUsed: string[];
  refreshToken: string;
  accessToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const KeyTokenSchema = new Schema<IKeyTokenDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refreshTokenUsed: {
      type: [String],
      default: [],
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME, // phải là collection, không phải COLLECTION_NAME
  }
);

export default model<IKeyTokenDocument>(DOCUMENT_NAME, KeyTokenSchema);
