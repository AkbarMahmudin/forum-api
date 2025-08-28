const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AuthenticationTokenManager = require("../../security/AuthenticationTokenManager");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");

describe("CreateCommentUseCase", () => {
  it("should orchestrating the add comment action correctly", async () => {
    // Arrange
    const threadId = "thread-123";
    const commentId = "comment-123";
    const headers = "Bearer AccessToken";

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockJwtTokenManager = new AuthenticationTokenManager();

    /** mocking needed function */
    mockJwtTokenManager.authorize = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ username: "Jhon", id: "user-123" })
      );
    mockCommentRepository.verifyCommentOwner = jest
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const getCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      jwtTokenManager: mockJwtTokenManager,
    });

    // Action
    const commentEntity = await getCommentUseCase.execute(
      threadId,
      commentId,
      headers
    );

    // Assert
    expect(commentEntity).toBeUndefined();
    expect(mockJwtTokenManager.authorize).toBeCalledWith(headers);
    expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(
      commentId,
      "user-123"
    );
    expect(mockCommentRepository.deleteComment).toBeCalledWith(
      threadId,
      commentId
    );
  });
});
