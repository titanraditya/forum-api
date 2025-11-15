const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AddComment = require("../../../Domains/comment/entities/AddComment");
const AddedComment = require("../../../Domains/comment/entities/AddedComment");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");

describe('CommentsRepositoryPostgres', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        content: 'ini komen',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
      const onwerid = 'user-123';
      const threadid = 'thread-123';

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment,onwerid,threadid);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: addComment.content,
        owner: onwerid,
      }));

      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
    });
  });

  describe('getCommentById function', () => {
    it('should throw null when comment not found', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres (pool, {});

      // Action & Assert
      const data = await commentRepositoryPostgres.getCommentById('comment-123');

      expect(data).toEqual(null);
    });

    it('should return correct data when comment is found', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({ id: 'comment-123', content: "ini komen", thread: "thread-123", owner: "user-123", date: "2025-11-01T00:00:00.000Z", is_delete: false, });
      const commentRepositoryPostgres = new CommentRepositoryPostgres (pool, {});
      
      // Action & Assert
      const data = await commentRepositoryPostgres.getCommentById('comment-123');

      expect(data.id).toEqual('comment-123');
      expect(data.content).toEqual('ini komen');
      expect(data.thread).toEqual('thread-123');
      expect(data.owner).toEqual('user-123');
      expect(data.date).toEqual('2025-11-01T00:00:00.000Z');
      expect(data.is_delete).toEqual(false);
    });
  });

  describe('deleleComment function', () => {
    it('should persist delete comment', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const idComment = 'comment-123';

      await CommentsTableTestHelper.addComment({id:'comment-123'});
      
      // Action
      await commentRepositoryPostgres.deleteComment(idComment);
      
      // Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment[0].id).toBe(idComment);
      expect(comment[0].is_delete).toBe(true);
    });
  });

  describe('getCommentByThread function', () => {
    it('should persist get comment by thread with date sort ascending', async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const idThread = 'thread-123';

      await UsersTableTestHelper.addUser({id: 'user-123', username: 'dicoding'});

      await CommentsTableTestHelper.addComment({id:'comment-123', thread: idThread, owner: 'user-123', content:'komen1', date: '2025-11-01T00:00:00.000Z'});
      await CommentsTableTestHelper.addComment({id:'comment-234', thread: idThread, owner: 'user-123', content:'komen2', date: '2025-11-01T04:00:00.000Z'});
      await CommentsTableTestHelper.addComment({id:'comment-345', thread: 'thread-456', owner: 'user-123', content:'komen3', date: '2025-11-01T00:00:00.000Z'});

      // Action & Assert
      const comment = await commentRepositoryPostgres.getCommentByThread(idThread);
      expect(comment).toHaveLength(2);
      expect(comment[0].id).toBe('comment-123');
      expect(comment[0].username).toBe('dicoding');
      expect(comment[0].date).toBe('2025-11-01T00:00:00.000Z');
      expect(comment[0].content).toBe('komen1');
      expect(comment[0].is_delete).toBe(false);
      expect(comment[1].id).toBe('comment-234');
      expect(comment[1].username).toBe('dicoding');
      expect(comment[1].date).toBe('2025-11-01T04:00:00.000Z');
      expect(comment[1].content).toBe('komen2');
      expect(comment[1].is_delete).toBe(false);

      await UsersTableTestHelper.cleanTable();
    });
  });
});