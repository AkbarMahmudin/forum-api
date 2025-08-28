const CreateCommentDto = require("../../../Domains/comments/entities/CreateCommentDto");
const CommentEntity = require("../../../Domains/comments/entities/CommentEntity");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AuthenticationTokenManager = require("../../security/AuthenticationTokenManager");
const CreateCommentUseCase = require("../CreateCommentUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");

describe("CreateCommentUseCase", () => {
  it("should orchestrating the add comment action correctly", async () => {
    // Arrange
    const threadId = "thread-123";
    const useCasePayload = {
      content: "A comment content",
    };

    const headers = "Bearer AccessToken";

    const mockCommentEntity = new CommentEntity({
      id: "comment-123",
      content: useCasePayload.content,
      owner: "user-123",
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockJwtTokenManager = new AuthenticationTokenManager();

    /** mocking needed function */
    mockJwtTokenManager.authorize = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ username: "Jhon", id: mockCommentEntity.owner })
      );

    mockThreadRepository.getDetailThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    mockCommentRepository.createComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCommentEntity));

    /** creating use case instance */
    const getCommentUseCase = new CreateCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
      jwtTokenManager: mockJwtTokenManager,
    });

    // Action
    const commentEntity = await getCommentUseCase.execute(
      threadId,
      useCasePayload,
      headers
    );

    // Assert
    expect(commentEntity).toStrictEqual(
      new CommentEntity({
        id: "comment-123",
        content: useCasePayload.content,
        owner: "user-123",
      })
    );
    expect(mockCommentRepository.createComment).toBeCalledWith(
      new CreateCommentDto({
        threadId,
        content: useCasePayload.content,
        owner: "user-123",
      })
    );
  });
});
