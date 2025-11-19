const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper");
const pool = require("../../database/postgres/pool");
const LikeRepositoryPostgres = require("../LikeRepositoryPostgres");

describe('LikesRepositoryPostgres', () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addLike function', () => {
    it('should persist add like', async () => {
      // Arrange
      const fakeIdGenerator = () => '123';// stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
      const user = 'user-123';
      const comment = 'comment-123';

      // Action
      await likeRepositoryPostgres.addLike(user,comment);

      // Assert
      const like = await LikesTableTestHelper.findLikeById('like-123');
      expect(like).toHaveLength(1);
    });
  });

  describe('checkUserLikedComment function', () => {
    it('should throw null when like not found', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      const user = 'user-123';
      const comment = 'comment-123';

      // Action & Assert
      const data = await likeRepositoryPostgres.checkUserLikedComment(user,comment);
      expect(data).toEqual(null);
    });

    it('should return correct data when like is found', async () => {
      // Arrange
      await LikesTableTestHelper.addLike({id: 'like-123', comment: 'comment-123', user: 'user-123'});
      const user = 'user-123';
      const comment = 'comment-123';
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});

      // Action
      const data = await likeRepositoryPostgres.checkUserLikedComment(user,comment);

      // Assert
      expect(data.id).toEqual('like-123');
    });
  });

  describe('deleteLike', () => {
    it('should delete like from database', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      const id = 'like-123';
      await LikesTableTestHelper.addLike({id: id});

      // Action
      await likeRepositoryPostgres.deleteLike(id);

      // Assert
      const likes = await LikesTableTestHelper.findLikeById(id);
      expect(likes).toHaveLength(0);
    });
  });

  describe('getLikeIdOnComment', () => {
    it('should get like on comment', async () => {
      // Arrange
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, {});
      const idcomment = 'comment-123';
      await LikesTableTestHelper.addLike({id: 'like-123', idcomment});
      await LikesTableTestHelper.addLike({id: 'like-234', idcomment});

      // Action
      const likes = await likeRepositoryPostgres.getLikeIdOnComment(idcomment);

      // Assert
      expect(likes).toHaveLength(2);
      expect(likes[0].id).toEqual('like-123');
      expect(likes[1].id).toEqual('like-234');
    });
  });
});