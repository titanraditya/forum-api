const CommentRepository = require("../../../Domains/comment/CommentRepository");
const LikeRepository = require("../../../Domains/likes/LikeRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const LikeCommentUseCase = require("../LikeCommentUseCase");

describe('LikeCommentUseCase', () => {
  it('should throw error if thread not found', async () => {
    // Arrange
    const idThread = 'thread-123';
    const idComment = 'comment-123';

    const credential = {
      id: 'user-123',
      username: 'usertest',
    };

    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(null));

    // create use case instance
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository
    });

    // Action and Assert
    await expect(likeCommentUseCase.execute(credential, idThread, idComment))
      .rejects
      .toThrowError('LIKE_COMMENT_USE_CASE.THREAD_NOT_FOUND');
  });

  it('should throw error if comment not found', async () => {
    // Arrange
    const idThread = 'thread-123';
    const idComment = 'comment-123';

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
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action & Assert
    await expect(likeCommentUseCase.execute(credential, idThread, idComment))
      .rejects
      .toThrowError('LIKE_COMMENT_USE_CASE.COMMENT_NOT_FOUND');
  });

  it('should orchestrating the like comment action correctly when user not liked the comment', async () => {
    // Arrange
    const idThread = 'thread-123';
    const idComment = 'comment-123';

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

    const mockComment = {
      id: idComment,
      content: 'test-thread',
      thread: 'thread-123',
      owner: 'user-123',
      date: '2025-11-01T00:00:00.000Z',
      is_delete: false,
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComment));
    mockLikeRepository.checkUserLikedComment = jest.fn()
      .mockImplementation(() => Promise.resolve(null));
    mockLikeRepository.addLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // create use case instance
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(credential, idThread, idComment);

    expect(mockThreadRepository.getThreadById).toBeCalledWith(idThread);
    expect(mockCommentRepository.getCommentById).toBeCalledWith(idComment);
    expect(mockLikeRepository.checkUserLikedComment).toBeCalledWith(credential.id, idComment);
    expect(mockLikeRepository.addLike).toBeCalledWith(credential.id, idComment);
  });

  it('should orchestrating the like comment action correctly when user liked the comment', async () => {
    // Arrange
    const idThread = 'thread-123';
    const idComment = 'comment-123';

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

    const mockComment = {
      id: idComment,
      content: 'test-thread',
      thread: 'thread-123',
      owner: 'user-123',
      date: '2025-11-01T00:00:00.000Z',
      is_delete: false,
    };

    const mockLike = {
      id: 'like-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComment));
    mockLikeRepository.checkUserLikedComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockLike));
    mockLikeRepository.deleteLike = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // create use case instance
    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(credential, idThread, idComment);

    expect(mockThreadRepository.getThreadById).toBeCalledWith(idThread);
    expect(mockCommentRepository.getCommentById).toBeCalledWith(idComment);
    expect(mockLikeRepository.checkUserLikedComment).toBeCalledWith(credential.id, idComment);
    expect(mockLikeRepository.deleteLike).toBeCalledWith(mockLike.id);
  });
});