const CreateReplyDto = require("../../../Domains/replies/entities/CreateReplyDto");
const CommentEntity = require("../../../Domains/comments/entities/CommentEntity");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AuthenticationTokenManager = require("../../security/AuthenticationTokenManager");
const CreateReplyUseCase = require("../CreateReplyUseCase");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");

describe("CreateReplyUseCase", () => {
  it("should orchestrating the reply comment action correctly", async () => {
    // Arrange
    const threadId = "thread-123";
    const useCasePayload = {
      threadId: "thread-123",
      replyTo: "comment-123",
      content: "A comment content",
      owner: "user-123",
    };

    const headers = "Bearer AccessToken";

    const mockCommentEntity = new CommentEntity({
      id: "comment-123",
      content: useCasePayload.content,
      owner: "user-123",
    });

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();
    const mockJwtTokenManager = new AuthenticationTokenManager();

    /** mocking needed function */
    mockJwtTokenManager.authorize = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ username: "Jhon", id: mockCommentEntity.owner })
      );
    mockCommentRepository.verifyCommentExist = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCommentEntity));
    mockReplyRepository.createReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCommentEntity));

    /** creating use case instance */
    const getCommentUseCase = new CreateReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      jwtTokenManager: mockJwtTokenManager,
    });

    // Action
    const commentEntity = await getCommentUseCase.execute({
      threadId,
      replyTo: useCasePayload.replyTo,
      content: useCasePayload.content,
      headerAuthorization: headers,
    });

    // Assert
    expect(commentEntity).toStrictEqual(
      new CommentEntity({
        id: "comment-123",
        content: useCasePayload.content,
        owner: "user-123",
      })
    );
    expect(mockReplyRepository.createReply).toBeCalledWith(
      {
        threadId,
        replyTo: useCasePayload.replyTo,
        content: useCasePayload.content,
        owner: "user-123",
      }
    );
  });
});
