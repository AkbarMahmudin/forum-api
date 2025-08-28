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
    const { content, threadId, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: "INSERT INTO comments (id, content, thread_id, owner, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, content, owner",
      values: [id, content, threadId, owner, createdAt, createdAt],
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

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: "SELECT * FROM comments WHERE id = $1",
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Komentar tidak ditemukan");
    }

    const comment = result.rows[0];
    if (comment.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }
}

module.exports = CommentRepositoryPostgres;
