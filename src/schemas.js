export default {
  user: {
    attributes: {
      name: true,
      email: true,
      password: true,
      role: true,
      meta: true,
    },
  },
  company: {
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
      listings: {
        hasMany: 'listing',
        inverse: 'company',
      },
      ads: {
        hasMany: 'ad',
        inverse: 'company',
      },
      people: {
        hasMany: 'person',
        inverse: 'company',
      },
    },
  },
  listing: {
    attributes: {
      meta: true,
    },
    relationships: {
      company: {
        belongsTo: 'company',
        inverse: 'listings',
      },
      categories: {
        hasMany: 'category',
        inverse: 'listings',
      },
    },
  },
  ad: {
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
      company: {
        belongsTo: 'company',
        inverse: 'ads',
      },
      categories: {
        hasMany: 'category',
        inverse: 'ads',
      },
    },
  },
  person: {
    attributes: {
      name: true,
      email: true,
      phone: true,
      job: true,
      meta: true,
    },
    relationships: {
      company: {
        belongsTo: 'company',
        inverse: 'people',
      },
    },
  },
  brand: {
    attributes: {
      name: true,
      image: true,
      background: true,
      text: true,
      secondary: true,
      meta: true,
    },
    relationships: {
      forms: {
        hasMany: 'form',
        inverse: 'brand',
      },
      obg: {
        hasOne: 'obg',
        inverse: 'brand',
      },
    },
  },
  obg: {
    attributes: {
      meta: true,
    },
    relationships: {
      brand: {
        belongsTo: 'brand',
        inverse: 'obg',
      },
      categories: {
        hasMany: 'category',
        inverse: 'obg',
      },
    },
  },
  category: {
    attributes: {
      name: true,
      heading: true,
      meta: true,
    },
    relationships: {
      obg: {
        belongsTo: 'obg',
        inverse: 'categories',
      },
      listings: {
        hasMany: 'listing',
        inverse: 'categories',
      },
      ads: {
        hasMany: 'ad',
        inverse: 'categories',
      },
    },
  },
  form: {
    attributes: {
      name: true,
      published: true,
      meta: true,
    },
    relationships: {
      brand: {
        belongsTo: 'brand',
        inverse: 'forms',
      },
      fields: {
        hasMany: 'field',
        embedded: true,
      },
      submissions: {
        hasMany: 'submission',
        inverse: 'form',
      },
    },
  },
  submission: {
    attributes: {
      meta: true,
    },
    relationships: {
      form: {
        belongsTo: 'form',
        inverse: 'submissions',
      },
      fields: {
        hasMany: 'field',
        embedded: true,
      },
    },
  },
  field: {
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
