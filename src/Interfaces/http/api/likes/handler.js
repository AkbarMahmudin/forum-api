const LikeUseCase = require("../../../../Applications/use_case/LikeUseCase");

class LikesHandler {
  constructor(container) {
    this._container = container;

    this.postLikeHandler = this.postLikeHandler.bind(this);
  }

  async postLikeHandler(request, h) {
    const likeUseCase = this._container.getInstance(
      LikeUseCase.name
    );

    const { id: userId } = request.auth.credentials;
    const { threadId, commentId } = request.params;

    await likeUseCase.execute({
      threadId,
      commentId,
      userId,
    });

    const response = h.response({
      status: "success",
    });
    response.code(200);
    return response;
  }
}

module.exports = LikesHandler;
