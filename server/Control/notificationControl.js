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

    // Basic validations
    if ( !userType || !notificationType || !content) {
      return res.status(400).json({success:false, message: "All fields are required." });
    }

    // Optional: validate doctorId and userId exist in DB
    let user, doctor
    if(userId){

         user = await RegisterUser.findById(userId);
    }
    if(doctorId){

         doctor = await RegisterDoctor.findById(doctorId);
    }

    // if (!doctor) {
    //   return res.status(404).json({success:false, message: "Doctor not found." });
    // }
    // if (!user) {
    //   return res.status(404).json({success:false, message: "User not found." });
    // }

    // Create and save the notification
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
  try {
      const {id, userType} = req.params
      let myNoti;
      if(userType === 'patient'){
          myNoti =await Notification.find({userId:id})
      }else{
          myNoti =await Notification.find({doctorId:id})
      }
  
      if(!myNoti || myNoti.length === 0){
          return res.status(401).json({success:false, message:"No Notifications"})
      }
      return res.status(200).json({success:true, message:"Notification Found", data:myNoti})
  } catch (error) {
    console.log("Error getting notification :", error)
    return res.status(401).json({success:false, message:"Internal Server Error"})

  }
}






module.exports = {createNotification, getNotification}
