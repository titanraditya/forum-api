const pool = require("../../database/postgres/pool");
const createServer = require('../createServer');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require("../../container");

describe('/threads/{idthread}/comments endpoint', () => {
  let server;
  let accessToken;
  let idThread;
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
  });

  beforeEach(async () => {
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
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await pool.end();
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  describe('when POST /threads/{id}/comments', () => {
    afterEach(async () => {
      await CommentsTableTestHelper.cleanTable();
    });

    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'isi komen',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${idThread}/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedComment).toBeDefined();
    });
    it('should response 404 when thread not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'isi komen',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/123/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ada');
    });
    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        isi: 'isi komen',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${idThread}/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment karena properti yang dibutuhkan tidak ada');
    });
    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: true,
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${idThread}/comments`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat comment karena tipe data tidak sesuai');
    });
  });

  describe('when DELETE /threads/{idthread}/comments/{idcomment}', () => {
    let idComment;
    beforeEach( async () => {
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${idThread}/comments`,
        payload: {
          content: 'isi komen',
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        }
      });
      const commentResponseJson = JSON.parse(commentResponse.payload);
      idComment = commentResponseJson.data.addedComment.id;
    });
    afterEach(async () => {
      await CommentsTableTestHelper.cleanTable();
    });

    it('should response 200 and comment deleted', async () => {
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${idThread}/comments/${idComment}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 404 when thread not found', async () => {
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/123/comments/${idComment}`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ada');
    });

    it('should response 404 when comment not found', async () => {
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${idThread}/comments/123`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('comment tidak ada');
    });

    it('should response 404 when comment not found', async () => {
      // add User 
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding2',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login User
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'dicoding2',
          password: 'secret',
        },
      });

      const loginResponseJson = JSON.parse(loginResponse.payload);
      
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${idThread}/comments/${idComment}`,
        headers: {
          authorization: `Bearer ${loginResponseJson.data.accessToken}`,
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('user tidak memiliki akses untuk comment');
    });
  });
});