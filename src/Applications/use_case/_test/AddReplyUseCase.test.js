const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const CommentRepository = require("../../../Domains/comment/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const AddReplyUseCase = require("../AddReplyUseCase");
const AddReply = require("../../../Domains/replies/entities/AddReply");


describe('AddReplyUseCase', () => {
  it('should throw error if thread not found', async () => {
    // Arrange
    const idThread = 'thread-123';
    const idComment = 'comment-123';
    const useCasePayload = {
      content: 'ini komen',
    };

    const credential = {
      id: 'user-123',
      username: 'usertest',
    };

    const mockThreadRepository = new ThreadRepository();
    
    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(null));

    // create use case instance
    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action and Assert
    await expect(addReplyUseCase.execute(useCasePayload,credential,idThread,idComment))
      .rejects
      .toThrowError('ADD_REPLY_USE_CASE.THREAD_NOT_FOUND');
  });

  it('should throw error if comment not found', async () => {
    // Arrange
    const idThread = 'thread-123';
    const idComment = 'comment-123';
    const useCasePayload = {
      content: 'ini komen',
    };

    const credential = {
      id: 'user-123',
      username: 'usertest',
    };

    const mockThread = {
      id: 'thread-123',
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
    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(addReplyUseCase.execute(useCasePayload,credential,idThread,idComment))
      .rejects
      .toThrowError('ADD_REPLY_USE_CASE.COMMENT_NOT_FOUND');
  });

  it('should throw error if comment is not valid', async () => {
    // Arrange
    const idThread = 'thread-123';
    const idComment = 'comment-123';
    const useCasePayload = {
      content: 'ini komen',
    };

    const credential = {
      id: 'user-123',
      username: 'usertest',
    };

    const mockThread = {
      id: 'thread-123',
      title: 'test-thread',
      body: 'isi thread',
      username: 'dicoding',
      date: '2025-11-01T00:00:00.000Z',
    };

    const mockComment = {
      id: 'comment-123',
      content: 'test-thread',
      thread: 'thread-123',
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
    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(addReplyUseCase.execute(useCasePayload,credential,idThread,idComment))
      .rejects
      .toThrowError('ADD_REPLY_USE_CASE.COMMENT_NOT_FOUND');
  });

  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const idThread = 'thread-123';
    const idComment = 'comment-123';
    const useCasePayload = {
      content: 'ini komen',
    };

    const credential = {
      id: 'user-123',
      username: 'usertest',
    };

    const mockThread = {
      id: idThread,
      title: 'test-thread',
      body: 'isi thread',
      username: 'dicoding',
      date: '2025-11-01T00:00:00.000Z',
    };

    const mockComment = {
      id: idComment,
      content: 'test-thread',
      thread: 'thread-123',
      owner: 'user-123',
      date: '2025-11-01T00:00:00.000Z',
      is_delete: false,
    };

    const mockAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: credential.id,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    
    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComment));
    mockReplyRepository.addReply = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedReply));

    // create use case instance
    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const addReply = await addReplyUseCase.execute(useCasePayload,credential,idThread,idComment);

    // Assert
    expect(addReply).toStrictEqual(new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: credential.id,
    }));

    expect(mockThreadRepository.getThreadById).toBeCalledWith(idThread);
    expect(mockCommentRepository.getCommentById).toBeCalledWith(idComment);
    expect(mockReplyRepository.addReply).toBeCalledWith(
      new AddReply({
        content: useCasePayload.content,
      }),
      credential.id,
      idComment,
    );
  });
});