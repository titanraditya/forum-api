const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");

describe('/threads/{idthreads}/comments/{idcomments}/likes', () => {
  let server;
  let accessToken;
  let idThread;
  let idComment;

  beforeAll(async () => {
    server = await createServer(container);

    // add User 
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'dicoding',
        password: 'secret',
        fullname: 'Dicoding Indonesia',
      },
    });

    // login User
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'dicoding',
        password: 'secret',
      },
    });

    const loginResponseJson = JSON.parse(loginResponse.payload);
    accessToken = loginResponseJson.data.accessToken;

    // add thread
    const threadResponse = await server.inject({
      method: 'POST',
      url: '/threads',
      payload: {
        title: 'test thread',
        body: 'isi thread',
      },
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    const threadResponseJson = JSON.parse(threadResponse.payload);
    idThread = threadResponseJson.data.addedThread.id;

    // add comment
    const commentResponse = await server.inject({
      method: 'POST',
      url: `/threads/${idThread}/comments`,
      payload: {
        content: 'ini komen',
      },
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });

    const commentResponseJson = JSON.parse(commentResponse.payload);
    idComment = commentResponseJson.data.addedComment.id;
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await pool.end();
  });  

  describe('when PUT /threads/{idthreads}/comments/{idcomments}/likes', () => {
    afterEach(async () => {
      await LikesTableTestHelper.cleanTable();
    });

    it('should response 404 when thread not found', async () => {
      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/123/comments/${idComment}/likes`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ada');
    });

    it('should reponse 404 when comment not found', async () => {
      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${idThread}/comments/123/likes`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak ada');
    });

    it('should response 200', async () => {
      // Action
      const response = await server.inject({
        method: 'PUT',
        url: `/threads/${idThread}/comments/${idComment}/likes`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    })
  });
});