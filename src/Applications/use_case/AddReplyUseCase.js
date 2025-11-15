const AddReply = require("../../Domains/replies/entities/AddReply");

class AddReplyUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload, credential, idThread, idComment) {
    const addReply = new AddReply(useCasePayload);
    const { id } = credential;

    const thread = await this._threadRepository.getThreadById(idThread);
    
    if(!thread) {
      throw new Error('ADD_REPLY_USE_CASE.THREAD_NOT_FOUND');
    }

    const comment = await this._commentRepository.getCommentById(idComment);
    if (!comment || comment.is_delete) {
      throw new Error('ADD_REPLY_USE_CASE.COMMENT_NOT_FOUND');
    }

    return this._replyRepository.addReply(addReply, id, idComment);
  }
}

module.exports = AddReplyUseCase;