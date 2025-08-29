const CreateReplyUseCase = require('../../../../Applications/use_case/CreateReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
  }

  async postReplyHandler(request, h) {
    const addReplyUseCase = this._container.getInstance(CreateReplyUseCase.name);
    
    const { threadId, commentId: replyTo } = request.params;

    const addedReply = await addReplyUseCase.execute({
      threadId,
      replyTo,
      content: request.payload.content,
      headerAuthorization: request.headers.authorization,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedReply,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = RepliesHandler;
