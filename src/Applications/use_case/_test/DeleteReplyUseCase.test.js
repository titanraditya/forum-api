const CommentRepository = require("../../../Domains/comment/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const DeleteReplyUseCase = require("../DeleteReplyUseCase"); 
describe('DeleteReplyUseCase', () => {
  it('should throw error if tread not found', async () => {
    // Arrange
    const idThread = 'thread-123';
    const idComment = 'comment-123';
    const idReply = 'reply-123';
    const credential = {
      id: 'user-123',
      username: 'usertest',
    };

    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(null));

    // create use case instance
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action and Assert
    await expect(deleteReplyUseCase.execute(idReply, credential, idThread, idComment))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.THREAD_NOT_FOUND');
  })

  it('should trhow error if comment not found', async () => {
    // Arrange
    const idThread = 'thread-123';
    const idComment = 'comment-123';
    const idReply = 'reply-123';
    const credential = {
      id: 'user-123',
      username: 'usertest',
    };
    const mockThread = {
      id: idThread,
      title: 'test thread',
      body: 'isi thread',
      username: 'dicoding',
      date: '2025-11-01T00:00:00.000Z',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(null));

    // create use case instance
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await expect(deleteReplyUseCase.execute(idReply, credential, idThread, idComment))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.COMMENT_NOT_FOUND');
  });

  it('should throw error if comment not valid', async () => {
    // Arrange
    const idThread = 'thread-123';
    const idComment = 'comment-123';
    const idReply = 'reply-123';
    const credential = {
      id: 'user-123',
      username: 'usertest',
    };
    const mockThread = {
      id: idThread,
      title: 'test thread',
      body: 'isi thread',
      username: 'dicoding',
      date: '2025-11-01T00:00:00.000Z',
    };
    const mockComment = {
      id: 'comment-123',
      content: 'test-thread',
      thread: idThread,
      owner: 'user-123',
      date: '2025-11-01T00:00:00.000Z',
      is_delete: true,
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComment));

    // create use case instance
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await expect(deleteReplyUseCase.execute(idReply, credential, idThread, idComment))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.COMMENT_NOT_FOUND');
  });

  it('should throw error if reply not found', async () => {
    // Arrange
    const idThread = 'thread-123';
    const idComment = 'comment-123';
    const idReply = 'reply-123';
    const credential = {
      id: 'user-123',
      username: 'usertest',
    };
    const mockThread = {
      id: idThread,
      title: 'test thread',
      body: 'isi thread',
      username: 'dicoding',
      date: '2025-11-01T00:00:00.000Z',
    };
    const mockComment = {
      id: idComment,
      content: 'test-thread',
      thread: idThread,
      owner: 'user-123',
      date: '2025-11-01T00:00:00.000Z',
      is_delete: false,
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComment));
    mockReplyRepository.getReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve(null))

    // create use case instance
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    await expect(deleteReplyUseCase.execute(idReply, credential, idThread, idComment))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.REPLY_NOT_FOUND');
  });

  it('should throw error if user not authorized', async () => {
    // Arrange
    const idThread = 'thread-123';
    const idComment = 'comment-123';
    const idReply = 'reply-123';
    const credential = {
      id: 'user-123',
      username: 'usertest',
    };
    const mockThread = {
      id: idThread,
      title: 'test thread',
      body: 'isi thread',
      username: 'dicoding',
      date: '2025-11-01T00:00:00.000Z',
    };
    const mockComment = {
      id: idComment,
      content: 'isi komen',
      thread: idThread,
      owner: 'user-123',
      date: '2025-11-01T00:00:00.000Z',
      is_delete: false,
    };

    const mockReply = {
      id: 'reply-123',
      content: 'isi balasan',
      comment: idComment,
      owner: 'user-234',
      date: '2025-11-01T00:00:00.000Z',
      is_delete: false,
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComment));
    mockReplyRepository.getReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReply));

    // create use case instance
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    await expect(deleteReplyUseCase.execute(idReply, credential, idThread, idComment))
      .rejects
      .toThrowError('DELETE_REPLY_USE_CASE.USER_NOT_AUTHORIZED');
  });

  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const idThread = 'thread-123';
    const idComment = 'comment-123';
    const idReply = 'reply-123';
    const credential = {
      id: 'user-123',
      username: 'usertest',
    };
    const mockThread = {
      id: idThread,
      title: 'test thread',
      body: 'isi thread',
      username: 'dicoding',
      date: '2025-11-01T00:00:00.000Z',
    };
    const mockComment = {
      id: idComment,
      content: 'isi komen',
      thread: idThread,
      owner: 'user-123',
      date: '2025-11-01T00:00:00.000Z',
      is_delete: false,
    };

    const mockReply = {
      id: 'reply-123',
      content: 'isi balasan',
      comment: idComment,
      owner: 'user-123',
      date: '2025-11-01T00:00:00.000Z',
      is_delete: false,
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComment));
    mockReplyRepository.getReplyById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReply));
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // create use case instance
    const deleteReplyUseCase = new DeleteReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(idReply, credential, idThread, idComment);

    // Assert
    expect(mockThreadRepository.getThreadById)
      .toHaveBeenCalledWith(idThread);
    expect(mockCommentRepository.getCommentById)
      .toHaveBeenCalledWith(idComment);
    expect(mockReplyRepository.getReplyById)
      .toHaveBeenCalledWith(idReply);
    expect(mockReplyRepository.deleteReply)
      .toHaveBeenCalledWith(idReply);
  });
});