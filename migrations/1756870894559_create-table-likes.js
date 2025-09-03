/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('likes', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'users(id)',
            onDelete: 'CASCADE',
        },
        comment_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'comments(id)',
            onDelete: 'CASCADE',
        },
    });
};

exports.down = pgm => {
    pgm.dropTable('likes');
};
