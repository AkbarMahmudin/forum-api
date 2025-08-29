class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, jwtTokenManager }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._jwtTokenManager = jwtTokenManager;
  }

  async execute({ threadId, commentId, replyId, headerAuthorization }) {
    const token = headerAuthorization?.replace("Bearer ", "");
    if (!token) {
      throw new Error("DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    const { id: owner } = await this._jwtTokenManager.decodePayload(token);

    // Run verifications in parallel if possible
    await Promise.all([
      this._commentRepository.verifyCommentExist(threadId, replyId),
      this._jwtTokenManager.authorize(headerAuthorization)
    ]);

    await this._commentRepository.verifyCommentOwner(replyId, owner);

    return this._replyRepository.deleteReply({ threadId, commentId, replyId });
  }
}

module.exports = DeleteReplyUseCase;
