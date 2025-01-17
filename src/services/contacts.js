const Contact = require("../models/contactModel");

const findAllContacts = async () => {
  return await Contact.find();
};

const findContactById = async (id) => {
  return await Contact.findById(id);
};

module.exports = { findAllContacts, findContactById };
