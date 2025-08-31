const CreateCommentDto = require('../../Domains/comments/entities/CreateCommentDto');

class CreateCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.getDetailThread(useCasePayload.threadId);
    const createDto = new CreateCommentDto(useCasePayload);
    
    return this._commentRepository.createComment(createDto);
  }
}

module.exports = CreateCommentUseCase;
