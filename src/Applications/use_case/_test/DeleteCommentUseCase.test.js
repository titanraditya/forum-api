const CommentRepository = require("../../../Domains/comment/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");

describe('DeleteCommentUseCase', () => {
  it('should throw error if thread not found', async () => {
    // Arrange
    const idThread = 'thread-123';
    const credential = {
      id: 'user-123',
      username: 'usertest',
    };

    const idComment = 'comment-123';

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(null));

    // create use case instance
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action and Assert
    await expect(deleteCommentUseCase.execute(idComment, credential, idThread))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.THREAD_NOT_FOUND');
  });

  it('should throw error if comment not found', async () => {
    // Arrange
    const idThread = 'thread-123';
    const credential = {
      id: 'user-123',
      username: 'usertest',
    };
    const idComment = 'comment-123';
    const mockThread = {
      id: idThread,
      title: 'test thread',
      body: 'isi thread',
      owner: 'user-123',
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
    const deleleCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await expect(deleleCommentUseCase.execute(idComment, credential, idThread))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.COMMENT_NOT_FOUND');
  });

  it('should throw error if user not authorized', async () => {
    // Arrange
    const idThread = 'thread-123';
    const credential = {
      id: 'user-123',
      username: 'usertest',
    };
    const idComment = 'comment-123';
    const mockThread = {
      id: idThread,
      title: 'test thread',
      body: 'isi thread',
      owner: 'user-123',
      date: '2025-11-01T00:00:00.000Z',
    };
    const mockComment = {
      id: idComment,
      content: 'ini komen',
      owner: 'user-456',
      thread: idThread,
      date: '2025-11-01T00:00:00.000Z',
      is_delete: false,
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComment));

    // create use case instance
    const deleleCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    await expect(deleleCommentUseCase.execute(idComment, credential, idThread))
      .rejects
      .toThrowError('DELETE_COMMENT_USE_CASE.USER_NOT_AUTHORIZED');
  });

  it('should orchestrating the delete comment action correctly', async () => {
    // Arrange
    const idThread = 'thread-123';
    const credential = {
      id: 'user-123',
      username: 'usertest',
    };
    const idComment = 'comment-123';
    const mockThread = {
      id: idThread,
      title: 'test thread',
      body: 'isi thread',
      owner: 'user-123',
      date: '2025-11-01T00:00:00.000Z',
    };
    const mockComment = {
      id: idComment,
      content: 'ini komen',
      owner: 'user-123',
      thread: idThread,
      date: '2025-11-01T00:00:00.000Z',
      is_delete: false,
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComment));
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // create use case instance
    const deleleCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });
    
    // Action
    await deleleCommentUseCase.execute(idComment, credential, idThread);

    // Assert
    expect(mockThreadRepository.getThreadById)
      .toHaveBeenCalledWith(idThread);
    expect(mockCommentRepository.getCommentById)
      .toHaveBeenCalledWith(idComment);
    expect(mockCommentRepository.deleteComment)
      .toHaveBeenCalledWith(idComment);
  });
});