export default {
  user: {
    attributes: {
      name: true,
      email: true,
      password: true,
      role: true,
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
      },
      ads: {
        hasMany: 'ad',
      },
      people: {
        hasMany: 'person',
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
      },
      categories: {
        hasMany: 'category',
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
      },
      categories: {
        hasMany: 'category',
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
      },
      obg: {
        hasOne: 'obg',
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
      },
      categories: {
        hasMany: 'category',
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
      },
      listings: {
        hasMany: 'listing',
      },
      ads: {
        hasMany: 'ad',
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
      },
      fields: {
        hasMany: 'field',
        embedded: true,
      },
      data: {
        hasMany: 'data',
      },
    },
  },
  data: {
    attributes: {
      meta: true,
    },
    relationships: {
      form: {
        belongsTo: 'form',
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
