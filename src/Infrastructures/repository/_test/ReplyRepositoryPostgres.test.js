const pool = require("../../database/postgres/pool");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const CommentEntity = require("../../../Domains/comments/entities/CommentEntity");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");

describe("ReplyRepository", () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe("createReply function", () => {
    it("should persist new reply comment and return added Comment correctly", async () => {
      // Arrange User
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await UsersTableTestHelper.addUser({ id: 'user-2', username: 'user 2' });
      await UsersTableTestHelper.addUser({ id: 'user-3', username: 'user 3' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-2' });

      // Arrange
      const newReply = {
        threadId: "thread-123",
        commentId: "comment-123",
        ownerId: "user-3",
        content: "A New Reply Comment",
      };

      const fakeIdGenerator = () => "123"; // stub!
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const createdReply = await replyRepositoryPostgres.createReply(newReply);

      // Assert
      const replies = await CommentsTableTestHelper.findCommentsById('reply-123');
      expect(createdReply).toStrictEqual(new CommentEntity({
        id: 'reply-123',
        content: newReply.content,
        ownerId: newReply.ownerId,
      }));
      expect(replies).toHaveLength(1);
    });
  });

  describe("deleteReply function", () => {
    it("should throw NotFoundError when reply comment not found", async () => {
      // Arrange
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(replyRepositoryPostgres.deleteReply({
        threadId: 'thread-123',
        commentId: 'comment-123',
        replyId: 'reply-123'
      }))
        .rejects
        .toThrowError(NotFoundError);
    });

    it("should delete comment correctly", async () => {
      // Arrange User
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await UsersTableTestHelper.addUser({ id: 'user-2', username: 'user 2' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'reply-123', threadId: 'thread-123', replyTo: 'comment-123', owner: 'user-2' });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      // Action
      await replyRepositoryPostgres.deleteReply({
        threadId: 'thread-123',
        commentId: 'comment-123',
        replyId: 'reply-123'
      });

      // Assert
      const replies = await CommentsTableTestHelper.findCommentsById('reply-123');
      expect(replies[0].deleted_at).not.toBeNull();
    });
  });
});
