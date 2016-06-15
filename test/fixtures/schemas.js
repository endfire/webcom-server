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
  car: {
    attributes: {
      type: true,
      color: true,
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
