const CommentEntity = require("../CommentEntity");

describe("CommentEntity entity", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      content: "A thread content",
      ownerId: "user-123",
    };

    // Action & Assert
    expect(() => new CommentEntity(payload)).toThrow(
      "ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "A comment content",
      ownerId: true,
    };

    // Action & Assert
    expect(() => new CommentEntity(payload)).toThrow(
      "ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create CommentEntity object correctly", () => {
    // Arrange
    const payload = {
      id: "comment-123",
      content: "A thread content",
      ownerId: "user-123",
    };

    // Action
    const { id, content, owner } = new CommentEntity(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(owner).toEqual(payload.ownerId);
  });
});
