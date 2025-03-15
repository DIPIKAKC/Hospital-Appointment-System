const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECT_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`Database connected: ${connect.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to the database: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDb;
