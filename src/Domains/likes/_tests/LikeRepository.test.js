const LikeRepository = require("../LikeRepository");

describe("LikeRepository", () => {
  it("should throw error when calling unimplemented methods", async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Action & Assert
    await expect(likeRepository.likeComment()).rejects.toThrow(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(likeRepository.unlikeComment()).rejects.toThrow(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(likeRepository.isCommentLiked()).rejects.toThrow(
      "LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
