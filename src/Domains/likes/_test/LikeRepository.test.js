const LikeRepository = require("../LikeRepository");

describe('LikeRepositorty interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const likeRepositorty = new LikeRepository();

    // Action and Assert
    await expect(likeRepositorty.addLike({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepositorty.getLikeIdOnComment({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepositorty.checkUserLikedComment({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepositorty.deleteLike({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});