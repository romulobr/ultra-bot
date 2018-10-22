const { authenticate } = require('@feathersjs/authentication').hooks;
const userReader = require('./user-reader');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [      
      context => {
        if (context.arguments[0].user) {
          context.params.query = {
            _id: context.arguments[0].user._id,
            $limit: 1
          };
        }
      }
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [
      context => {
        context.result = userReader.getSimplifiedUserIn(context.result.data[0]);
      }
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
