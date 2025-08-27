class ThreadEntity {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, title, owner } = payload;

    this.id = id;
    this.title = title;
    this.owner = owner;
  }

  _verifyPayload({ id, title, owner }) {
    if (!id || !title || !owner) {
      throw new Error('ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof title !== 'string' || typeof owner !== 'string') {
      throw new Error('ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (!/^thread-\w+$/.test(id)) {
      throw new Error('ADD_THREAD.ID_NOT_VALID');
    }

    if (title.length > 100) {
      throw new Error('ADD_THREAD.TITLE_LIMIT_CHAR');
    }
  }
}

module.exports = ThreadEntity;
