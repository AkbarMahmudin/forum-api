const CreateCommentdDto = require("../CreateCommentDto");

describe("CreateCommentdDto entity", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      content: "A comment content",
    };

    // Action & Assert
    expect(() => new CreateCommentdDto(payload)).toThrow(
      "ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      content: "A comment content",
      threadId: true,
      ownerId: 'user-123',
    };

    // Action & Assert
    expect(() => new CreateCommentdDto(payload)).toThrow(
      "ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create CommentDto object correctly", () => {
    // Arrange
    const payload = {
      content: "A comment content",
      threadId: "thread-123",
      ownerId: 'user-123',
    };

    // Action
    const { content, threadId, ownerId } = new CreateCommentdDto(payload);

    // Assert
    expect(content).toEqual(payload.content);
    expect(threadId).toEqual(payload.threadId);
    expect(ownerId).toEqual(payload.ownerId);
  });
});
