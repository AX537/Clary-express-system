export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('bus_companies', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true
    },
    contact_email: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    contact_phone: {
      type: Sequelize.STRING(20),
      allowNull: false
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
    },
    deleted_at: {
      type: Sequelize.DATE,
      allowNull: true
    }
  });

  // Add unique index on name
  await queryInterface.addIndex('bus_companies', ['name'], {
    unique: true,
    name: 'bus_companies_name_unique'
  });

  // Add index on contact_email
  await queryInterface.addIndex('bus_companies', ['contact_email'], {
    name: 'bus_companies_contact_email_idx'
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('bus_companies');
}
