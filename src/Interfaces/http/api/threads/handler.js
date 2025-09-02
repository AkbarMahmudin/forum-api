const CreateThreadUseCase = require("../../../../Applications/use_case/CreateThreadUseCase");

class ThreadsHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const addThreadUseCase = this._container.getInstance(
      CreateThreadUseCase.name
    );
    const { id: ownerId } = request.auth.credentials;
    const addedThread = await addThreadUseCase.execute({
      ...request.payload,
      ownerId,
    });

    const response = h.response({
      status: "success",
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadByIdHandler(request, h) {
    const { threadId } = request.params;
    const getThreadUseCase = this._container.getInstance("DetailThreadUseCase");
    const detailThread = await getThreadUseCase.execute(threadId);

    const response = h.response({
      status: "success",
      data: {
        thread: detailThread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadsHandler;
