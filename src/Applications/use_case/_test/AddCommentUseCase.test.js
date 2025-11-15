const CommentRepository = require("../../../Domains/comment/CommentRepository");
const AddComment = require("../../../Domains/comment/entities/AddComment");
const AddedComment = require("../../../Domains/comment/entities/AddedComment");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddCommentUseCase = require("../AddCommentUseCase");

describe('AddCommentUseCase', () => {
  it('should throw error if thread not found', async () => {
    // Arrange
    const idThread = 'thread-123';
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
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(addCommentUseCase.execute(useCasePayload,credential,idThread))
      .rejects
      .toThrowError('ADD_COMMENT_USE_CASE.THREAD_NOT_FOUND');
  });

  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const idThread = 'thread-123';
    const useCasePayload = {
      content: 'ini komen',
    };

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

    const mockAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: credential.id,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockAddedComment));

    // create use case instance
    const addCommentUseCase = new AddCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addComment = await addCommentUseCase.execute(useCasePayload,credential,idThread);

    // Assert
    expect(addComment).toStrictEqual(new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: credential.id,
    }));

    expect(mockThreadRepository.getThreadById).toBeCalledWith(idThread);

    expect(mockCommentRepository.addComment).toBeCalledWith(
      new AddComment({
        content: useCasePayload.content,
      }),
      credential.id,
      idThread,
    );
  });
});