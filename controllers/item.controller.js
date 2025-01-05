const db = require("../models");
const Item = db.item;
const Section = db.section;

exports.create = async (req, res) => {
  try {
    const { name, description, sectionId } = req.body;

    if (!name || !sectionId) {
      return res
        .status(400)
        .send({ message: "Name and section ID are required!" });
    }

    const section = await Section.findByPk(sectionId);
    if (!section) {
      return res
        .status(404)
        .send({ message: `Section with ID ${sectionId} not found.` });
    }

    const item = await Item.create({ name, description, sectionId });
    res.status(201).send(item);
  } catch (error) {
    console.log(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).send({ message: "Item name must be unique!" });
    } else {
      res.status(500).send({ message: error.message });
    }
  }
};

exports.findAll = async (req, res) => {
  try {
    const items = await Item.findAll({
      include: {
        model: Section,
        as: "section",
        attributes: ["name"],
      },
    });
    res.status(200).send(items);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, sectionId } = req.body;

    if (!name || !sectionId) {
      return res
        .status(400)
        .send({ message: "Name and section ID are required!" });
    }

    const section = await Section.findByPk(sectionId);
    if (!section) {
      return res
        .status(404)
        .send({ message: `Section with ID ${sectionId} not found.` });
    }

    const [updated] = await Item.update(
      { name, description, sectionId },
      { where: { itemId: id } }
    );

    if (updated) {
      const updatedItem = await Item.findByPk(id, {
        include: {
          model: Section,
          as: "section",
          attributes: ["name"],
        },
      });
      res.status(200).send(updatedItem);
    } else {
      res.status(404).send({ message: `Item with ID ${id} not found.` });
    }
  } catch (error) {
    console.log(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).send({ message: "Item name must be unique!" });
    } else {
      res.status(500).send({ message: error.message });
    }
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Item.destroy({ where: { itemId: id } });
    if (deleted) {
      res
        .status(200)
        .send({ message: `Item with ID ${id} deleted successfully.` });
    } else {
      res.status(404).send({ message: `Item with ID ${id} not found.` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
