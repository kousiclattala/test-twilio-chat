const { json } = require("express");
const app = require("express");
const router = app.Router();

const User = require("./userModel");
const twilioClient = require("twilio")(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const AccessToken = require("twilio").jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;
const VideoGrant = AccessToken.VideoGrant;

router.get("/getToken/:identity/:roomName", (req, res) => {
  // Used when generating any kind of tokens
  const twilioAccountSid = process.env.TWILIO_SID;
  const twilioApiKey = process.env.TWILIO_API_KEY;
  const twilioApiSecret = process.env.TWILIO_SECRET;

  // Used specifically for creating Chat tokens
  const serviceSid = process.env.TWILIO_SERVICE_SID;

  // Create a "grant" which enables a client to use Chat as a given user,
  // on a given device
  const chatGrant = new ChatGrant({
    serviceSid: serviceSid,
  });
  const videoGrant = new VideoGrant({
    room: req.params.roomName,
  });
  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  const token = new AccessToken(
    twilioAccountSid,
    twilioApiKey,
    twilioApiSecret,
    { identity: req.params.identity }
  );

  token.addGrant(chatGrant);
  token.addGrant(videoGrant);

  // Serialize the token to a JWT string
  // console.log(token.toJwt());
  res.status(200).json(token.toJwt());
});

router.post("/createConversation", (req, res) => {
  const { conversationName } = req.body;

  twilioClient.conversations.v1.conversations
    .create({ friendlyName: conversationName })
    .then((conversation) => {
      res.status(200).json({
        message: "Conversation Created",
        conversation,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Server Error",
        err,
      });
    });
});

router.post("/createRoom", (req, res) => {
  const { uniqueName } = req.body;

  twilioClient.video.v1.rooms
    .create({ uniqueName: uniqueName })
    .then((room) => {
      res.status(200).json({
        message: "Room created",
        res: room,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Server Error",
        err,
      });
    });
});

router.post("/addParticipant", (req, res) => {
  const { uniqueId, sid } = req.body;

  twilioClient.conversations.v1
    .conversations(sid)
    .participants.create({ identity: uniqueId })
    .then((participant) => {
      res.status(200).json({
        message: "Participant added Succesfully to conversation",
        participant,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Server Error",
        err,
      });
    });
});

router.get("/getAllMessages", (req, res) => {
  //
});

router.post("/requestOTP", (req, res) => {
  try {
    const { phoneNumber } = req.body;

    twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: phoneNumber,
        channel: "sms",
      })
      .then((verification) => {
        console.log(verification);
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "OTP sent successfully",
          data: {
            otpStatus: verification.status,
            isValid: verification.valid,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({
          status: false,
          statusCode: 400,
          message: "error in sending OTP",
          data: err,
        });
      });
  } catch (error) {
    res.status(400).json({
      status: false,
      statusCode: 400,
      message: "Error in getting OTP",
      error,
    });
  }
});
router.post("/verifyOTP", (req, res) => {
  try {
    const { phoneNumber, code } = req.body;

    twilioClient.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        to: phoneNumber,
        code: code,
      })
      .then((verification_check) => {
        console.log(verification_check);
        res.status(200).json({
          status: true,
          statusCode: 200,
          message: "OTP sent successfully",
          data: {
            otpStatus: verification_check.status,
            isValid: verification_check.valid,
            test: true,
          },
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({
          status: false,
          statusCode: 400,
          message: "error in sending OTP",
          data: err,
        });
      });
  } catch (error) {
    res.status(400).json({
      status: false,
      statusCode: 400,
      message: "Error in getting OTP",
      error,
    });
  }
});

module.exports = router;
