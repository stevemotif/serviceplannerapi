const db = require("../models");
const Item = db.item;
const Section = db.section;

exports.create = async (req, res) => {
  try {
    const { name, notes, link, time, sectionId } = req.body;

    if (!name || !sectionId || !time) {
      return res
        .status(400)
        .send({ message: "Name, section ID, and time are required!" });
    }

    const section = await Section.findByPk(sectionId);
    if (!section) {
      return res
        .status(404)
        .send({ message: `Section with ID ${sectionId} not found.` });
    }

    const item = await Item.create({ name, notes, link, time, sectionId });
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
    const { name, notes, link, time, sectionId } = req.body;

    if (!name || !sectionId || !time) {
      return res
        .status(400)
        .send({ message: "Name, section ID, and time are required!" });
    }

    const section = await Section.findByPk(sectionId);
    if (!section) {
      return res
        .status(404)
        .send({ message: `Section with ID ${sectionId} not found.` });
    }

    const [updated] = await Item.update(
      { name, notes, link, time, sectionId },
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
    const item = await Item.findByPk(id);

    if (!item) {
      return res.status(404).send({ message: `Item with ID ${id} not found.` });
    }
    await Item.destroy({ where: { itemId: id } });
    res.status(200).send({
      message: `${item.name} deleted successfully.`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
