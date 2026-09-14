import mongoose, { Schema } from "mongoose";

const connectToDatabase = () => {
  const MONGODB_URL = process.env.MONGODB_URL!;
  return mongoose.connect(MONGODB_URL, { dbName: "Cluster0" });
};

connectToDatabase();

const overtimeRecordSchema = new Schema(
  {
    user: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    hours: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      required: false,
    },
    redeemed: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: "OvertimeRecord",
    timestamps: true,
  },
);

export const OvertimeRecordModel = mongoose.model(
  "OvertimeRecord",
  overtimeRecordSchema,
);
