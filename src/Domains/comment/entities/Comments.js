class Comments {
  constructor({ id, username, date, content, is_delete, replies = [] }) {

    if (!id || !username || !date || !content || is_delete === undefined) {
      throw new Error('COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string' || typeof is_delete !== 'boolean') {
      throw new Error('COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    this.id = id;
    this.username = username;
    this.date = date;
    this.content = is_delete ? '**komentar telah dihapus**' : content;
    this.replies = replies;
  }
}

module.exports = Comments;