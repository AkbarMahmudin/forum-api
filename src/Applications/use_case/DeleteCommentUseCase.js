class DeleteCommentUseCase {
  constructor({ commentRepository, jwtTokenManager }) {
    this._commentRepository = commentRepository;
    this._jwtTokenManager = jwtTokenManager;
  }

  async execute(threadId, commentId, headerAuthorization) {
    const { id: owner } = await this._jwtTokenManager.authorize(headerAuthorization);
    await this._commentRepository.verifyCommentOwner(commentId, owner);
    
    return this._commentRepository.deleteComment(threadId, commentId);
  }
}

module.exports = DeleteCommentUseCase;
