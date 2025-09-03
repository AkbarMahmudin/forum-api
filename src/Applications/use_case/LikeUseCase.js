const LikeDto = require("../../Domains/likes/entities/LikeDto");

class LikeUseCase {
    constructor({ likeRepository, commentRepository }) {
        this._likeRepository = likeRepository;
        this._commentRepository = commentRepository;
    }

    async execute({threadId, userId, commentId}) {
        // Check if the comment exists
        await this._commentRepository.verifyCommentExist(threadId, commentId);

        new LikeDto({ userId, commentId });
        
        // Check if the comment is already liked by the user
        const isLiked = await this._likeRepository.isCommentLiked(userId, commentId);

        if (isLiked) {
            // If liked, unlike the comment
            await this._likeRepository.unlikeComment(userId, commentId);
        } else {
            // If not liked, like the comment
            await this._likeRepository.likeComment(userId, commentId);
        }
    }
}

module.exports = LikeUseCase;
