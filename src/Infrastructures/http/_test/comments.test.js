const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");
const preRequireSiteHelper = require("../../../../tests/PreRequiresiteHelper");

describe("Comments endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe("when POST /threads/{threadId}/comments", () => {
    it("should response 401 when unauthenticated", async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: "user-123" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments",
        payload: {
          comment: "A comment",
        },
      });

      
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toBeDefined();
    });

    it("should response 400 when request payload not contain property", async () => {
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

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments",
        payload: {},
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toBeDefined();
    });

    it("should response 400 when request payload not meet data type specification", async () => {
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

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments",
        payload: { content: 123 },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toBeDefined();
    });

    it("should response 201 and persisted thread", async () => {
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

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads/thread-123/comments",
        payload: { content: "A comment" },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedComment).toBeDefined();
    });
  });

  describe("when DELETE /threads/{threadId}/comments/{comentId}", () => {
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
        method: "DELETE",
        url: "/threads/thread-123/comments/comment-123",
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.message).toBeDefined();
    });

    it("should response 404 when thread not found", async () => {
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
        method: "DELETE",
        url: "/threads/xxx/comments/comment-123",
        payload: {},
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toBeDefined();
    });

    it("should response 404 when comment not found", async () => {
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
        method: "DELETE",
        url: "/threads/thread-123/comments/xxx",
        payload: {},
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toBeDefined();
    });

    it("should response 403 when delete with not comment's owner", async () => {
      // Arrange
      const server = await createServer(container);
      // 1. auth as comment not owner
      const { accessToken } = await preRequireSiteHelper({
        server,
        username: "Hiiro",
      });
      // 2. add thread
      await UsersTableTestHelper.addUser({
        id: "user-124",
        username: "thread owner",
      });
      await ThreadsTableTestHelper.addThread({
        id: "thread-124",
        owner: "user-124",
      });
      // 3. add comment as comment owner
      await UsersTableTestHelper.addUser({
        id: "user-125",
        username: "commentor owner",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-125",
        threadId: "thread-124",
        owner: "user-125",
      });

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: "/threads/thread-124/comments/comment-125",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toBeDefined();
    });

    it("should response 200 and success deleted", async () => {
      // Arrange
      // eslint-disable-next-line no-undef
      const server = await createServer(container);

      // add thread
      await UsersTableTestHelper.addUser({ id: "user-124", username: "Taka" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-124",
        owner: "user-124",
      });

      // add comment as comment owner
      const { accessToken, userId } = await preRequireSiteHelper({
        server,
        username: "Hiiro",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-124",
        owner: userId,
      });

      // Action
      const response = await server.inject({
        method: "DELETE",
        url: "/threads/thread-124/comments/comment-123",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
    });
  });
});
