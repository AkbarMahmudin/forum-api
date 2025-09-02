const CreateThreadDto = require("../CreateThreadDto");

describe("CreateThreadDto entity", () => {
  it("should throw error when payload did not contain needed property", () => {
    // Arrange
    const payload = {
      title: "A thread title",
    };

    // Action & Assert
    expect(() => new CreateThreadDto(payload)).toThrow(
      "ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when payload did not meet data type specification", () => {
    // Arrange
    const payload = {
      title: "A thread title",
      body: true,
      ownerId: 'user-123',
    };

    // Action & Assert
    expect(() => new CreateThreadDto(payload)).toThrow(
      "ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION"
    );
  });

  it("should throw error when title more than 100 characters", () => {
    // Arrange
    const payload = {
      title: "A".repeat(101),
      body: "A thread body",
      ownerId: 'user-123',
    };

    // Action & Assert
    expect(() => new CreateThreadDto(payload)).toThrow(
      "ADD_THREAD.TITLE_LIMIT_CHAR"
    );
  });

  it("should create AddedThread object correctly", () => {
    // Arrange
    const payload = {
      title: "A thread title",
      body: "A thread body",
      ownerId: 'user-123',
    };

    // Action
    const { title, body, ownerId } = new CreateThreadDto(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(ownerId).toEqual(payload.ownerId);
  });
});
