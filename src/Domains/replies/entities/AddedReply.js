class AddedReply {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, content, owner } = payload;
    this.id = id;
    this.content = content;
    this.owner = owner;
  }
  
  _verifyPayload(payload) {
    const { id, content, owner } = payload;
    if (!id || !content || !owner) {
      throw new Error('ADDED_REPLY.NOT_CONTAIN_DATA_PROPERTY_NEEDED');
    }
    if (typeof id !== 'string' || typeof content !== 'string' || typeof content !== 'string') {
      throw new Error('ADDED_REPLY.NOT_CONTAIN_TYPE_DATA_NEEDED');
    }
  }
}

module.exports = AddedReply;

