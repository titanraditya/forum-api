const CommentRepository = require("../../../Domains/comment/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const GetThreadUseCase = require("../GetThreadUseCase");
const Comments = require('../../../Domains/comment/entities/Comments');
const Replies = require("../../../Domains/replies/entities/Replies");
const LikeRepository = require("../../../Domains/likes/LikeRepository");
describe('GetThreadUseCase', () => {
  it('should throw error if thread not found', async () => {
    // Arrange
    const idThread = 'thread-123';
    
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(null));

    // create use case instance
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action & Assert
    await expect(getThreadUseCase.execute(idThread))
      .rejects
      .toThrowError('GET_THREAD_USE_CASE.THREAD_NOT_FOUND');
  });

  it('should orchestrating get comment action correctly', async () => {
    // Arrange
    const idThread = 'thread-123';
    const mockThread = {
      id: idThread,
      title: 'test thread',
      body: 'isi thread',
      date: '2025-11-01T00:00:00.000Z',
      username: 'dicoding',
    };

    const mockComments = [
      {
        id: 'comment-123',
        content: 'isi komen',
        date: '2025-11-01T00:00:00.000Z',
        username: 'dicoding',
        is_delete: false,
      },
    ];
    
    const mockReplies = [
      {
        id: 'reply-123',
        content: 'isi komen',
        date: '2025-11-01T00:00:00.000Z',
        username: 'dicoding',
        is_delete: false,
      },
    ];
    
    const mockLikes = [
      {
        id: 'like-123',
      },
      {
        id: 'like-234',
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(mockThread));
    mockCommentRepository.getCommentByThread = jest.fn()
      .mockImplementation(() => Promise.resolve(mockComments));
    mockReplyRepository.getReplyByComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockReplies));
    mockLikeRepository.getLikeIdOnComment = jest.fn()
      .mockImplementation(() => Promise.resolve(mockLikes));
    
    // create use case instance
    const getCommentByThread = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeRepository: mockLikeRepository,
    });
    
    // Action
    const getThread = await getCommentByThread.execute(idThread);

    // Assert
    expect(getThread).toStrictEqual({
      id: idThread,
      title: mockThread.title,
      body: mockThread.body,
      date: mockThread.date,
      username: mockThread.username,
      comments: [
        new Comments({
          id: mockComments[0].id,
          username: mockComments[0].username,
          date: mockComments[0].date,
          content: mockComments[0].content,
          is_delete: mockComments[0].is_delete,
          replies: [
            new Replies({
              id: mockReplies[0].id,
              username: mockReplies[0].username,
              date: mockReplies[0].date,
              content: mockReplies[0].content,
              is_delete: mockReplies[0].is_delete,
            })
          ],
          likeCount: mockLikes.length,
        }),
      ],
    });

    expect(mockThreadRepository.getThreadById).toBeCalledWith(idThread);
    expect(mockCommentRepository.getCommentByThread).toBeCalledWith(idThread);
    expect(mockReplyRepository.getReplyByComment).toBeCalledWith(mockComments[0].id);
  });
});