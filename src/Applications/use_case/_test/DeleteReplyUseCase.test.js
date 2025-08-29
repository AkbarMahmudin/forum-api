const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AuthenticationTokenManager = require("../../security/AuthenticationTokenManager");
const DeleteReplyUseCase = require("../DeleteReplyUseCase");

describe("DeleteCommentUseCase", () => {
  it("should orchestrating the add reply action correctly", async () => {
    // Arrange
    const threadId = "thread-123";
    const commentId = "comment-123";
    const replyId = "reply-123";
    const headers = "Bearer AccessToken";

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockJwtTokenManager = new AuthenticationTokenManager();

    /** mocking needed function */
    mockJwtTokenManager.authorize = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ username: "Jhon", id: "user-123" })
      );
    mockJwtTokenManager.decodePayload = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ username: "Jhon", id: "user-123" })
      );
    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const getReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      jwtTokenManager: mockJwtTokenManager,
    });

    // Action
    const commentEntity = await getReplyUseCase.execute({
      threadId,
      commentId,
      replyId,
      headerAuthorization: headers,
    });

    // Assert
    expect(commentEntity).toBeUndefined();
    expect(mockJwtTokenManager.authorize).toBeCalledWith(headers);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
      replyId,
      "user-123"
    );
    expect(mockReplyRepository.deleteReply).toBeCalledWith({
      threadId,
      commentId,
      replyId,
    });
  });
});
