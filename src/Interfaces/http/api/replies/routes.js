const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{idthread}/comments/{idcomment}/replies',
    handler: handler.postReplyHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{idthread}/comments/{idcomment}/replies/{idreply}',
    handler: handler.deleteReplyHandler,
    options: {
      auth: 'forumapi_jwt',
    },
  },
]);

module.exports = routes;