// import Contact from '../models/contactModel.js';
// import createError from 'http-errors';

// // Получение всех контактов
// export const getContacts = async (req, res, next) => {
//   const contacts = await Contact.find();
//   res.status(200).json({
//     status: 200,
//     message:
//       contacts.length > 0
//         ? 'Successfully found contacts!'
//         : 'No contacts found.',
//     data: contacts,
//   });
// };

// // Получение контакта по ID
// export const getContactById = async (req, res, next) => {
//   const contactId = req.params.id;
//   const contact = await Contact.findById(contactId);

//   if (!contact) {
//     throw createError(404, 'Contact not found');
//   }

//   res.status(200).json({
//     status: 200,
//     message: 'Successfully found contact!',
//     data: contact,
//   });
// };

// // Добавление нового контакта
// export const addContact = async (req, res, next) => {
//   const {
//     name,
//     phoneNumber,
//     email,
//     isFavourite,
//     contactType,
//     createdAt,
//     updatedAt,
//   } = req.body;

//   if (
//     !name ||
//     !phoneNumber ||
//     !contactType ||
//     isFavourite === undefined ||
//     !createdAt ||
//     !updatedAt
//   ) {
//     throw createError(400, 'Missing required fields');
//   }

//   const newContact = new Contact({
//     name,
//     phoneNumber,
//     email,
//     isFavourite,
//     contactType,
//     createdAt,
//     updatedAt,
//   });

//   await newContact.save();

//   res.status(201).json({
//     status: 201,
//     message: 'Contact created successfully',
//     data: newContact,
//   });
// };
