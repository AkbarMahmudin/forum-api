class CreateCommentDto {
  constructor(payload) {
    this._verifyPayload(payload);

    const { content, ownerId, threadId } = payload;

    this.content = content;
    this.ownerId = ownerId;
    this.threadId = threadId;
  }

  _verifyPayload({ content, ownerId, threadId }) {
    if (!content || !threadId || !ownerId) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof content !== 'string' || typeof threadId !== 'string' || typeof ownerId !== 'string') {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = CreateCommentDto;
