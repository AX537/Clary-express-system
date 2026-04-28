import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swagger.js';

const router = express.Router();

/**
 * @route   GET /api-docs
 * @desc    Serve Swagger UI documentation
 * @access  Public
 */
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'E-Ticketing API Documentation',
  customfavIcon: '/favicon.ico'
}));

/**
 * @route   GET /api-docs/swagger.json
 * @desc    Get Swagger specification as JSON
 * @access  Public
 */
router.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

export default router;
