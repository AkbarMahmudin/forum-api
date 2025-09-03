class LikeRepository {
    async likeComment(userId, commentId) {
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async unlikeComment(userId, commentId) {
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async isCommentLiked(userId, commentId) {
        throw new Error('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = LikeRepository;