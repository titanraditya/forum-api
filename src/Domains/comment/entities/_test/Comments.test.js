const Comments = require("../Comments");

describe('a Comments entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'komen ini',
    };

    // Action and Assert
    expect(() => new Comments(payload)).toThrowError('COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'komen ini',
      username: true,
      date: '2025-11-01T00:00:00.000Z',
      is_delete: 'ada',
    }

    // Action and Assert
    expect(() => new Comments(payload)).toThrowError('COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comments object correctly with valid comment', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'komen ini',
      username: 'dicoding',
      date: '2025-11-01T00:00:00.000Z',
      is_delete: false,
      replies: [],
      likeCount: 0,
    }

    // Action
    const { id, content, username, date, replies, likeCount } = new Comments(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(replies).toEqual([]);
    expect(likeCount).toEqual(0);
  });

  it('should create comments object correctly with not valid comment', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'komen ini',
      username: 'dicoding',
      date: '2025-11-01T00:00:00.000Z',
      replies: [],
      is_delete: true,
      likeCount: 0,
    }

    // Action
    const { id, content, username, date, replies, likeCount } = new Comments(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual('**komentar telah dihapus**');
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(replies).toEqual([]);
    expect(likeCount).toEqual(0);
  });
});