const express = require("express");
const router = express.Router();
const items = require("../controllers/item.controller");

router.post("/", items.create);
router.get("/all", items.findAll);
router.put("/:id", items.update);
router.delete("/:id", items.delete);

module.exports = router;
