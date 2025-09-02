const ReplyRepository = require("../ReplyRepository");

describe("ReplyRepository", () => {
  it("should throw error when calling unimplemented methods", async () => {
    // Arrange
    const replyRepository = new ReplyRepository();

    // Action & Assert
    await expect(replyRepository.createReply({})).rejects.toThrow(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
    await expect(replyRepository.deleteReply({})).rejects.toThrow(
      "REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );
  });
});
