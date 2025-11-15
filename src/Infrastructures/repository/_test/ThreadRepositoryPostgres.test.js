const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AddThread = require('../../../Domains/threads/entities/AddThread');
const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadsRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });
  
  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return added thread correctly', async () => {
      // Arrange
      const addThread = new AddThread({
        title: 'Test Threads',
        body: 'Isi Test',
      });
      const fakeIdGenerator = () => '123';// stub!
      const threadsRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const ownerid = 'owner-123';
      // Action
      await threadsRepositoryPostgres.addThread(addThread,ownerid);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });
  });

  describe('getThreadById function', () => {
    it('should throw null when thread not found', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      const data = await threadRepositoryPostgres.getThreadById('thread-123');
      
      expect(data).toEqual(null);
    });

    it('should return correct data when thread is found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding'});
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', title: 'test thread', body:'isi thread', owner: 'user-123', date: '2025-11-01T00:00:00.000Z'});
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const data = await threadRepositoryPostgres.getThreadById('thread-123');

      // Assert
      expect(data.id).toEqual('thread-123');
      expect(data.title).toEqual('test thread');
      expect(data.body).toEqual('isi thread');
      expect(data.username).toEqual('dicoding');
      expect(data.date).toEqual('2025-11-01T00:00:00.000Z');

      await UsersTableTestHelper.cleanTable();
    });
  });
});