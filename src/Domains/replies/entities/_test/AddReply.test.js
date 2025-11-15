const AddReply = require('../AddReply');

describe('a AddReply entities', () => {
  it('should throw error when payload did not contain needed property', async () => {
    // Arrange
    const payload = {
      body: 'ini balasan',
    };
    
    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError('NOT_CONTAIN_NEEDED_PROPERTY');
  });
  it('should throw error when payload did not meet type data specification', () => {
    // Arrange
    const payload = {
      content: true,
    };
    
    // Action and Assert
    expect(() => new AddReply(payload)).toThrowError('NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should create addReply object correctly', () => {
    // Arrange
    const payload = {
      content: 'Isi Balasan',
    };
    
    // Action
    const { content } = new AddReply(payload);
    
    // Assert
    expect(content).toEqual(payload.content);
  });
});