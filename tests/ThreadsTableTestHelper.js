/* istanbul ignore file */
const pool = require("../src/Infrastructures/database/postgres/pool");

const ThreadsTableTestHelper = {
  async addThread({
    id = "thred-123",
    title = "Title of thread",
    body = "This is body of thread",
    owner = "user-123",
  }) {
    const createdAt = new Date().toISOString();
    const query = {
      text: "INSERT INTO threads VALUES($1, $2, $3, $4, $5, $6)",
      values: [id, title, body, owner, createdAt, createdAt],
    };

    await pool.query(query);
  },

  async findThreadsById(id) {
    const query = {
      text: "SELECT * FROM threads WHERE id = $1",
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query("DELETE FROM threads WHERE 1=1");
  },
};

module.exports = ThreadsTableTestHelper;
