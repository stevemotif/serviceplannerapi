const sections = require("../controllers/section.controller");

module.exports = (app) => {
  app.post("/", sections.create);
  app.get("/all", sections.findAll);
  app.put("/:id", sections.update);
  app.delete("/:id", sections.delete);
};
