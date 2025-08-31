const CreateThreadDto = require("../../../Domains/threads/entities/CreateThreadDto");
const ThreadEntity = require("../../../Domains/threads/entities/ThreadEntity");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CreateThreadUseCase = require("../CreateThreadUseCase");

describe("CreateThreadUseCase", () => {
  it("should orchestrating the add thread action correctly", async () => {
    // Arrange
    const useCasePayload = {
      title: "A thread",
      body: "A body thread",
      ownerId: "user-123",
    };

    const headers = "Bearer AccessToken";

    const mockThreadEntity = new ThreadEntity({
      id: "thread-123",
      title: useCasePayload.title,
      ownerId: useCasePayload.ownerId,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.createThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThreadEntity));

    /** creating use case instance */
    const getThreadUseCase = new CreateThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const threadEntity = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(threadEntity).toStrictEqual(
      new ThreadEntity({
        id: "thread-123",
        title: useCasePayload.title,
        ownerId: "user-123",
      })
    );
    expect(mockThreadRepository.createThread).toBeCalledWith(
      new CreateThreadDto(useCasePayload)
    );
  });
});
