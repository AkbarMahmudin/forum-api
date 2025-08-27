const ThreadRepository = require("../ThreadRepository");

describe("ThreadRepository", () => {
  it("should throw error when calling unimplemented methods", async () => {
    // Arrange
    const threadRepository = new ThreadRepository();

    // Action & Assert
    await expect(threadRepository.createThread({})).rejects.toThrow(
      "THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED"
    );

    await expect(
      threadRepository.getDetailThread("thread-123")
    ).rejects.toThrow("THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED");
  });
});
