const express = require("express");
const {
  getContacts,
  getContactById,
} = require("../controllers/contactsController");

const router = express.Router();

router.get("/", getContacts);
router.get("/:contactId", getContactById);

module.exports = router;
