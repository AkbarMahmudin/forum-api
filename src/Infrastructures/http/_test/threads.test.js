const pool = require("../../database/postgres/pool");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
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
});
