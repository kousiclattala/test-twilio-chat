const app = require("express");
const router = app.Router();

const User = require("./userModel");
const AccessToken = require("twilio").jwt.AccessToken;
const ChatGrant = AccessToken.ChatGrant;

router.get("/getToken/:identity", (req, res) => {
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

  // Create an access token which we will sign and return to the client,
  // containing the grant we just created
  const token = new AccessToken(
    twilioAccountSid,
    twilioApiKey,
    twilioApiSecret,
    { identity: req.params.identity }
  );

  token.addGrant(chatGrant);

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

module.exports = router;
