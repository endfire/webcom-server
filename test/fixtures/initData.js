import * as types from '../../src/constants/entities';

export default {
  test: {
    [types.USER]: [{
      id: '1',
      name: 'Marsha',
      email: 'marsha@webcom.com',
      password: '$2a$10$McSj/jcx9csunmv47hp.9eJTwA2LLrs.hb115ccXzWZe6WE7KVo6G',
      role: '1',
      meta: {
        archived: false,
      },
    }],
    [types.COMPANY]: [{
      id: '1',
      name: 'Company One',
      street: '123 S. Me Lane',
      city: 'Littleton',
      state: 'CO',
      zip: '80122',
      phone: '3031234567',
      url: 'http://me.com',
      email: 'test@company.com',
      description: 'Hello World',
      password: '$2a$10$McSj/jcx9csunmv47hp.9eJTwA2LLrs.hb115ccXzWZe6WE7KVo6G',
      listings: [{
        id: '1',
        archived: false,
      }, {
        id: '2',
        archived: false,
      }],
      ads: [{
        id: '1',
        archived: false,
      }, {
        id: '2',
        archived: false,
      }],
      people: [{
        id: '1',
        archived: false,
      }, {
        id: '2',
        archived: false,
      }],
      meta: {
        archived: false,
      },
    }],
    [types.AD]: [{
      id: '1',
      name: 'Ad 1',
      image: 'http://image.com',
      url: 'https://google.com',
      start: 'Today',
      end: 'Tomorrow',
      priority: '5',
      company: {
        id: '1',
        archived: false,
      },
      categories: [{
        id: '1',
        archived: false,
      }],
      meta: {
        archived: false,
      },
    }, {
      id: '2',
      name: 'Ad 2',
      image: 'http://image.com',
      url: 'https://google.com',
      start: 'Today',
      end: 'Tomorrow',
      priority: '2',
      company: {
        id: '1',
        archived: false,
      },
      categories: [{
        id: '2',
        archived: false,
      }],
      meta: {
        archived: false,
      },
    }],
    [types.PERSON]: [{
      id: '1',
      name: 'Billy Jean',
      email: 'billy@company.com',
      phone: '3031234567',
      job: 'Janitor',
      company: {
        id: '1',
        archived: false,
      },
      meta: {
        archived: false,
      },
    }, {
      id: '2',
      name: 'Sally Jean',
      email: 'sally@company.com',
      phone: '3031234567',
      job: 'CEO',
      company: {
        id: '1',
        archived: false,
      },
      meta: {
        archived: false,
      },
    }],
    [types.BRAND]: [{
      id: '1',
      name: 'Antenna',
      image: 'http://image.com',
      background: '#444',
      text: '#FFF',
      secondary: '#333',
      obg: true,
      categories: [{
        id: '1',
        archived: false,
      }, {
        id: '2',
        archived: false,
      }],
      forms: [{
        id: '1',
        archived: false,
      }],
      meta: {
        archived: false,
      },
    }],
    [types.CATEGORY]: [{
      id: '1',
      name: 'A16Z',
      heading: 'Venture',
      brand: {
        id: '1',
        archived: false,
      },
      listings: [{
        id: '1',
        archived: false,
      }],
      ads: [{
        id: '1',
        archived: false,
      }],
      meta: {
        archived: false,
      },
    }, {
      id: '2',
      name: 'Acid',
      heading: 'Street',
      brand: {
        id: '1',
        archived: false,
      },
      listings: [{
        id: '1',
        archived: false,
      }],
      ads: [{
        id: '2',
        archived: false,
      }],
      meta: {
        archived: false,
      },
    }],
    [types.FORM]: [{
      id: '1',
      name: 'Subscribe form',
      published: true,
      brand: {
        id: '1',
        archived: false,
      },
      submissions: [],
      fields: [{
        section: 'One',
        label: 'Email',
        placeholder: 'Email',
        type: 'input',
        priority: '2',
      }],
      meta: {
        archived: false,
      },
    }],
    [types.SUBMISSION]: [],
  },
};
