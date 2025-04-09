const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegisterDoctor",
      
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegisterUser", 
     
    },
    userType: {
      type: String,
      enum: ["patient", "doctor"],
      required: true,
    },
    notificationType: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

const Notification =  mongoose.model("Notification", notificationSchema);

module.exports = {Notification}