export async function up(queryInterface, Sequelize) {
  // Add paypack_ref column to store the PayPack transaction reference
  await queryInterface.addColumn('payments', 'paypack_ref', {
    type: Sequelize.STRING(255),
    allowNull: true,
    defaultValue: null,
    after: 'qr_code_token'
  });

  // Add phone_number column to store the mobile money number used for payment
  await queryInterface.addColumn('payments', 'phone_number', {
    type: Sequelize.STRING(20),
    allowNull: true,
    defaultValue: null,
    after: 'paypack_ref'
  });

  // Add index on paypack_ref for fast status lookups
  await queryInterface.addIndex('payments', ['paypack_ref'], {
    name: 'payments_paypack_ref_idx'
  });
}

export async function down(queryInterface, Sequelize) {
  // Remove index first
  await queryInterface.removeIndex('payments', 'payments_paypack_ref_idx');

  // Remove columns
  await queryInterface.removeColumn('payments', 'paypack_ref');
  await queryInterface.removeColumn('payments', 'phone_number');
}
