const express = require("express");
const router = express.Router();
const roleController = require("../controllers/role.controller");

router.post("/", roleController.create);
router.get("/all", roleController.findAll);
router.put("/:id", roleController.update);
router.delete("/:id", roleController.delete);

module.exports = router;