const CreateCommentDto = require('../../Domains/comments/entities/CreateCommentDto');

class CreateCommentUseCase {
  constructor({ commentRepository, threadRepository, jwtTokenManager }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
    this._jwtTokenManager = jwtTokenManager;
  }

  async execute(threadId, useCasePayload, headerAuthorization) {
    const { id: owner } = await this._jwtTokenManager.authorize(headerAuthorization);
    await this._threadRepository.getDetailThread(threadId);

    const createDto = new CreateCommentDto({
      threadId,
      content: useCasePayload.content,
      owner,
    });
    
    return this._commentRepository.createComment(createDto);
  }
}

module.exports = CreateCommentUseCase;
