import express from 'express';
import { createCompany, getAllCompanies, updateCompany, deleteCompany } from '../controllers/companyController.js';
import { createCompanyValidation, updateCompanyValidation, companyIdValidation } from '../validators/companyValidators.js';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All company management routes require authentication and admin role
router.use(authenticate, requireAdmin);

router.post('/', createCompanyValidation, handleValidationErrors, createCompany);
router.get('/', getAllCompanies);
router.put('/:id', updateCompanyValidation, handleValidationErrors, updateCompany);
router.delete('/:id', companyIdValidation, handleValidationErrors, deleteCompany);

export default router;
