const express = require("express");
const router = express.Router();
const services = require("../controllers/service.controller");

router.post("/", services.create);
router.get("/all", services.findAll);
router.put("/:id", services.update);
router.delete("/:id", services.delete);

module.exports = router;
