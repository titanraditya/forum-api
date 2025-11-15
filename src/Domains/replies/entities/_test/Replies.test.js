const Replies = require("../Replies");

describe('a Replies entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'Balasan ini',
    };

    // Action and Assert
    expect(() => new Replies(payload)).toThrowError('REPLIES.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'Balasan ini',
      username: true,
      date: '2025-11-01T00:00:00.000Z',
      is_delete: 'ada',
    }

    // Action and Assert
    expect(() => new Replies(payload)).toThrowError('REPLIES.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create replies object correctly with valid reply', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'balasan ini',
      username: 'dicoding',
      date: '2025-11-01T00:00:00.000Z',
      is_delete: false,
    }

    // Action
    const { id, content, username, date } = new Replies(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
  });

  it('should create replies object correctly with not valid reply', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      content: 'balasan ini',
      username: 'dicoding',
      date: '2025-11-01T00:00:00.000Z',
      is_delete: true,
    }

    // Action
    const { id, content, username, date } = new Replies(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual('**balasan telah dihapus**');
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
  });
});