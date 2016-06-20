export default {
  user: {
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
    },
  },
  company: {
    attributes: {
      name: true,
    },
    relationships: {
      employees: {
        hasMany: 'user',
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
        belongsTo: 'user',
      },
    },
  },
};
