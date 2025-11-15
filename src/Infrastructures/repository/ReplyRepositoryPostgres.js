const ReplyRepository = require("../../Domains/replies/ReplyRepository");
const AddedReply = require("../../Domains/replies/entities/AddedReply");

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(addReply, owner, comment) {
    const { content } = addReply;
    const id = `reply-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
      values: [id, content, comment, owner, date, false],
    };

    const result = await this._pool.query(query);

    return new AddedReply({ ...result.rows[0] });
  }

  async getReplyById(idReply) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [idReply],
    };

    const result = await this._pool.query(query);

    return result.rows[0] || null;
  }

  async deleteReply(idReply) {
    const query = {
      text: 'UPDATE replies SET is_delete = true where id = $1',
      values: [idReply],
    };

    await this._pool.query(query);
  }

  async getReplyByComment(idComment) {
    const query = {
      text:`
        SELECT replies.id as id, username, date, content, is_delete
        FROM replies
        LEFT JOIN users
        ON users.id = replies.owner
        WHERE comment = $1
        ORDER BY date
      `,
      values: [idComment],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = ReplyRepositoryPostgres;