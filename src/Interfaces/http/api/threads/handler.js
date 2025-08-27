const CreateThreadUseCase = require('../../../../Applications/use_case/CreateThreadUseCase');

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(CreateThreadUseCase.name);
    const addedThread = await addThreadUseCase.execute(request.payload, request.headers.authorization);

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = ThreadsHandler;
