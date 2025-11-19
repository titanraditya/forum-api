class LikeCommentUseCase {
  constructor({
    threadRepository,
    commentRepository,
    likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(credential, threadId, commentId) {
    const { id } = credential;

    const thread = await this._threadRepository.getThreadById(threadId);

    if(thread) {
      throw new Error('LIKE_COMMENT_USE_CASE.THREAD_NOT_FOUND');
    }

    const comment = await this._commentRepository.getCommentById(commentId);
    if(!comment) {
      throw new Error('LIKE_COMMENT_USE_CASE.COMMENT_NOT_FOUND');
    }

    const liked = await this._likeRepository.checkUserLikedComment(id, commentId);
    if(!liked) {
      await this._likeRepository.addLike(id, commentId);
    } else {
      await this._likeRepository.deleteLike(liked.id);
    }
  }
}

module.exports = LikeCommentUseCase;