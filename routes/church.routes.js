const express = require("express");
const router = express.Router();
const churchController = require("../controllers/church.controller");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, churchController.create);
router.get("/all", authMiddleware, churchController.findAll);
router.put("/:id", authMiddleware, churchController.update);
router.delete("/:id", authMiddleware, churchController.delete);

module.exports = router;
