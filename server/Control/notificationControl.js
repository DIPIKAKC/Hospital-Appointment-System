const {Notification} = require("../Schema/notificationSchema")
const {RegisterUser, RegisterDoctor} = require("../Schema/registerSchema") //imported schema

// Create Notification
 const createNotification = async (req, res) => {
  try {
    const {
      doctorId,
      userId,
      userType,
      notificationType,
      content,
    } = req.body;

    if ( !userType || !notificationType || !content) {
      return res.status(400).json({success:false, message: "All fields are required." });
    }

    let user, doctor
    if(userId){

         user = await RegisterUser.findById(userId);
    }
    if(doctorId){

         doctor = await RegisterDoctor.findById(doctorId);
    }
    
    const newNotification = new Notification({
      doctorId,
      userId,
      userType,
      notificationType,
      content,
    });

    await newNotification.save();

    res.status(201).json({
        success:true,
      message: "Notification created successfully.",
      data: newNotification,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({success:false, message: "Server Error" });
  }
};


const getNotification = async(req,res)=>{
      const {id, userType} = req.params;

      try{
        let query = {};

        if (userType === "doctor") {
          query = {
            doctorId: id,
            userType: "doctor" // only notifications meant for the doctor
          };
        } else if (userType === "patient") {
            query = {
              userId: id,
              userType: "patient"
            };
        }else {
          return res.status(400).json({ success: false, message: "Invalid user type" });
        }

        const notifications = await Notification.find(query).sort({ createdAt: -1 });
  
      if(!notifications || notifications.length === 0){
          return res.status(400).json({success:false, message:"No Notifications"})
      }
      res.status(200).json({
        success: true,
        message: "Notification found",
        data: notifications});  
      } catch (error) {
    console.log("Error getting notification :", error)
    return res.status(500).json({success:false, message:"Internal Server Error", error:error.message})

  }
}



// one noti
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Notification.findByIdAndUpdate(id, { isRead: true }, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, message: "Marked as read", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};


//all noti
const markAllNotificationsAsRead = async (req, res) => {
  try {
    const { userId, userType } = req.params;

    const filter = userType === "doctor"
      ? { doctorId: userId, userType }
      : { userId: userId, userType };

    const updated = await Notification.updateMany(filter, { isRead: true });

    res.status(200).json({ success: true, message: "All marked as read", updatedCount: updated.modifiedCount });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
};



module.exports = {createNotification, getNotification,markNotificationAsRead, markAllNotificationsAsRead}
