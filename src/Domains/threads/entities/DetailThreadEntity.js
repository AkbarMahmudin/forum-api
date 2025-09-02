class DetailThreadEntity {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, title, body, date, username, comments } = payload;

    this.id = id;
    this.title = title;
    this.username = username;
    this.body = body;
    this.date = date;
    this.comments = comments || [];
  }

  _verifyPayload({ id, title, body, date, username, comments }) {
    if (
      ![id, title, body, date, username].every(
        (prop) => typeof prop === "string" && prop.trim()
      )
    ) {
      throw new Error("DETAIL_THREAD.NOT_CONTAIN_NEEDED_PROPERTY");
    }

    if (title.length > 100) {
      throw new Error("DETAIL_THREAD.TITLE_LIMIT_CHAR");
    }

    if (!Array.isArray(comments)) {
      throw new Error("DETAIL_THREAD.COMMENTS_NOT_ARRAY");
    }
  }
}

module.exports = DetailThreadEntity;
