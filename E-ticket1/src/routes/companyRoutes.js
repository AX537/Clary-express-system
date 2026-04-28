import express from 'express';
import { createCompany, getAllCompanies, updateCompany, deleteCompany } from '../controllers/companyController.js';
import { createCompanyValidation, updateCompanyValidation, companyIdValidation } from '../validators/companyValidators.js';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All company management routes require authentication and admin role
router.use(authenticate, requireAdmin);

/**
 * @route   POST /admin/companies
 * @desc    Create a new bus company
 * @access  Admin only
 */
router.post('/', createCompanyValidation, handleValidationErrors, createCompany);

/**
 * @route   GET /admin/companies
 * @desc    Get all bus companies
 * @access  Admin only
 */
router.get('/', getAllCompanies);

/**
 * @route   PUT /admin/companies/:id
 * @desc    Update bus company
 * @access  Admin only
 */
router.put('/:id', updateCompanyValidation, handleValidationErrors, updateCompany);

/**
 * @route   DELETE /admin/companies/:id
 * @desc    Soft delete bus company
 * @access  Admin only
 */
router.delete('/:id', companyIdValidation, handleValidationErrors, deleteCompany);

export default router;
