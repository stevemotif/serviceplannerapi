const db = require("../models");
const Member = db.member;
const Role = db.role;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.create = async (req, res) => {
  try {
    const { name, email, password, phoneNumber, address, roleId, dateOfBirth } =
      req.body;

    if (
      !name ||
      !email ||
      !password ||
      !phoneNumber ||
      !address ||
      !dateOfBirth
    ) {
      return res.status(400).send({ message: "All fields are required!" });
    }

    const existingUser = await Member.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send({ message: "Email already in use!" });
    }
    let roleTemp = roleId;
    if (!roleTemp) {
      const roletemp = await Role.findOne({ where: { level: 1 } });
      roleTemp = roletemp.id;
    } else {
      const role = await Role.findByPk(roleId);
      if (!role) {
        return res
          .status(404)
          .send({ message: `Role with ID ${roleId} not found.` });
      }
      roleTemp = role.id;
    }

    const member = await Member.create({
      name,
      email,
      password,
      phoneNumber,
      address,
      roleId: roleTemp,
      dateOfBirth,
    });

    res.status(201).send({ message: "Member created successfully!", member });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Email and password are required!" });
    }

    const member = await Member.findOne({ where: { email } });
    if (!member) {
      return res.status(400).send({ message: "User does not exist!" });
    }
    const isMatch = await bcrypt.compare(password, member.password);

    if (!isMatch) {
      return res.status(400).send({ message: "Invalid credentials!" });
    }

    const token = jwt.sign(
      { memberId: member.memberId, roleId: member.roleId },
      "secretkey"
    );

    res.status(200).send({ token, member });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
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
    const { name, roleId, dateOfBirth, email, phoneNumber, address, password } =
      req.body;

    if (
      !name ||
      !roleId ||
      !dateOfBirth ||
      !email ||
      !phoneNumber ||
      !address
    ) {
      return res
        .status(400)
        .send({ message: "All fields except password are required!" });
    }

    const role = await Role.findByPk(roleId);
    if (!role) {
      return res
        .status(404)
        .send({ message: `Role with ID ${roleId} not found.` });
    }

    let updateData = { name, roleId, dateOfBirth, email, phoneNumber, address };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const [updated] = await Member.update(updateData, {
      where: { memberId: id },
    });

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
      res.status(400).send({ message: "Email must be unique!" });
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
