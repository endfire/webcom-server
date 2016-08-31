import { MANY, BELONGS, ONE } from './constants/relationships';
import * as types from './constants/entities';

const getRelationship = (type, relationship, inverse) => ({
  [type]: relationship,
  inverse,
});

export default {
  [types.USER]: {
    attributes: {
      name: true,
      email: true,
      password: true,
      role: true,
      meta: true,
    },
  },
  [types.COMPANY]: {
    attributes: {
      name: true,
      street: true,
      city: true,
      state: true,
      zip: true,
      phone: true,
      url: true,
      email: true,
      description: true,
      password: true,
      meta: true,
      approved: true,
    },
    relationships: {
      listings: getRelationship(MANY, types.LISTING, 'company'),
      ads: getRelationship(MANY, types.AD, 'company'),
      people: getRelationship(MANY, types.PERSON, 'company'),
    },
  },
  [types.LISTING]: {
    attributes: {
      meta: true,
      name: true,
      brand: true,
    },
    relationships: {
      company: getRelationship(BELONGS, types.COMPANY, 'listings'),
      categories: getRelationship(MANY, types.CATEGORY, 'listings'),
    },
  },
  [types.AD]: {
    attributes: {
      name: true,
      image: true,
      url: true,
      start: true,
      end: true,
      priority: true,
      meta: true,
    },
    relationships: {
      company: getRelationship(BELONGS, types.COMPANY, 'ads'),
      categories: getRelationship(MANY, types.CATEGORY, 'ads'),
    },
  },
  [types.PERSON]: {
    attributes: {
      name: true,
      email: true,
      phone: true,
      job: true,
      meta: true,
    },
    relationships: {
      company: getRelationship(BELONGS, types.COMPANY, 'people'),
    },
  },
  [types.BRAND]: {
    attributes: {
      name: true,
      image: true,
      background: true,
      text: true,
      secondary: true,
      obg: true,
      meta: true,
    },
    relationships: {
      forms: getRelationship(MANY, types.FORM, 'brand'),
      categories: getRelationship(MANY, types.CATEGORY, 'brand'),
    },
  },
  [types.CATEGORY]: {
    attributes: {
      name: true,
      heading: true,
      meta: true,
    },
    relationships: {
      brand: getRelationship(BELONGS, types.BRAND, 'categories'),
      listings: getRelationship(MANY, types.LISTING, 'categories'),
      ads: getRelationship(MANY, types.AD, 'categories'),
    },
  },
  [types.FORM]: {
    attributes: {
      name: true,
      didPublish: true,
      didInitialize: true,
      createdOn: true,
      meta: true,
    },
    relationships: {
      brand: getRelationship(BELONGS, types.BRAND, 'forms'),
      submissions: getRelationship(MANY, types.SUBMISSION, 'form'),
      fields: getRelationship(MANY, types.FIELD, 'form'),
      payment: getRelationship(ONE, types.PAYMENT, 'form'),
    },
  },
  [types.SUBMISSION]: {
    attributes: {
      meta: true,
      stripe: true,
      fields: true,
      payment: true,
      createdOn: true,
    },
    relationships: {
      form: getRelationship(BELONGS, types.FORM, 'submissions'),
    },
  },
  [types.FIELD]: {
    attributes: {
      label: true,
      placeholder: true,
      type: true,
      value: true,
      meta: true,
      createdOn: true,
      isRequired: true,
    },
    relationships: {
      form: getRelationship(BELONGS, types.FORM, 'fields'),
    },
  },
  [types.PAYMENT]: {
    attributes: {
      meta: true,
      expMonth: true,
      expYear: true,
      cardNumber: true,
      cardCvc: true,
    },
    relationships: {
      items: getRelationship(MANY, types.ITEM, 'payment'),
      form: getRelationship(BELONGS, types.FORM, 'payment'),
    },
  },
  [types.ITEM]: {
    attributes: {
      meta: true,
      price: true,
      quantity: true,
      description: true,
      createdOn: true,
      label: true,
    },
    relationships: {
      payment: getRelationship(BELONGS, types.PAYMENT, 'items'),
    },
  },
};
