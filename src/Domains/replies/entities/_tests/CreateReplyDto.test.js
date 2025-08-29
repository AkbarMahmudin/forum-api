const CreateReplyDto = require("../CreateReplyDto");

describe("CreateReplyDto entity", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      content: "A comment content",
    };

    // Action & Assert
    expect(() => new CreateReplyDto(payload)).toThrow(
      "ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      content: "A comment content",
      threadId: true,
      replyTo: "comment-123",
      owner: "user-123",
    };

    // Action & Assert
    expect(() => new CreateReplyDto(payload)).toThrow(
      "ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create CommentDto object correctly", () => {
    // Arrange
    const payload = {
      content: "A comment content",
      threadId: "thread-123",
      replyTo: "comment-123",
      // owner: "user-123",
    };

    // Action
    const { content, replyTo, threadId } = new CreateReplyDto(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(replyTo).toEqual(payload.replyTo);
    expect(threadId).toEqual(payload.threadId);
    // expect(owner).toEqual(payload.owner);
  });
});
