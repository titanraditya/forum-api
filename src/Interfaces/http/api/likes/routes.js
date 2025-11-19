const routes = (handler) => ([
  {
    method: 'PUT',
    path: '/threads/{idthread}/comments/{idcomment}/likes',
    handler: (request, h) => handler.putLikeHanlder(request, h),
    options: {
      auth: 'forumapi_jwt',
    },
  },
]);

module.exports = routes;