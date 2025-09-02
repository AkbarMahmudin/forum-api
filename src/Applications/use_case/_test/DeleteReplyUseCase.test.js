const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DeleteReplyUseCase = require("../DeleteReplyUseCase");

describe("DeleteCommentUseCase", () => {
  it("should orchestrating the add reply action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      replyId: "reply-123",
      ownerId: "user-123",
    };

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    // const mockJwtTokenManager = new AuthenticationTokenManager();

    /** mocking needed function */
    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(useCasePayload.replyId, useCasePayload.ownerId)
      );
    mockCommentRepository.verifyCommentExist = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(useCasePayload.threadId, useCasePayload.replyId)
      );
    mockReplyRepository.deleteReply = jest.fn().mockImplementation(() =>
      Promise.resolve({
        threadId: useCasePayload.threadId,
        commentId: useCasePayload.commentId,
        replyId: useCasePayload.replyId,
      })
    );

    /** creating use case instance */
    const getReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
    });
    const expectedResult = {
      threadId: useCasePayload.threadId,
      commentId: useCasePayload.commentId,
      replyId: useCasePayload.replyId,
    };

    // Action
    const commentEntity = await getReplyUseCase.execute(useCasePayload);

    // Assert
    expect(commentEntity).toEqual(expectedResult);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
      useCasePayload.replyId,
      useCasePayload.ownerId
    );
    expect(mockReplyRepository.deleteReply).toBeCalledWith(expectedResult);
  });
});
