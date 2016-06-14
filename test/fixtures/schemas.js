export default {
  user: {
    name: true,
    email: true,
    pets: {
      hasMany: 'animal',
    },
    options: {
      plural: 'users',
    },
  },
};
