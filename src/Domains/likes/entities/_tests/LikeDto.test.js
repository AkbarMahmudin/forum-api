const LikeDto = require("../LikeDto");

describe("LikeDto entity", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      userId: "user-123",
    };

    // Action & Assert
    expect(() => new LikeDto(payload)).toThrow(
      "LIKE.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      commentId: true,
      userId: 'user-123',
    };

    // Action & Assert
    expect(() => new LikeDto(payload)).toThrow(
      "LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should create LikeDto object correctly", () => {
    // Arrange
    const payload = {
      commentId: "comment-123",
      userId: 'user-123',
    };

    // Action
    const { commentId, userId } = new LikeDto(payload);

    // Assert
    expect(commentId).toEqual(payload.commentId);
    expect(userId).toEqual(payload.userId);
  });
});
