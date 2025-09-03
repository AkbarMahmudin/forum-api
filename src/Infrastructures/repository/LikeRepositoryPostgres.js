const LikeRepository = require("../../Domains/likes/LikeRepository");

class LikeRepositoryPostgres extends LikeRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async likeComment(userId, commentId) {
        const id = `like-${this._idGenerator()}`;
        const query = {
            text: "INSERT INTO likes (id, user_id, comment_id) VALUES ($1, $2, $3) RETURNING id",
            values: [id, userId, commentId],
        };

        await this._pool.query(query);
    }

    async unlikeComment(userId, commentId) {
        const query = {
            text: "DELETE FROM likes WHERE user_id = $1 AND comment_id = $2",
            values: [userId, commentId],
        };

        await this._pool.query(query);
    }

    async isCommentLiked(userId, commentId) {
        const query = {
            text: "SELECT id FROM likes WHERE user_id = $1 AND comment_id = $2",
            values: [userId, commentId],
        };
        
        const result = await this._pool.query(query);
        return result.rowCount > 0;
    }
}

module.exports = LikeRepositoryPostgres;
