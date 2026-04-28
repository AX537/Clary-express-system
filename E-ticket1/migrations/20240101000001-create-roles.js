export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('roles', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true
    },
    permissions: {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: [],
      comment: 'Array of permission strings defining what actions this role can perform'
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    }
  });

  // Add unique index on name
  await queryInterface.addIndex('roles', ['name'], {
    unique: true,
    name: 'roles_name_unique'
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('roles');
}
