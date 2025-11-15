class DeleteCommentUseCase {
  constructor({
    threadRepository,
    commentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(idComment, credential, idThread) {
    const { id } = credential;

    const thread = await this._threadRepository.getThreadById(idThread);
    
    if(!thread) {
      throw new Error('DELETE_COMMENT_USE_CASE.THREAD_NOT_FOUND');
    }

    const comment = await this._commentRepository.getCommentById(idComment);

    if(!comment) {
      throw new Error('DELETE_COMMENT_USE_CASE.COMMENT_NOT_FOUND');
    }
    if(comment.owner != id) {
      throw new Error('DELETE_COMMENT_USE_CASE.USER_NOT_AUTHORIZED');
    }

    return this._commentRepository.deleteComment(idComment);
  }
}

module.exports = DeleteCommentUseCase;