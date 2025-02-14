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
    const member = await db.member.findByPk(req.user.memberId);
    if (!member) {
      return res.status(404).send({ message: "Member not found!" });
    }
    const church = await Church.create({
      churchName,
      address,
      isActive,
      createdBy: req.user.memberId,
      adminId: member.adminId || req.user.memberId,
    });

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
    const reqMember = await db.member.findByPk(req.user.memberId);
    if (!reqMember) {
      return res.status(404).send({ message: "Member not found!" });
    }
    const churches = await Church.findAll({
      where: { adminId: reqMember.adminId || req.user.memberId },
    });
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
    const member = await db.member.findByPk(req.user.memberId);
    if (!member) {
      return res.status(404).send({ message: "Member not found!" });
    }
    const church = await Church.findOne({
      where: { churchId: id, createdBy: req.user.memberId },
    });

    if (!church) {
      return res.status(404).send({
        message: `Church with ID ${id} not found or not owned by you.`,
      });
    }

    await church.update({ churchName, address, isActive });

    res.status(200).send(church);
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
    const member = await db.member.findByPk(req.user.memberId);
    if (!member) {
      return res.status(404).send({ message: "Member not found!" });
    }
    const church = await Church.findOne({
      where: { churchId: id, createdBy: req.user.memberId },
    });

    if (!church) {
      return res.status(404).send({
        message: `Church with ID ${id} not found or not owned by you.`,
      });
    }

    await Church.destroy({ where: { churchId: id } });

    res
      .status(200)
      .send({ message: `${church.churchName} deleted successfully.` });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
