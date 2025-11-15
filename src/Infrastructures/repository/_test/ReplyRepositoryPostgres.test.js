const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const AddReply = require("../../../Domains/replies/entities/AddReply");
const pool = require("../../database/postgres/pool");
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");

describe('ReplyRepositoryPostgres', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
  });

  describe('addReply function', () => {
    it('should persist add reply and return added comment correctly', async () => {
      // Arrange
      const addReply = new AddReply({
        content: 'ini balasan'
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
      const ownerid = 'user-123';
      const commentid = 'comment-123';

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(addReply,ownerid,commentid);

      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: addReply.content,
        owner: ownerid,
      }));

      const reply = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(reply).toHaveLength(1);
    });
  });

  describe('getReplyById function', () => {
    it('should return null when reply not found', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action and Assert
      const data = await replyRepositoryPostgres.getReplyById('reply-123');

      expect(data).toEqual(null);
    });
    it('should return correct data when reply is found', async () => {
      // Arrange
      await RepliesTableTestHelper.addReply({ id: 'reply-123', content: "ini balasan", comment: 'comment-123', owner: 'user-123', date: '2025-11-01T00:00:00.000Z', is_delete: false });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action and Assert
      const data = await replyRepositoryPostgres.getReplyById('reply-123');

      expect(data.id).toEqual('reply-123');
      expect(data.content).toEqual('ini balasan');
      expect(data.comment).toEqual('comment-123');
      expect(data.owner).toEqual('user-123');
      expect(data.date).toEqual('2025-11-01T00:00:00.000Z');
      expect(data.is_delete).toEqual(false);
    });
  });

  describe('deleteReply function', () => {
    it('should persist delete reply', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const idReply = 'reply-123';

      await RepliesTableTestHelper.addReply({ id: idReply});

      // Action
      await replyRepositoryPostgres.deleteReply(idReply);

      // Assert
      const reply = await RepliesTableTestHelper.findRepliesById(idReply);
      expect(reply[0].id).toBe(idReply);
      expect(reply[0].is_delete).toBe(true);
    });
  });

  describe('getReplyByComment function', () => {
    it('should persist get reply by comment with date sort ascending', async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const idComment = 'comment-123';

      await UsersTableTestHelper.addUser({id: 'user-123', username: 'dicoding'});
      
      await RepliesTableTestHelper.addReply({id: 'reply-123', content: 'balasan1', owner: 'user-123', comment: idComment, date: '2025-11-01T00:00:00.000Z', is_delete: false});
      await RepliesTableTestHelper.addReply({id: 'reply-234', content: 'balasan2', owner: 'user-123', comment: idComment, date: '2025-11-01T04:00:00.000Z', is_delete: false});
      await RepliesTableTestHelper.addReply({id: 'reply-345', comment: 'comment-456'});

      // Action and Assert
      const reply = await replyRepositoryPostgres.getReplyByComment(idComment);
      expect(reply).toHaveLength(2);
      expect(reply[0].id).toBe('reply-123');
      expect(reply[0].content).toBe('balasan1');
      expect(reply[0].username).toBe('dicoding');
      expect(reply[0].date).toBe('2025-11-01T00:00:00.000Z');
      expect(reply[0].is_delete).toBe(false);
      expect(reply[1].id).toBe('reply-234');
      expect(reply[1].content).toBe('balasan2');
      expect(reply[1].username).toBe('dicoding');
      expect(reply[1].date).toBe('2025-11-01T04:00:00.000Z');
      expect(reply[1].is_delete).toBe(false);

      await UsersTableTestHelper.cleanTable();
    });
  });
});