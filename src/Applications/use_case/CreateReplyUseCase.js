const CreateReplyDto = require("../../Domains/replies/entities/CreateReplyDto");

class CreateReplyUseCase {
  constructor({ replyRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    // this._jwtTokenManager = jwtTokenManager;
  }

  async execute({ threadId, commentId, ownerId, content }) {
    await this._commentRepository.verifyCommentExist(threadId, commentId);
    const createDto = new CreateReplyDto({
      threadId,
      commentId,
      content,
    });

    return this._replyRepository.createReply({ ...createDto, ownerId });
  }
}

module.exports = CreateReplyUseCase;
