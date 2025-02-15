const db = require("../models");
const Section = db.section;

exports.create = async (req, res) => {
  try {
    const { name, time } = req.body;

    if (!name || !time) {
      return res
        .status(400)
        .send({ message: "Section name and time are required!" });
    }

    const member = await db.member.findByPk(req.user.memberId);
    if (!member) {
      return res.status(404).send({ message: "Member not found!" });
    }

    const section = await Section.create({
      name,
      time,
      createdBy: req.user.memberId,
      adminId: member.adminId || req.user.memberId,
    });

    res.status(201).send(section);
  } catch (error) {
    console.log(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).send({ message: "Section name must be unique!" });
    } else {
      res.status(500).send({ message: error.message });
    }
  }
};

exports.findAll = async (req, res) => {
  try {
    const reqMember = await db.member.findByPk(req.user.memberId);
    if (!reqMember) {
      return res.status(404).send({ message: "Member not found!" });
    }

    const sections = await Section.findAll({
      where: { adminId: reqMember.adminId || req.user.memberId },
    });

    res.status(200).send(sections);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, time } = req.body;

    if (!name || !time) {
      return res
        .status(400)
        .send({ message: "Section name and time are required!" });
    }

    const member = await db.member.findByPk(req.user.memberId);
    if (!member) {
      return res.status(404).send({ message: "Member not found!" });
    }

    const section = await Section.findOne({
      where: { sectionId: id, createdBy: req.user.memberId },
    });

    if (!section) {
      return res
        .status(404)
        .send({
          message: `Section with ID ${id} not found or not owned by you.`,
        });
    }

    await section.update({ name, time });

    res.status(200).send(section);
  } catch (error) {
    console.log(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).send({ message: "Section name must be unique!" });
    } else {
      res.status(500).send({ message: error.message });
    }
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const member = await db.member.findByPk(req.user.memberId);
    if (!member) {
      return res.status(404).send({ message: "Member not found!" });
    }

    const section = await Section.findOne({
      where: { sectionId: id, createdBy: req.user.memberId },
    });

    if (!section) {
      return res
        .status(404)
        .send({
          message: `Section with ID ${id} not found or not owned by you.`,
        });
    }

    await Section.destroy({ where: { sectionId: id } });

    res.status(200).send({ message: `${section.name} deleted successfully.` });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
