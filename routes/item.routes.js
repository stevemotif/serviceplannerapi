const items = require("../controllers/item.controller");

module.exports = (app) => {
  app.post("/", items.create);
  app.get("/all", items.findAll);
  app.put("/:id", items.update);
  app.delete("/:id", items.delete);
};
