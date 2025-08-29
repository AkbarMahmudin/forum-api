const CreateReplyUseCase = require('../../../../Applications/use_case/CreateReplyUseCase');
const DeleteReplyUseCase = require('../../../../Applications/use_case/DeleteReplyUseCase');

class RepliesHandler {
  constructor(container) {
    this._container = container;

    this.postReplyHandler = this.postReplyHandler.bind(this);
    this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
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

  async deleteReplyHandler(request, h) {
    const deleteReplyUseCase = this._container.getInstance(DeleteReplyUseCase.name);
    
    const { threadId, commentId, replyId } = request.params;

    await deleteReplyUseCase.execute({
      threadId,
      commentId,
      replyId,
      headerAuthorization: request.headers.authorization,
    });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = RepliesHandler;
