const pool = require("../../database/postgres/pool");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadEntity = require("../../../Domains/threads/entities/ThreadEntity");

describe("ThreadRepository", () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("addThread function", () => {
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
        owner: "user-123",
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
        owner: 'user-123'
      }));
      expect(threads).toHaveLength(1);
    });
  });
});
