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
    relationships: {
      company: {
        belongsTo: 'company',
      },
      obg: {
        belongsTo: 'obg',
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
      cloudinary: true,
      url: true,
      start: true,
      end: true,
      priority: true,
    },
    relationships: {
      company: {
        belongsTo: 'company',
      },
      obg: {
        belongsTo: 'obg',
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
      cloudinary: true,
      background: true,
      text: true,
      secondary: true,
    },
    relationships: {
      forms: {
        hasMany: 'form',
      },
    },
  },
  obg: {
    relationships: {
      brand: {
        belongsTo: 'brand',
      },
      headings: {
        hasMany: 'heading',
      },
    },
  },
  heading: {
    attributes: {
      name: true,
    },
    relationships: {
      obg: {
        belongsTo: 'obg',
      },
      categories: {
        hasMany: 'category',
      },
    },
  },
  category: {
    attributes: {
      name: true,
    },
    relationships: {
      obg: {
        belongsTo: 'obg',
      },
      heading: {
        belongsTo: 'heading',
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
    },
    relationships: {
      brand: {
        belongsTo: 'brand',
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
  data: {
    relationships: {
      fields: {
        hasMany: 'field',
        embedded: true,
      },
    },
  },
};
