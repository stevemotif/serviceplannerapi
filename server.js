const express = require("express");
const bodyParser = require("body-parser");
const db = require("./models");

const app = express();
app.use(bodyParser.json());

const churchRoutes = require("./routes/church.routes");
const roleRoutes = require("./routes/role.routes");
const memberRoutes = require("./routes/member.routes");
const sectionRoutes = require("./routes/section.routes");
const itemRoutes = require("./routes/item.routes");
const serviceRoutes = require("./routes/service.routes");

app.use("/api/church", churchRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/member", memberRoutes);
app.use("/api/section", sectionRoutes);
app.use("/api/item", itemRoutes);
app.use("/api/service", serviceRoutes);

db.sequelize.sync({ force: false }).then(() => {
  console.log("Database synchronized successfully.");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
