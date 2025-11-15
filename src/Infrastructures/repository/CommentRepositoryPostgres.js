const CommentRepository = require("../../Domains/comment/CommentRepository");
const AddedComment = require("../../Domains/comment/entities/AddedComment");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment, owner, thread) {
    const { content } = addComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, thread, owner, date, false],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async getCommentById(idComment) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [idComment],
    };

    const result = await this._pool.query(query);

    return result.rows[0] || null;
  }

  async getCommentByThread(idThread) {
    const query = {
      text:`
        SELECT comments.id as id, username, date, content, is_delete
        FROM comments
        LEFT JOIN users
        ON users.id = comments.owner
        WHERE thread = $1
        ORDER BY date
      `,
      values: [idThread],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async deleteComment(idComment) {
    const query = {
      text: 'UPDATE comments SET is_delete = true where id = $1',
      values: [idComment],
    };

    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;