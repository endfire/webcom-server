import { MANY, BELONGS } from './constants/relationships';

import {
  USER,
  COMPANY,
  AD,
  PERSON,
  BRAND,
  CATEGORY,
  FORM,
  SUBMISSION,
  FIELD,
} from './constants/entities';

const getRelationship = (type, relationship, inverse) => ({
  [type]: relationship,
  inverse,
});

export default {
  [USER]: {
    attributes: {
      name: true,
      email: true,
      password: true,
      role: true,
    },
  },
  [COMPANY]: {
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
    },
    relationships: {
      listings: getRelationship(MANY, CATEGORY, 'listings'),
      ads: getRelationship(MANY, COMPANY, 'company'),
      people: getRelationship(MANY, PERSON, 'company'),
    },
  },
  [AD]: {
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
      company: getRelationship(BELONGS, COMPANY, 'ads'),
      categories: getRelationship(MANY, CATEGORY, 'ads'),
    },
  },
  [PERSON]: {
    attributes: {
      name: true,
      email: true,
      phone: true,
      job: true,
      meta: true,
    },
    relationships: {
      company: getRelationship(BELONGS, COMPANY, 'people'),
    },
  },
  [BRAND]: {
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
      forms: getRelationship(MANY, FORM, 'brand'),
      categories: getRelationship(MANY, CATEGORY, 'brand'),
    },
  },
  [CATEGORY]: {
    attributes: {
      name: true,
      heading: true,
      meta: true,
    },
    relationships: {
      brand: getRelationship(BELONGS, BRAND, 'categories'),
      listings: getRelationship(MANY, COMPANY, 'listings'),
      ads: getRelationship(MANY, AD, 'categories'),
    },
  },
  [FORM]: {
    attributes: {
      name: true,
      published: true,
      meta: true,
    },
    relationships: {
      brand: getRelationship(BELONGS, BRAND, 'forms'),
      submissions: getRelationship(MANY, SUBMISSION, 'form'),
      fields: {
        [MANY]: FIELD,
        embedded: true,
      },
    },
  },
  [SUBMISSION]: {
    attributes: {
      meta: true,
      stripe: true,
    },
    relationships: {
      form: getRelationship(BELONGS, FORM, 'submissions'),
      fields: {
        [MANY]: FIELD,
        embedded: true,
      },
    },
  },
  [FIELD]: {
    attributes: {
      section: true,
      label: true,
      placeholder: true,
      type: true,
      value: true,
      priority: true,
    },
  },
};
