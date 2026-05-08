import Subscriber from "../models/subscriberModel.js";
import sendSubscribeMail from "../utils/sendMail.js";

export const subscribeUser = async (req, res) => {
  const { email } = req.body;

  try {
    // Check duplicate
    console.log("API HIT", req.body);
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Already subscribed" });
    }

    // Save in DB
    const newSubscriber = new Subscriber({ email });
    await newSubscriber.save();

    // Send email
    console.log("Before sending mail");
    await sendSubscribeMail(email);
    console.log("After sending mail");

    res.status(200).json({ message: "Subscribed successfully" });
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};