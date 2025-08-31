const CreateCommentDto = require("../../../Domains/comments/entities/CreateCommentDto");
const CommentEntity = require("../../../Domains/comments/entities/CommentEntity");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const CreateCommentUseCase = require("../CreateCommentUseCase");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");

describe("CreateCommentUseCase", () => {
  it("should orchestrating the add comment action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      content: "A comment content",
      ownerId: "user-123",
    };

    const mockCommentEntity = new CommentEntity({
      id: "comment-123",
      content: useCasePayload.content,
      ownerId: useCasePayload.ownerId,
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.getDetailThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(useCasePayload.threadId));
    mockCommentRepository.createComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockCommentEntity));

    /** creating use case instance */
    const getCommentUseCase = new CreateCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const commentEntity = await getCommentUseCase.execute(useCasePayload);

    // Assert
    expect(commentEntity).toStrictEqual(
      new CommentEntity({
        id: "comment-123",
        content: useCasePayload.content,
        ownerId: useCasePayload.ownerId,
      })
    );
    expect(mockCommentRepository.createComment).toBeCalledWith(
      new CreateCommentDto(useCasePayload)
    );
  });
});
