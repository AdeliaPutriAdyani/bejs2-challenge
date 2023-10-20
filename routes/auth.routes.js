const { registerUser, loginUser, getProfile } = require("../controllers/userControllers");
const { restrict } = require("../middleware/checkToken");
const router = require("express").Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", restrict, getProfile);

module.exports = router;