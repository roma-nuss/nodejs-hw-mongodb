import Contact from '../models/contactModel.js';

export const findAllContacts = async () => {
  return await Contact.find();
};

export const findContactById = async (id) => {
  return await Contact.findById(id);
};
