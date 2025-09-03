const CommentRepository = require("../../../Domains/comments/CommentRepository");
const LikeUseCase = require("../LikeUseCase");
const LikeRepository = require("../../../Domains/likes/LikeRepository");

describe("LikeUseCase", () => {
  it("should orchestrating the like comment action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      userId: "user-123",
    };

    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.verifyCommentExist = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(useCasePayload.threadId, useCasePayload.commentId)
      );
    mockLikeRepository.isCommentLiked = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(useCasePayload.userId, useCasePayload.commentId)
      );
    mockLikeRepository.likeComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.userId, useCasePayload.commentId));
    mockLikeRepository.unlikeComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.userId, useCasePayload.commentId));

    /** creating use case instance */
    const getLikeUseCase = new LikeUseCase({
      likeRepository: mockLikeRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const likeEntity = await getLikeUseCase.execute(useCasePayload);

    // Assert
    expect(likeEntity).toBeUndefined();
    expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(
      useCasePayload.threadId,
      useCasePayload.commentId
    );
    expect(mockLikeRepository.isCommentLiked).toBeCalledWith(
      useCasePayload.userId,
      useCasePayload.commentId
    );
  });
});
