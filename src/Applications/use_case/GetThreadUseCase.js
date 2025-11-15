const Comments = require("../../Domains/comment/entities/Comments");
const Replies = require("../../Domains/replies/entities/Replies");

class GetThreadUseCase {
  constructor({
    threadRepository,
    commentRepository,
    replyRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(idThread) {
    const thread = await this._threadRepository.getThreadById(idThread);

    if(!thread) {
      throw new Error('GET_THREAD_USE_CASE.THREAD_NOT_FOUND');
    }

    const commentRepo = await this._commentRepository.getCommentByThread(idThread);
    
    const comments = await Promise.all(
      commentRepo.map(async (comment) => {
        const repliesRepo = await this._replyRepository.getReplyByComment(comment.id);
        const replies = await Promise.all(
          repliesRepo.map(async (reply) => {
            return new Replies({ ...reply });
          })
        );
        return new Comments({ ...comment, replies });
      })
    );

    const data = {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.date,
      username: thread.username,
      comments,
    }

    return data; 
  }
}

module.exports = GetThreadUseCase;