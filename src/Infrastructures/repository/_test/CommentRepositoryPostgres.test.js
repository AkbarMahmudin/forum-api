const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentEntity = require("../../../Domains/comments/entities/CommentEntity");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");

describe("CommentRepository", () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("createComment function", () => {
    it("should persist new comment and return added Comment correctly", async () => {
      // Arrange User
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });

      // Arrange Comment
      const newComment = {
        content: "A New Comment",
        threadId: "thread-123",
        ownerId: "user-123",
      };

      const fakeIdGenerator = () => "123"; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const createdComment = await commentRepositoryPostgres.createComment(newComment);

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(createdComment).toStrictEqual(new CommentEntity({
        id: 'comment-123',
        content: newComment.content,
        ownerId: 'user-123'
      }));
      expect(comments).toHaveLength(1);
    });
  });

  describe("deleteComment function", () => {
    it("should throw NotFoundError when comment not found", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.deleteComment('thread-123', 'comment-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it("should delete comment correctly", async () => {
      // Arrange User
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      await commentRepositoryPostgres.deleteComment('thread-123', 'comment-123');

      // Assert
      const comments = await CommentsTableTestHelper.findCommentsById('comment-123');
      expect(comments[0].deleted_at).not.toBeNull();
    });
  });

  describe("verifyCommentOwner function", () => {
    it("should throw AuthorizationError when comment owner is not the same as user", async () => {
      // Arrange User
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await UsersTableTestHelper.addUser({ id: 'user-456', username: 'hiiro' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-456'))
        .rejects
        .toThrowError(AuthorizationError);
    });

    it("should not throw NotFoundError and AuthorizationError when comment ownerId is the same as user", async () => {
      // Arrange User
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'))
        .resolves
        .not.toThrowError(NotFoundError);
      await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'))
        .resolves
        .not.toThrowError(AuthorizationError);
    });
  });

  describe("verifyCommentExist function", () => {
    it("should throw NotFoundError when comment not found", async () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentExist('thread-123', 'comment-123'))
        .rejects
        .toThrowError(NotFoundError);
    });

    it("should not throw NotFoundError when comment is found", async () => {
      // Arrange User
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(commentRepositoryPostgres.verifyCommentExist('thread-123', 'comment-123'))
        .resolves
        .not.toThrowError(NotFoundError);
    });
  });
});
