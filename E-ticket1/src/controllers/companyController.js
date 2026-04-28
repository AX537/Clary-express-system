import { BusCompany } from '../models/index.js';
import { asyncHandler, createError } from '../middleware/errorMiddleware.js';

/**
 * Create a new bus company
 * POST /admin/companies
 */
export const createCompany = asyncHandler(async (req, res) => {
  const { name, contactEmail, contactPhone } = req.body;
  
  // Check if company with same name already exists
  const existingCompany = await BusCompany.findOne({ where: { name } });
  
  if (existingCompany) {
    throw createError.conflict('Company with this name already exists');
  }
  
  const company = await BusCompany.create({
    name,
    contactEmail,
    contactPhone
  });
  
  res.status(201).json({
    status: 201,
    message: 'Company created successfully',
    data: { company }
  });
});

/**
 * Get all bus companies
 * GET /admin/companies
 */
export const getAllCompanies = asyncHandler(async (req, res) => {
  const companies = await BusCompany.findAll({
    attributes: ['id', 'name', 'contactEmail', 'contactPhone', 'createdAt', 'updatedAt'],
    order: [['name', 'ASC']]
  });
  
  res.status(200).json({
    status: 200,
    message: 'Companies retrieved successfully',
    data: { companies }
  });
});

/**
 * Update bus company
 * PUT /admin/companies/:id
 */
export const updateCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, contactEmail, contactPhone } = req.body;
  
  const company = await BusCompany.findByPk(id);
  
  if (!company) {
    throw createError.notFound('Company not found');
  }
  
  // Check if name is being changed and if it's already taken
  if (name && name !== company.name) {
    const existingCompany = await BusCompany.findOne({ where: { name } });
    if (existingCompany) {
      throw createError.conflict('Company name is already taken');
    }
  }
  
  // Update company fields
  if (name) company.name = name;
  if (contactEmail) company.contactEmail = contactEmail;
  if (contactPhone) company.contactPhone = contactPhone;
  
  await company.save();
  
  res.status(200).json({
    status: 200,
    message: 'Company updated successfully',
    data: { company }
  });
});

/**
 * Soft delete bus company
 * DELETE /admin/companies/:id
 */
export const deleteCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const company = await BusCompany.findByPk(id);
  
  if (!company) {
    throw createError.notFound('Company not found');
  }
  
  // Soft delete (sets deletedAt timestamp)
  await company.destroy();
  
  res.status(200).json({
    status: 200,
    message: 'Company deleted successfully'
  });
});
