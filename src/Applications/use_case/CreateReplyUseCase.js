const CreateReplyDto = require('../../Domains/replies/entities/CreateReplyDto');

class CreateReplyUseCase {
  constructor({ replyRepository, commentRepository, jwtTokenManager }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._jwtTokenManager = jwtTokenManager;
  }

  async execute({threadId, replyTo, content, headerAuthorization}) {
    await this._commentRepository.verifyCommentExist(threadId, replyTo);
    const createDto = new CreateReplyDto({
      threadId,
      replyTo,
      content,
    });
    
    const { id: owner } = await this._jwtTokenManager.authorize(headerAuthorization);
    createDto.owner = owner;
    
    return this._replyRepository.createReply(createDto);
  }
}

module.exports = CreateReplyUseCase;
