const db = require("../models");
const Church = db.church;

exports.create = async (req, res) => {
  try {
    const { churchName } = req.body;
    if (!churchName) {
      return res.status(400).send({ message: "Church name is required!" });
    }
    const church = await Church.create({ churchName });
    res.status(201).send(church);
  } catch (error) {
    console.log(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).send({ message: "Church name must be unique!" });
    } else {
      res.status(500).send({ message: error.message });
    }
  }
};

exports.findAll = async (req, res) => {
  try {
    const churches = await Church.findAll();
    res.status(200).send(churches);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { churchName } = req.body;

    if (!churchName) {
      return res.status(400).send({ message: "Church name is required!" });
    }

    const [updated] = await Church.update(
      { churchName },
      { where: { churchId: id } }
    );

    if (updated) {
      const updatedChurch = await Church.findByPk(id);
      res.status(200).send(updatedChurch);
    } else {
      res.status(404).send({ message: `Church with ID ${id} not found.` });
    }
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).send({ message: "Church name must be unique!" });
    } else {
      res.status(500).send({ message: error.message });
    }
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Church.destroy({ where: { churchId: id } });

    if (deleted) {
      res
        .status(200)
        .send({ message: `Church with ID ${id} deleted successfully.` });
    } else {
      res.status(404).send({ message: `Church with ID ${id} not found.` });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
