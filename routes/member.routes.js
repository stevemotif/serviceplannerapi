const express = require("express");
const router = express.Router();
const memberController = require("../controllers/member.controller");

router.post("/", memberController.create);
router.get("/all", memberController.findAll);
router.put("/assign-role", memberController.assignRole);
router.put("/:id", memberController.update);
router.delete("/:id", memberController.delete);

module.exports = router;
