const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");

describe('/threads/{idthreads}/comments/{idcomments}/replies', () => {
  let server;
  let accessToken;
  let idThread;
  let idComment

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

  describe('when POST /threads/{idthreads}/comments/{idcomments}/replies', () => {
    afterEach(async () => {
      await RepliesTableTestHelper.cleanTable();
    });

    it('should response 201 and persisted comment', async () => {
      // Arrange
      const requestPayload = {
        content: 'isi Balasan',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${idThread}/comments/${idComment}/replies`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'isi Balasan',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/123/comments/${idComment}/replies`,
        payload: requestPayload,
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

    it('should response 404 when comment not found', async () => {
      // Arrange
      const requestPayload = {
        content: 'isi Balasan',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${idThread}/comments/123/replies`,
        payload: requestPayload,
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

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const requestPayload = {
        isi: 'isi Balasan',
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${idThread}/comments/${idComment}/replies`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat reply karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = {
        content: 123,
      };

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${idThread}/comments/${idComment}/replies`,
        payload: requestPayload,
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat reply karena tipe data tidak sesuai');
    });
  });

  describe('when DELETE /threads/{idthread}/comments/{idcomment}/replies/{idreply}', () => {
    let idReply;
    beforeEach(async () => {
      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${idThread}/comments/${idComment}/replies`,
        payload: {
          content: 'isi balasan',
        },
        headers: {
          authorization: `Bearer ${accessToken}`,
        }
      });
      const replyResponseJson = JSON.parse(replyResponse.payload);
      idReply = replyResponseJson.data.addedReply.id;
    });
  
    afterEach(async () => {
      await RepliesTableTestHelper.cleanTable();
    });

    it('should response 200 and reply deleted', async () => {
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${idThread}/comments/${idComment}/replies/${idReply}`,
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
        url: `/threads/123/comments/${idComment}/replies/${idReply}`,
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
        url: `/threads/${idThread}/comments/123/replies/${idReply}`,
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

    it('should response 404 when reply not found', async () => {
      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${idThread}/comments/${idComment}/replies/123`,
        headers: {
          authorization: `Bearer ${accessToken}`,
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('reply tidak ada');
    });

    it('should response 403 when user', async () => {
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
        url: `/threads/${idThread}/comments/${idComment}/replies/${idReply}`,
        headers: {
          authorization: `Bearer ${loginResponseJson.data.accessToken}`,
        }
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('user tidak memiliki akses untuk reply');
    });
  })
});