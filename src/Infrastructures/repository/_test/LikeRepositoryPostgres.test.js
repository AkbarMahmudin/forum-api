const pool = require("../../database/postgres/pool");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const LikeRepositoryPostgres = require("../LikeRepositoryPostgres");

describe("LikeRepository", () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("likeComment function", () => {
    it("should persist like comment", async () => {
      // Arrange User
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

      const fakeIdGenerator = () => "123"; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await likeRepositoryPostgres.likeComment("user-123", "comment-123");

      // Assert
      const likes = await LikesTableTestHelper.findLikesById("like-123");
      expect(likes).toHaveLength(1);
    });
  });

  describe("unlikeComment function", () => {
    it("should persist unlike comment", async () => {
      // Arrange User
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
      await LikesTableTestHelper.addLike({ id: 'like-123' });

      const fakeIdGenerator = () => "123"; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await likeRepositoryPostgres.unlikeComment("user-123", "comment-123");

      // Assert
      const likes = await LikesTableTestHelper.findLikesById("like-123");
      expect(likes).toHaveLength(0);
    });
  });

  describe("isCommentLiked function", () => {
    it("should is liked comment", async () => {
      // Arrange User
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
      await LikesTableTestHelper.addLike({ id: 'like-123' });

      const fakeIdGenerator = () => "123"; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const isLiked = await likeRepositoryPostgres.isCommentLiked("user-123", "comment-123");

      // Assert
      expect(isLiked).toEqual(true);
    });
    
    it("should is unliked comment", async () => {
      // Arrange User
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

      const fakeIdGenerator = () => "123"; // stub!
      const likeRepositoryPostgres = new LikeRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const isLiked = await likeRepositoryPostgres.isCommentLiked("user-123", "comment-123");

      // Assert
      expect(isLiked).toEqual(false);
    });
  });
});
