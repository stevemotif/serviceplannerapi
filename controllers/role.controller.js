const db = require("../models");
const Role = db.role;
const { Op } = require("sequelize");

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
    const { forMembers } = req.query;

    const whereCondition = {};
    if (forMembers === "true") {
      whereCondition.level = { [Op.ne]: 1 };
    }

    const roles = await Role.findAll({ where: whereCondition });

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
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).send({ message: `Role with ID ${id} not found.` });
    }

    await Role.destroy({ where: { id } });

    res.status(200).send({ message: `${role.roleName} deleted successfully.` });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
