const { findAllContacts, findContactById } = require("../services/contacts");

const getContacts = async (req, res) => {
  try {
    const contacts = await findAllContacts();
    res
      .status(200)
      .json({
        status: 200,
        message: "Successfully found contacts!",
        data: contacts,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getContactById = async (req, res) => {
  try {
    const contact = await findContactById(req.params.contactId);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res
      .status(200)
      .json({
        status: 200,
        message: `Successfully found contact with id ${req.params.contactId}!`,
        data: contact,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getContacts, getContactById };
