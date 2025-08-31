const ReplyRepository = require("../../Domains/replies/ReplyRepository");
const CommentEntity = require("../../Domains/comments/entities/CommentEntity");
const NotFoundError = require("../../Commons/exceptions/NotFoundError");

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async createReply(newReply) {
    const { content, threadId, commentId, ownerId } = newReply;
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: "INSERT INTO comments (id, content, thread_id, owner, reply_to, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, content, owner",
      values: [id, content, threadId, ownerId, commentId, createdAt, createdAt],
    };

    const result = await this._pool.query(query);
    const reply = result.rows[0];

    return new CommentEntity({
      id: reply.id,
      content: reply.content,
      ownerId: reply.owner,
    });
  }

  async deleteReply({ threadId, commentId, replyId }) {
    const deletedAt = new Date().toISOString();
    const query = {
      text: `
        UPDATE comments SET deleted_at = $1
        WHERE id = $2
        AND thread_id = $3
        AND deleted_at IS NULL
        RETURNING id`,
      values: [deletedAt, replyId, threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError("Komentar tidak ditemukan");
    }
  }
}

module.exports = ReplyRepositoryPostgres;
