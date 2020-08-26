const router = require("express").Router();
const confirmRouter = require("./confirm");
const oracleRouter = require("./oracle");
const verifyDocumentRouter = require("./verifyDocument");
const pepsRouter = require("./politicallyExposedPersons");
const contactsRouter = require("./contacts");

const whitelistByUsers = require("../middleware/whitelistByUsers");
const auth = require("../middleware/auth");

// router.use("/match", matchRouter);
router.use("/confirm", confirmRouter);
router.use(
  "/oracle",
  auth,
  whitelistByUsers(["Oracle", "Bartercard"]),
  oracleRouter
);
router.use("/verify-document", auth, verifyDocumentRouter);
router.use("/politically-exposed-persons", auth, pepsRouter);
router.use("/contacts", auth, contactsRouter);

router.get("/", (req, res) => res.send("4MDB Api"));

module.exports = router;
