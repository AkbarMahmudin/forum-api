const CreateThreadDto = require('../../Domains/threads/entities/CreateThreadDto');

class CreateThreadUseCase {
  constructor({ threadRepository, jwtTokenManager }) {
    this._threadRepository = threadRepository;
    this._jwtTokenManager = jwtTokenManager;
  }

  async execute(useCasePayload, headerAuthorization) {
    const { id: owner } = await this._jwtTokenManager.authorize(headerAuthorization);
    useCasePayload.owner = owner;

    const createDto = new CreateThreadDto(useCasePayload);
    
    return this._threadRepository.createThread(createDto);
  }
}

module.exports = CreateThreadUseCase;
