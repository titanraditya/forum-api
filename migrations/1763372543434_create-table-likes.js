/* eslint-disable camelcase */

exports.up = pgm => {
  pgm.createTable('likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    comment: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    user: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('likes');
};
