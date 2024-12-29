const db = require("../models");
const Role = db.role;

exports.create = async (req, res) => {
  try {
    const { roleName, level } = req.body;

    if (!roleName || !level) {
      return res
        .status(400)
        .send({ message: "Role name and level are required!" });
    }

    const role = await Role.create({ roleName, level });
    res.status(201).send(role);
  } catch (error) {
    console.log(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).send({ message: "Role name already exists!" });
    } else {
      res.status(500).send({ message: error.message });
    }
  }
};

exports.findAll = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).send(roles);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { roleName, level } = req.body;

    if (!roleName || !level) {
      return res
        .status(400)
        .send({ message: "Role name and level are required!" });
    }

    const [updated] = await Role.update({ roleName, level }, { where: { id } });

    if (updated) {
      const updatedRole = await Role.findByPk(id);
      res.status(200).send(updatedRole);
    } else {
      res.status(404).send({ message: `Role with ID ${id} not found.` });
    }
  } catch (error) {
    console.log(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).send({ message: "Role name already exists!" });
    } else {
      res.status(500).send({ message: error.message });
    }
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Role.destroy({ where: { id } });

    if (deleted) {
      res.status(200).send({ message: "Role deleted successfully." });
    } else {
      res.status(404).send({ message: `Role with ID ${id} not found.` });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
