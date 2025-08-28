const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const container = require("../../container");
const createServer = require("../createServer");
const preRequireSiteHelper = require("../../../../tests/PreRequireSiteHelper");

describe("Threads endpoint", () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
  });

  describe("when POST /threads", () => {
    it("should response 401 when unauthenticated", async () => {
      // Arrange
      const requestPayload = {
        title: "A thread",
        body: "A body thread",
      };

      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toBeDefined();
    });

    it("should response 400 when request payload not contain property", async () => {
      // Arrange
      const server = await createServer(container);

      const { accessToken } = await preRequireSiteHelper({
        server,
        username: "Hiiro",
      });

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: { title: "A thread" },
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toBeDefined();
    });

    it("should response 400 when request payload not meet data type specification", async () => {
      // Arrange
      const requestPayload = {
        title: "A thread",
        body: true,
      };
      const server = await createServer(container);
      const { accessToken } = await preRequireSiteHelper({
        server,
        username: "Hiiro",
      });

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toBeDefined();
    });

    it("should response 400 when title more than 100 character", async () => {
      // Arrange
      const requestPayload = {
        title: "A".repeat(101),
        body: "A body thread",
      };
      const server = await createServer(container);
      const { accessToken } = await preRequireSiteHelper({
        server,
        username: "Hiiro",
      });

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).not.toBeNull();
    });

    it("should response 201 and persisted thread", async () => {
      // Arrange
      const requestPayload = {
        title: "A Thread",
        body: "A body thread",
      };
      // eslint-disable-next-line no-undef
      const server = await createServer(container);
      const { accessToken } = await preRequireSiteHelper({
        server,
        username: "Hiiro",
      });

      // Action
      const response = await server.inject({
        method: "POST",
        url: "/threads",
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.addedThread).toBeDefined();
    });
  });

  describe("when GET /threads/{threadId}", () => {
    it("should response 404 when thread not found", async () => {
      // Arrange
      const server = await createServer(container);
      const threadId = "thread-123";

      // Action
      const response = await server.inject({
        method: "GET",
        url: `/threads/${threadId}`,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual("fail");
      expect(responseJson.message).toBeDefined();
    });

    it("should response 200 and thread detail", async () => {
      // Arrange
      const server = await createServer(container);
      await UsersTableTestHelper.addUser({ id: "user-123", username: "Hiiro" });
      await UsersTableTestHelper.addUser({ id: "user-124", username: "Taka" });
      await ThreadsTableTestHelper.addThread({
        id: "thread-123",
        owner: "user-123",
      });
      await CommentsTableTestHelper.addComment({
        id: "comment-123",
        threadId: "thread-123",
        owner: "user-124",
      });

      // Action
      const response = await server.inject({
        method: "GET",
        url: "/threads/thread-123",
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual("success");
      expect(responseJson.data.thread).toBeDefined();
      expect(responseJson.data.thread.comments).toBeInstanceOf(Array);
      expect(responseJson.data.thread.comments).toHaveLength(1);
      expect(responseJson.data.thread.comments[0]).toEqual(
        expect.objectContaining({
          id: "comment-123",
          username: "Taka",
          content: "Content of comment",
          date: expect.any(String),
        })
      );
    });
  });
});
