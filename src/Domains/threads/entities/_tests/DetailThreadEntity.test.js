const DetailThreadEntity = require("../DetailThreadEntity");

describe("DetailThreadEntity entity", () => {
  it("should throw error when payload did not contain needed property or not meet data type specification", () => {
    // Arrange
    const payload = {
      title: "A thread title",
      body: "A thread body",
      username: 123,
    };

    // Action & Assert
    expect(() => new DetailThreadEntity(payload)).toThrow(
      "DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY"
    );
  });

  it("should throw error when title more than 100 characters", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "A".repeat(101),
      username: "dicoding",
      body: "A thread body",
      date: "2021-08-08T07:19:09.775Z",
      comments: [],
    };

    // Action & Assert
    expect(() => new DetailThreadEntity(payload)).toThrow(
      "DETAIL_THREAD.TITLE_LIMIT_CHAR"
    );
  });

  it("should throw error when comments not array", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "A Title Thread",
      username: "dicoding",
      body: "A thread body",
      date: "2021-08-08T07:19:09.775Z",
      comments: {},
    };

    // Action & Assert
    expect(() => new DetailThreadEntity(payload)).toThrow(
      "DETAIL_THREAD.COMMENTS_NOT_ARRAY"
    );
  });

  it("should create DetailThreadEntity object correctly", () => {
    // Arrange
    const payload = {
      id: "thread-123",
      title: "A Title Thread",
      username: "dicoding",
      body: "A thread body",
      date: "2021-08-08T07:19:09.775Z",
      comments: [],
    };

    // Action
    const thread = new DetailThreadEntity(payload);

    // Assert
    expect(thread).toBeInstanceOf(DetailThreadEntity);
    expect(thread.id).toEqual(payload.id);
    expect(thread.title).toEqual(payload.title);
    expect(thread.username).toEqual(payload.username);
    expect(thread.body).toEqual(payload.body);
    expect(thread.date).toEqual(payload.date);
    expect(thread.comments).toEqual(payload.comments);
  });
});
