const db = require("../models");
const Section = db.section;

exports.create = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).send({ message: "Section name is required!" });
    }

    const section = await Section.create({ name });
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
    const { name } = req.body;

    if (!name) {
      return res.status(400).send({ message: "Section name is required!" });
    }

    const [updated] = await Section.update(
      { name },
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

    const deleted = await Section.destroy({ where: { sectionId: id } });
    if (deleted) {
      res
        .status(200)
        .send({ message: `Section with ID ${id} deleted successfully.` });
    } else {
      res.status(404).send({ message: `Section with ID ${id} not found.` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
