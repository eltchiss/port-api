const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

module.exports = (app) => {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API Port de Plaisance',
        version: '1.0.0',
        description: 'Documentation  de l’API du port de plaisance'
      },
      servers: [
        { url: 'http://localhost:3003' }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          }
        }
      },
      security: [{ bearerAuth: [] }]
    },
    apis: ['./routes/*.js'], // <-- Scanne toutes tes routes
  };

  const swaggerSpec = swaggerJSDoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
