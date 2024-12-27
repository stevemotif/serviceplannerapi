const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');

const app = express();
app.use(bodyParser.json());

const churchRoutes = require('./routes/church.routes');
app.use('/api/church', churchRoutes);

db.sequelize.sync({ force: false }).then(() => {
  console.log('Database synchronized successfully.');
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
