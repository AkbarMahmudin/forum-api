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
    const { title, body, owner } = newThread;
    const id = `thread-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads (id, title, body, owner, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title, body, owner',
      values: [id, title, body, owner, createdAt, createdAt],
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
             WHERE threads.id = $1`,
      values: [threadId],
    };

    const threadResult = await this._pool.query(threadQuery);

    if (threadResult.rowCount === 0) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    // Get comments for the thread
    const commentQuery = {
      text: `SELECT comments.id, comments.content, comments.created_at AS date, comments.deleted_at AS "deletedAt", users.username,
              COALESCE(
                json_agg(
                  json_build_object(
                    'id', replies.id,
                    'content', replies.content,
                    'date', replies.created_at,
                    'deletedAt', replies.deleted_at,
                    'username', userReply.username
                  )
                ) FILTER (WHERE replies.id IS NOT NULL),
                '[]'
              ) AS replies
             FROM comments
             JOIN users ON comments.owner = users.id
             LEFT JOIN comments replies ON replies.reply_to = comments.id
             LEFT JOIN users userReply ON replies.owner = userReply.id
             WHERE comments.thread_id = $1
             AND comments.reply_to IS NULL
             GROUP BY comments.id, comments.content, comments.created_at, comments.deleted_at, users.username
             ORDER BY comments.created_at ASC`,
      values: [threadId],
    };

    const commentResult = await this._pool.query(commentQuery);

    // Prepare thread detail with comments
    const threadDetail = {
      ...threadResult.rows[0],
      comments: commentResult.rows.length > 0 ? commentResult.rows : [],
    };
    
    return threadDetail;
  }
}

module.exports = ThreadRepositoryPostgres;