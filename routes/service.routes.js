const services = require("../controllers/service.controller");

module.exports = (app) => {
  app.post("/", services.create);
  app.get("/all", services.findAll);
  app.put("/:id", services.update);
  app.delete("/:id", services.delete);
};
