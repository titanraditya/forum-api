const AddComment = require("../../Domains/comment/entities/AddComment");

class AddCommentUseCase {
  constructor({
    threadRepository,
    commentRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload, credential, threadid) {
    const addComment = new AddComment(useCasePayload);
    const { id } = credential;
    
    const thread = await this._threadRepository.getThreadById(threadid);
    
    if(!thread) {
      throw new Error('ADD_COMMENT_USE_CASE.THREAD_NOT_FOUND');
    }

    return this._commentRepository.addComment(addComment, id, threadid);
  }
}

module.exports = AddCommentUseCase;