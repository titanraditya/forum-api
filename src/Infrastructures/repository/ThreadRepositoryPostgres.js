const ThreadRepository = require("../../Domains/threads/ThreadRepository");
const AddedThread = require('../../Domains/threads/entities/AddedThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(addThreads, owner) {
    const { title, body } = addThreads;
    const id = `thread-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, owner, date],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async getThreadById(idThread) {
    const query = {
      text: `
        SELECT threads.id AS id, title, body, date, username FROM threads
        LEFT JOIN users on users.id = threads.owner
        WHERE threads.id = $1
      `,
      values: [idThread],
    };

    const result = await this._pool.query(query);

    return result.rows[0] || null;
  }
}

module.exports = ThreadRepositoryPostgres;