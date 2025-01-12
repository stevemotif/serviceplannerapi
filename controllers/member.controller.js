const db = require("../models");
const Member = db.member;
const Role = db.role;

exports.create = async (req, res) => {
  try {
    const { name, roleId, dateOfBirth } = req.body;

    if (!name || !roleId || !dateOfBirth) {
      return res
        .status(400)
        .send({ message: "Name, role ID, and date of birth are required!" });
    }

    const role = await Role.findByPk(roleId);
    if (!role) {
      return res
        .status(404)
        .send({ message: `Role with ID ${roleId} not found.` });
    }

    const member = await Member.create({ name, roleId, dateOfBirth });
    res.status(201).send(member);
  } catch (error) {
    console.log(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).send({ message: "Member name must be unique!" });
    } else {
      res.status(500).send({ message: error.message });
    }
  }
};

exports.findAll = async (req, res) => {
  try {
    const members = await Member.findAll({
      include: {
        model: Role,
        as: "role",
        attributes: ["roleName", "level"],
      },
    });
    res.status(200).send(members);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, roleId, dateOfBirth } = req.body;

    if (!name || !roleId || !dateOfBirth) {
      return res
        .status(400)
        .send({ message: "Name, role ID, and date of birth are required!" });
    }

    const role = await Role.findByPk(roleId);
    if (!role) {
      return res
        .status(404)
        .send({ message: `Role with ID ${roleId} not found.` });
    }

    const [updated] = await Member.update(
      { name, roleId, dateOfBirth },
      { where: { memberId: id } }
    );

    if (updated) {
      const updatedMember = await Member.findByPk(id, {
        include: {
          model: Role,
          as: "role",
          attributes: ["roleName", "level"],
        },
      });
      res.status(200).send(updatedMember);
    } else {
      res.status(404).send({ message: `Member with ID ${id} not found.` });
    }
  } catch (error) {
    console.log(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).send({ message: "Member name must be unique!" });
    } else {
      res.status(500).send({ message: error.message });
    }
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await Member.findByPk(id);
    if (!member) {
      return res
        .status(404)
        .send({ message: `Member with ID ${id} not found.` });
    }

    await Member.destroy({ where: { memberId: id } });
    res.status(200).send({ message: `${member.name} deleted successfully.` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

exports.assignRole = async (req, res) => {
  try {
    const { memberId, roleId } = req.body;

    if (!memberId || !roleId) {
      return res
        .status(400)
        .send({ message: "Member ID and Role ID are required!" });
    }

    const member = await Member.findByPk(memberId);
    if (!member) {
      return res
        .status(404)
        .send({ message: `Member with ID ${memberId} not found.` });
    }

    const role = await Role.findByPk(roleId);
    if (!role) {
      return res
        .status(404)
        .send({ message: `Role with ID ${roleId} not found.` });
    }

    member.roleId = roleId;
    await member.save();

    const updatedMember = await Member.findByPk(memberId, {
      include: {
        model: Role,
        as: "role",
        attributes: ["roleName", "level"],
      },
    });

    res.status(200).send(updatedMember);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
