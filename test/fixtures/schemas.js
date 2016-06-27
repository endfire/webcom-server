export default {
  user: {
    attributes: {
      name: true,
      email: true,
      password: true,
      role: true,
    },
  },
  individual: {
    attributes: {
      name: true,
      email: true,
    },
    relationships: {
      company: {
        belongsTo: 'company',
      },
      pets: {
        hasMany: 'animal',
      },
      cars: {
        hasMany: 'car',
        embedded: true,
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
  },
  car: {
    attributes: {
      type: true,
      color: true,
    },
  },
  dummy: {
    attributes: {
      email: true,
      password: true,
      name: true,
      role: true,
    },
  },
  company: {
    attributes: {
      name: true,
    },
    relationships: {
      employees: {
        hasMany: 'individual',
      },
    },
  },
  animal: {
    attributes: {
      species: true,
      color: true,
    },
    relationships: {
      owner: {
        belongsTo: 'individual',
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
    },
    relationships: {
      forms: {
        hasMany: 'form',
      },
    },
  },
};
