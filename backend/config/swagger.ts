import { SwaggerConfig } from '@ioc:Adonis/Addons/Swagger'

export default {
	uiEnabled: true,
	uiUrl: 'docs',
	specEnabled: true,
	specUrl: '/swagger.json',

	middleware: [],

	options: {
		definition: {
			openapi: '3.0.0',
			info: {
				title: 'CampusEvent API',
				version: '1.0.0',
				description: 'API untuk mengelola event kampus dengan integrasi weather dan geocoding',
				contact: {
					name: 'API Support',
					email: 'support@campusevent.com'
				}
			},
			servers: [
				{
					url: 'http://localhost:3333',
					description: 'Development server'
				}
			],
			components: {
				securitySchemes: {
					bearerAuth: {
						type: 'http',
						scheme: 'bearer',
						bearerFormat: 'JWT',
						description: 'JWT Authorization header menggunakan Bearer scheme. Contoh: "Bearer {token}"'
					},
					apiKey: {
						type: 'apiKey',
						in: 'header',
						name: 'x-api-key',
						description: 'API Key untuk operasi tertentu (contoh: delete event)'
					}
				},
				schemas: {
					User: {
						type: 'object',
						properties: {
							id: { type: 'string', example: '507f1f77bcf86cd799439011' },
							name: { type: 'string', example: 'John Doe' },
							email: { type: 'string', example: 'john@example.com' },
							role: { type: 'string', example: 'user' },
							apiKey: { type: 'string', example: 'abc123def456' }
						}
					},
					Event: {
						type: 'object',
						properties: {
							_id: { type: 'string', example: '507f1f77bcf86cd799439011' },
							title: { type: 'string', example: 'Seminar Teknologi' },
							description: { type: 'string', example: 'Seminar tentang AI dan Machine Learning' },
							date: { type: 'string', format: 'date-time', example: '2025-12-15T10:00:00Z' },
							location: { type: 'string', example: 'Jakarta' },
							latitude: { type: 'number', example: -6.2088 },
							longitude: { type: 'number', example: 106.8456 },
							weatherInfo: { type: 'object', nullable: true },
							createdBy: { type: 'string', example: '507f1f77bcf86cd799439011' },
							createdAt: { type: 'string', format: 'date-time' },
							updatedAt: { type: 'string', format: 'date-time' }
						}
					},
					Error: {
						type: 'object',
						properties: {
							message: { type: 'string', example: 'Error message' },
							error: { type: 'string', example: 'Error details' }
						}
					}
				}
			},
			tags: [
				{
					name: 'Authentication',
					description: 'Endpoints untuk autentikasi (register & login)'
				},
				{
					name: 'Events',
					description: 'CRUD operations untuk event management'
				},
				{
					name: 'Integration',
					description: 'Integrasi dengan external API (Weather)'
				}
			]
		},

		apis: [
			'app/**/*.ts',
			'docs/swagger/**/*.yml',
			'start/routes.ts'
		],
		basePath: '/'
	},
	mode: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'RUNTIME',
  specFilePath: 'docs/swagger.json'
} as SwaggerConfig
