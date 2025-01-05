const db = require("../models");
const Service = db.service;

exports.create = async (req, res) => {
  try {
    const { name, date, time } = req.body;

    if (!name || !date || !time) {
      return res
        .status(400)
        .send({ message: "Name, date, and time are required!" });
    }

    const service = await Service.create({ name, date, time });
    res.status(201).send(service);
  } catch (error) {
    console.log(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).send({ message: "Service name must be unique!" });
    } else {
      res.status(500).send({ message: error.message });
    }
  }
};

exports.findAll = async (req, res) => {
  try {
    const services = await Service.findAll();
    res.status(200).send(services);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, date, time } = req.body;

    if (!name || !date || !time) {
      return res
        .status(400)
        .send({ message: "Name, date, and time are required!" });
    }

    const [updated] = await Service.update(
      { name, date, time },
      { where: { serviceId: id } }
    );

    if (updated) {
      const updatedService = await Service.findByPk(id);
      res.status(200).send(updatedService);
    } else {
      res.status(404).send({ message: `Service with ID ${id} not found.` });
    }
  } catch (error) {
    console.log(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).send({ message: "Service name must be unique!" });
    } else {
      res.status(500).send({ message: error.message });
    }
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Service.destroy({ where: { serviceId: id } });
    if (deleted) {
      res
        .status(200)
        .send({ message: `Service with ID ${id} deleted successfully.` });
    } else {
      res.status(404).send({ message: `Service with ID ${id} not found.` });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};
