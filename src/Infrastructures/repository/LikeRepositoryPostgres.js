const LikeRepository = require("../../Domains/likes/LikeRepository");

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addLike(user, comment) {
    const id = `like-${this._idGenerator()}`;
    
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3)',
      values: [id, comment, user],
    };

    await this._pool.query(query);
  }

  async checkUserLikedComment(user, comment) {
    const query = {
      text: `
        SELECT id
        FROM likes
        WHERE "user" = $1
        AND comment = $2
      `,
      values: [user, comment],
    };

    const result = await this._pool.query(query);

    return result.rows[0] || null;
  }

  async deleteLike(id) {
    const query = {
      text: 'DELETE FROM likes WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }

  async getLikeIdOnComment(comment) {
    const query = {
      text: `
        SELECT id
        FROM likes
        WHERE comment = $1
      `,
      values: [comment],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = LikeRepositoryPostgres;