//src/controllers/contactsController.js
import Contact from '../models/contactModel.js';

// Получение всех контактов
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();

    res.status(200).json({
      status: 200,
      message:
        contacts.length > 0
          ? 'Successfully found contacts!'
          : 'No contacts found.',
      data: contacts,
    });
  } catch (error) {
    console.error('Error in getContacts:', error);
    res.status(500).json({
      status: 500,
      message: 'Error retrieving contacts',
      data: null,
    });
  }
};

// Получение контакта по ID
export const getContactById = async (req, res) => {
  try {
    const contactId = req.params.id;
    const contact = await Contact.findById(contactId);

    if (!contact) {
      return res.status(404).json({
        status: 404,
        message: 'Contact not found',
        data: null,
      });
    }

    res.status(200).json({
      status: 200,
      message: 'Successfully found contact!',
      data: contact,
    });
  } catch (error) {
    console.error('Error in getContactById:', error);
    res.status(500).json({
      status: 500,
      message: 'Error retrieving contact',
      data: null,
    });
  }
};

// Добавление нового контакта
export const addContact = async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
      createdAt,
      updatedAt,
    } = req.body;

    if (
      !name ||
      !phoneNumber ||
      !contactType ||
      isFavourite === undefined ||
      !createdAt ||
      !updatedAt
    ) {
      return res.status(400).json({
        status: 400,
        message: 'Missing required fields',
        data: null,
      });
    }

    const newContact = new Contact({
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
      createdAt,
      updatedAt,
    });

    await newContact.save();

    res.status(201).json({
      status: 201,
      message: 'Contact created successfully',
      data: newContact,
    });
  } catch (error) {
    console.error('Error in addContact:', error);
    res.status(500).json({
      status: 500,
      message: 'Error adding contact',
      data: null,
    });
  }
};
