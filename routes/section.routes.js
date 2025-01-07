const express = require("express");
const router = express.Router();
const sections = require("../controllers/section.controller");

router.post("/", sections.create);
router.get("/all", sections.findAll);
router.put("/:id", sections.update);
router.delete("/:id", sections.delete);

module.exports = router;
