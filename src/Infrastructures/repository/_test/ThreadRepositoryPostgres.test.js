const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadEntity = require("../../../Domains/threads/entities/ThreadEntity");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe("ThreadRepository", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("createThread function", () => {
    it("should persist new thread and return added thread correctly", async () => {
      // Arrange User
      const newUser = {
        id: "user-123",
        username: "dicoding",
        password: "secret",
        fullname: "Dicoding Indonesia",
      };
      await UsersTableTestHelper.addUser(newUser);

      // Arrange Thread
      const newThread = {
        title: "A New Thread",
        body: "This is the body of the new thread",
        ownerId: "user-123",
      };

      const fakeIdGenerator = () => "123"; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const createdThread = await threadRepositoryPostgres.createThread(newThread);

      // Assert
      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(createdThread).toStrictEqual(new ThreadEntity({
        id: 'thread-123',
        title: newThread.title,
        ownerId: 'user-123'
      }));
      expect(threads).toHaveLength(1);
    });
  });

  describe("getDetailThread function", () => {
    it("should throw InvariantError when thread not found", async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(threadRepositoryPostgres.getDetailThread('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it("should return thread detail correctly", async () => {
      // Arrange User
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });

      // Arrange Thread
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123'});

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action
      const threadDetail = await threadRepositoryPostgres.getDetailThread('thread-123');

      // Assert
      expect(threadDetail).toStrictEqual({
        id: 'thread-123',
        title: threadDetail.title,
        body: threadDetail.body,
        date: threadDetail.date,
        username: 'dicoding',
        comments: [],
      });
    });
  });
});
