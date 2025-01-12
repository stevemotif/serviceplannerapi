const db = require("../models");
const Church = db.church;

exports.create = async (req, res) => {
  try {
    const { churchName, address, isActive } = req.body;

    if (!churchName || !address) {
      return res
        .status(400)
        .send({ message: "Church name and address are required!" });
    }

    const church = await Church.create({ churchName, address, isActive });
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
    const { churchName, address, isActive } = req.body;

    if (!churchName || !address) {
      return res
        .status(400)
        .send({ message: "Church name and address are required!" });
    }

    const [updated] = await Church.update(
      { churchName, address, isActive },
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

    const church = await Church.findByPk(id);
    if (!church) {
      return res
        .status(404)
        .send({ message: `Church with ID ${id} not found.` });
    }

    await Church.destroy({ where: { churchId: id } });

    res
      .status(200)
      .send({ message: `${church.churchName} deleted successfully.` });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
