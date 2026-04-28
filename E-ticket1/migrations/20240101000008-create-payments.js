export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('payments', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    booking_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'bookings',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: Sequelize.ENUM('pending', 'completed', 'failed', 'refund_pending'),
      allowNull: false,
      defaultValue: 'pending'
    },
    qr_code_token: {
      type: Sequelize.STRING(255),
      allowNull: true
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

  // Add index on booking_id
  await queryInterface.addIndex('payments', ['booking_id'], {
    name: 'payments_booking_id_idx'
  });

  // Add index on status
  await queryInterface.addIndex('payments', ['status'], {
    name: 'payments_status_idx'
  });

  // Add index on qr_code_token
  await queryInterface.addIndex('payments', ['qr_code_token'], {
    name: 'payments_qr_code_token_idx'
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('payments');
}
