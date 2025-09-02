const CommentRepository = require("../../Domains/comments/CommentRepository");
const CommentEntity = require("../../Domains/comments/entities/CommentEntity");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../Commons/exceptions/AuthorizationError");

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async createComment(newComment) {
    const { content, threadId, ownerId } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: `INSERT INTO comments (id, content, thread_id, owner, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, content, owner AS "ownerId"`,
      values: [id, content, threadId, ownerId, createdAt, createdAt],
    };

    const result = await this._pool.query(query);

    return new CommentEntity({ ...result.rows[0] });
  }

  async deleteComment(threadId, commentId) {
    const deletedAt = new Date().toISOString();
    const query = {
      text: "UPDATE comments SET deleted_at = $3 WHERE thread_id = $1 AND id = $2 AND deleted_at IS NULL RETURNING id",
      values: [threadId, commentId, deletedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Komentar tidak ditemukan");
    }
  }

  async verifyCommentOwner(commentId, ownerId) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1 AND owner = $2 AND deleted_at IS NULL",
      values: [commentId, ownerId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async verifyCommentExist(threadId, commentId) {
    const query = {
      text: "SELECT * FROM comments WHERE thread_id = $1 AND id = $2",
      values: [threadId, commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Komentar tidak ditemukan");
    }
  }

  async getCommentsByThreadId(threadId) {
    const query = {
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
                  ORDER BY replies.created_at ASC
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

    const result = await this._pool.query(query);

    return result?.rows ?? [];
  }
}

module.exports = CommentRepositoryPostgres;
