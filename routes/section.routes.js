const express = require("express");
const router = express.Router();
const sections = require("../controllers/section.controller");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, sections.create);
router.get("/all", authMiddleware, sections.findAll);
router.put("/:id", authMiddleware, sections.update);
router.delete("/:id", authMiddleware, sections.delete);

module.exports = router;
