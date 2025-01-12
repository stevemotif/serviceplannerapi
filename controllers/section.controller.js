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

    const section = await Section.create({ name, time });
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
    const sections = await Section.findAll();
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

    const [updated] = await Section.update(
      { name, time },
      { where: { sectionId: id } }
    );

    if (updated) {
      const updatedSection = await Section.findByPk(id);
      res.status(200).send(updatedSection);
    } else {
      res.status(404).send({ message: `Section with ID ${id} not found.` });
    }
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
    const section = await Section.findByPk(id);

    if (!section) {
      return res
        .status(404)
        .send({ message: `Section with ID ${id} not found.` });
    }
    await Section.destroy({ where: { sectionId: id } });
    res.status(200).send({
      message: `${section.name} deleted successfully.`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
