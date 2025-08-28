const ThreadEntity = require("../ThreadEntity");

describe("ThreadEntity entity", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      title: "A thread title",
      body: "A thread body",
    };

    // Action & Assert
    expect(() => new ThreadEntity(payload)).toThrow(
      "ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "A thread title",
      owner: true,
    };

    // Action & Assert
    expect(() => new ThreadEntity(payload)).toThrow(
      "ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should throw error when title more than 100 characters", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "A".repeat(101),
      owner: "user-123",
    };

    // Action & Assert
    expect(() => new ThreadEntity(payload)).toThrow(
      "ADD_THREAD.TITLE_LIMIT_CHAR"
    );
  });

  it("should create ThreadEntity object correctly", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "A thread title",
      owner: "user-123",
    };

    // Action
    const { id, title, owner } = new ThreadEntity(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(owner).toEqual(payload.owner);
  });
});
