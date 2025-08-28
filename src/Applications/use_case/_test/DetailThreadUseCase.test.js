const CreateThreadDto = require("../../../Domains/threads/entities/CreateThreadDto");
const DetailThreadEntity = require("../../../Domains/threads/entities/DetailThreadEntity");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AuthenticationTokenManager = require("../../security/AuthenticationTokenManager");
const DetailThreadUseCase = require("../DetailThreadUseCase");

describe("DetailThreadUseCase", () => {
  it("should orchestrating the add thread action correctly", async () => {
    // Arrange
    const mockThreadEntity = new DetailThreadEntity({
      id: "thread-123",
      title: "A thread",
      username: "user-123",
      body: "A body thread",
      date: "2021-08-08T07:19:09.775Z",
      comments: [],
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getDetailThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockThreadEntity));

    /** creating use case instance */
    const getThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const threadEntity = await getThreadUseCase.execute(mockThreadEntity.id);

    // Assert
    expect(threadEntity).toStrictEqual(threadEntity);
    expect(mockThreadRepository.getDetailThread).toBeCalledWith(
      mockThreadEntity.id
    );
  });
});
