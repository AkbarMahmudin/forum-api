const CommentRepository = require("../../../Domains/comments/CommentRepository");
const CreateReplyUseCase = require("../CreateReplyUseCase");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");

describe("CreateReplyUseCase", () => {
  it("should orchestrating the reply comment action correctly", async () => {
    // Arrange
    const useCasePayload = {
      threadId: "thread-123",
      commentId: "comment-123",
      ownerId: "user-123",
      content: "A comment content",
    };

    /** creating dependency of use case */
    const mockReplyRepository = new ReplyRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.verifyCommentExist = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve(useCasePayload.threadId, useCasePayload.commentId)
      );
    mockReplyRepository.createReply = jest
      .fn()
      .mockImplementation(() => Promise.resolve(useCasePayload));

    /** creating use case instance */
    const getCommentUseCase = new CreateReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const replyEntity = await getCommentUseCase.execute(useCasePayload);

    // Assert
    expect(replyEntity).toStrictEqual(useCasePayload);
    expect(mockReplyRepository.createReply).toBeCalledWith(useCasePayload);
  });
});
