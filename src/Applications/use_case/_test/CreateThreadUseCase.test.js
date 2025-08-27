const CreateThreadDto = require("../../../Domains/threads/entities/CreateThreadDto");
const ThreadEntity = require("../../../Domains/threads/entities/ThreadEntity");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AuthenticationTokenManager = require("../../security/AuthenticationTokenManager");
const CreateThreadUseCase = require("../CreateThreadUseCase");

describe("CreateThreadUseCase", () => {
  it("should orchestrating the add thread action correctly", async () => {
    // Arrange
    const useCasePayload = {
      title: "A thread",
      body: "A body thread",
    };

    const headers = "Bearer AccessToken";

    const mockThreadEntity = new ThreadEntity({
      id: "thread-123",
      title: useCasePayload.title,
      owner: "user-123",
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockJwtTokenManager = new AuthenticationTokenManager();

    /** mocking needed function */
    mockJwtTokenManager.authorize = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ username: "Jhon", id: mockThreadEntity.owner })
      );

    mockThreadRepository.createThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThreadEntity));

    /** creating use case instance */
    const getThreadUseCase = new CreateThreadUseCase({
      threadRepository: mockThreadRepository,
      jwtTokenManager: mockJwtTokenManager,
    });

    // Action
    const threadEntity = await getThreadUseCase.execute(
      useCasePayload,
      headers
    );

    // Assert
    expect(threadEntity).toStrictEqual(
      new ThreadEntity({
        id: "thread-123",
        title: useCasePayload.title,
        owner: "user-123",
      })
    );
    expect(mockThreadRepository.createThread).toBeCalledWith(
      new CreateThreadDto({
        ...useCasePayload,
        owner: "user-123",
      })
    );
  });
});
