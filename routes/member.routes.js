const express = require("express");
const router = express.Router();
const memberController = require("../controllers/member.controller");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/login", memberController.login);
router.post("/signup", memberController.signup);
router.post("/", authMiddleware, memberController.create);
router.get("/all", authMiddleware, memberController.findAll);
router.put("/assign-role", authMiddleware, memberController.assignRole);
router.put("/:id", authMiddleware, memberController.update);
router.delete("/:id", authMiddleware, memberController.delete);

module.exports = router;
