class DeleteReplyUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(idReply, credential, idThread, idComment) {
    const { id } = credential;

    const thread = await this._threadRepository.getThreadById(idThread);
    
    if(!thread) {
      throw new Error('DELETE_REPLY_USE_CASE.THREAD_NOT_FOUND');
    }

    const comment = await this._commentRepository.getCommentById(idComment);
    if (!comment || comment.is_delete) {
      throw new Error('DELETE_REPLY_USE_CASE.COMMENT_NOT_FOUND');
    }

    const reply = await this._replyRepository.getReplyById(idReply);
    if (!reply) {
      throw new Error('DELETE_REPLY_USE_CASE.REPLY_NOT_FOUND');
    }
    if (reply.owner != id) {
      throw new Error('DELETE_REPLY_USE_CASE.USER_NOT_AUTHORIZED');
    }

    return this._replyRepository.deleteReply(idReply);
  }
}

module.exports = DeleteReplyUseCase;