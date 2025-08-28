/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('comments', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        content: {
            type: 'TEXT',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'users(id)',
            onDelete: 'CASCADE',
        },
        reply_to: {
            type: 'VARCHAR(50)',
            references: 'comments(id)',
            onDelete: 'CASCADE',
            default: null,
        },
        thread_id: {
            type: 'VARCHAR(50)',
            references: 'threads(id)',
            onDelete: 'CASCADE',
            notNull: true,
        },
        created_at: {
            type: 'TIMESTAMP',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
        updated_at: {
            type: 'TIMESTAMP',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
        deleted_at: {
            type: 'TIMESTAMP',
            default: null,
        },
    });
};

exports.down = pgm => {
    pgm.dropTable('comments');
};
