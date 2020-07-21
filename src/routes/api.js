const router = require("express").Router();
const confirmRouter = require("./confirm");
const oracleRouter = require("./oracle");
const verifyDocumentRouter = require("./verifyDocument");
const pepsRouter = require("./politicallyExposedPersons");
const whitelistByUsers = require("../middleware/whitelistByUsers");
const auth = require("../middleware/auth");

// router.use("/match", matchRouter);
router.use("/confirm", confirmRouter);
router.use("/oracle", auth, whitelistByUsers(["Oracle"]), oracleRouter);
router.use("/verify-document", auth, verifyDocumentRouter);
router.use("/politically-exposed-persons", auth, pepsRouter);

router.get("/", (req, res) => res.send("IMX Api"));

module.exports = router;
