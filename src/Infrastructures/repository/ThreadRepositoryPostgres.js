const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const ThreadEntity = require('../../Domains/threads/entities/ThreadEntity');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async createThread(newThread) {
    const { title, body, ownerId } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads (id, title, body, owner, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title, body, owner AS "ownerId"',
      values: [id, title, body, ownerId, createdAt, createdAt],
    };

    const result = await this._pool.query(query);

    return new ThreadEntity({ ...result.rows[0] });
  }

  async getDetailThread(threadId) {
    // Get thread detail
    const threadQuery = {
      text: `SELECT threads.id, threads.title, threads.body, threads.created_at AS date, users.username AS username
             FROM threads
             JOIN users ON threads.owner = users.id
             WHERE threads.id = $1
             AND threads.deleted_at IS NULL`,
      values: [threadId],
    };

    const result = await this._pool.query(threadQuery);

    if (result.rowCount === 0) {
      throw new NotFoundError('thread tidak ditemukan');
    }
    
    return result.rows[0];
  }
}

module.exports = ThreadRepositoryPostgres;