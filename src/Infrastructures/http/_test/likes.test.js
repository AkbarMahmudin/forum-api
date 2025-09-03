const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");
const preRequireSiteHelper = require("../../../../tests/PreRequiresiteHelper");

describe("Likes endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe("when POST /threads/{threadId}/comments/{commentId}/likes", () => {
    it("should response 401 when unauthenticated", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-123",
      });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "PUT",
        url: "/threads/thread-123/comments/comment-123/likes",
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toBeDefined();
    });

    it("should response 404 when comment or thread not found", async () => {
      // Arrange
      const server = await createServer(container);

      const { accessToken, userId } = await preRequireSiteHelper({
        server,
        username: "Hiiro",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: userId,
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: userId,
      });

      // Action
      const response = await server.inject({
        method: "PUT",
        url: "/threads/xxx/comments/xxx/likes",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toBeDefined();
    });

    it("should response 200 when like", async () => {
      // Arrange
      // eslint-disable-next-line no-undef
      const server = await createServer(container);
      const { accessToken, userId } = await preRequireSiteHelper({
        server,
        username: "Hiiro",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: userId,
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: userId,
      });

      // Action
      const response = await server.inject({
        method: "PUT",
        url: "/threads/thread-123/comments/comment-123/likes",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });

    it("should response 200 when unlike", async () => {
      // Arrange
      // eslint-disable-next-line no-undef
      const server = await createServer(container);
      const { accessToken, userId } = await preRequireSiteHelper({
        server,
        username: "Hiiro",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: userId,
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId: 'thread-123',
        owner: userId,
      });
      await LikesTableTestHelper.addLike({
        commentId: 'comment-123',
        userId,
      });

      // Action
      const response = await server.inject({
        method: "PUT",
        url: "/threads/thread-123/comments/comment-123/likes",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });
  });
});
