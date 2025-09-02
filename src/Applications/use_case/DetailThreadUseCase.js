class DetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getDetailThread(threadId);
    
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    return {
      ...thread,
      comments: this._mapComments(comments),
    };
  }

  _mapComments(comments = [], isReply = false) {
    return comments?.map((comment) => ({
      ...comment,
      content: comment.deletedAt
        ? `**${isReply ? "balasan" : "komentar"} telah dihapus**`
        : comment.content,
      deletedAt: undefined,
      replies: this._mapComments(comment.replies, true),
    }));
  }
}

module.exports = DetailThreadUseCase;
