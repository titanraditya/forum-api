const LikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'likes',
  register: async (server, { container }) => {
    const likesHanlder = new LikesHandler(container);
    server.route(routes(likesHanlder));
  },
};