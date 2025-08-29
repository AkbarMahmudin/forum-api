class DetailThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(threadId) {
    const detailThread = await this._threadRepository.getDetailThread(threadId);

    const { comments = [] } = detailThread;
    detailThread.comments = this._mapComments(comments);

    return detailThread;
  }

  _mapComments(comments = []) {
    return comments.map((comment) => ({
      ...comment,
      content: comment.deletedAt ? "**komentar telah dihapus**" : comment.content,
      deletedAt: undefined,
      replies: this._mapComments(comment.replies),
    }));
  }
}

module.exports = DetailThreadUseCase;
