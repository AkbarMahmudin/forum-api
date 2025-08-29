class CreateReplyDto {
  constructor(payload) {
    this._verifyPayload(payload);

    const { threadId, replyTo, content } = payload;

    this.threadId = threadId;
    this.replyTo = replyTo;
    this.content = content;
    // this.owner = owner;
  }

  _verifyPayload({ threadId, replyTo, content }) {
    if (!content || !threadId || !replyTo) {
      throw new Error("ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (
      typeof content !== "string" ||
      typeof threadId !== "string" ||
      typeof replyTo !== "string"
      // typeof owner !== "string"
    ) {
      throw new Error("ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION");
    }
  }
}

module.exports = CreateReplyDto;
