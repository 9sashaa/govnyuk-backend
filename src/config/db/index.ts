import mongoose from "mongoose";

export const connectToDb = async () => {
  try {
    await mongoose.connect(String(process.env.MONGODB_URI));
    console.log("Database is connected");
  } catch (e) {
    console.log(e, " ERROR connect");
  }
  mongoose.connection.on("error", (err) => {
    console.log("err", err);
  });

  mongoose.connection.on("connected", (err, res) => {
    console.log(`DB is connected. ${res}`);
  });
};
