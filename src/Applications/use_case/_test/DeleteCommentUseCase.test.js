const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");

describe("DeleteCommentUseCase", () => {
  it("should orchestrating the add comment action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      ownerId: "user-123",
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.verifyCommentExist = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(useCasePayload.threadId, useCasePayload.commentId)
      );
    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(useCasePayload.commentId, useCasePayload.ownerId)
      );
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(useCasePayload.threadId, useCasePayload.commentId)
      );

    /** creating use case instance */
    const getCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    await getCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
      useCasePayload.commentId,
      useCasePayload.ownerId
    );
    expect(mockCommentRepository.deleteComment).toBeCalledWith(
      useCasePayload.threadId,
      useCasePayload.commentId
    );
  });
});
