class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    // this._jwtTokenManager = jwtTokenManager;
  }

  async execute({ threadId, commentId, replyId, ownerId }) {
    // Run verifications in parallel if possible
    await this._commentRepository.verifyCommentExist(threadId, replyId);
    await this._commentRepository.verifyCommentOwner(replyId, ownerId);

    return this._replyRepository.deleteReply({ threadId, commentId, replyId });
  }
}

module.exports = DeleteReplyUseCase;
