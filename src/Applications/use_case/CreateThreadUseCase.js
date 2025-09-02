const CreateThreadDto = require('../../Domains/threads/entities/CreateThreadDto');

class CreateThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const createDto = new CreateThreadDto(useCasePayload);
    return this._threadRepository.createThread(createDto);
  }
}

module.exports = CreateThreadUseCase;
