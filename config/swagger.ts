import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Backend API',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:3000' }],
    tags: [
      { name: 'user' },
      { name: 'post' },
      { name: 'ai' },
      { name: 'comment' },
      { name: 'like' },
      { name: 'project' },
      { name: 'follow' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        UserRegisterRequest: {
          type: 'object',
          required: ['name', 'surname', 'username', 'profession', 'email', 'password'],
          properties: {
            name: { type: 'string' },
            surname: { type: 'string' },
            username: { type: 'string' },
            profession: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password' },
          },
        },
        UserLoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password' },
          },
        },
        UserLoginResponse: {
          type: 'object',
          required: ['token', 'user'],
          properties: {
            token: { type: 'string' },
            user: {
              type: 'object',
              required: ['id', 'email', 'username', 'role'],
              properties: {
                id: { type: 'number' },
                email: { type: 'string', format: 'email' },
                username: { type: 'string' },
                role: { type: 'string' },
              },
            },
          },
        },
        UserUpdateProfileRequest: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            surname: { type: 'string' },
            username: { type: 'string' },
            profession: { type: 'string' },
          },
        },
        UserPublicResponse: {
          type: 'object',
          required: ['id', 'email', 'username', 'name', 'surname', 'profession', 'role'],
          properties: {
            id: { type: 'number' },
            email: { type: 'string', format: 'email' },
            username: { type: 'string' },
            name: { type: 'string' },
            surname: { type: 'string' },
            profession: { type: 'string' },
            avatar_url: { type: 'string', nullable: true },
            header_url: { type: 'string', nullable: true },
            role: { type: 'string' },
          },
        },
        PostCreateRequest: {
          type: 'object',
          required: ['content'],
          properties: {
            content: { type: 'string' },
          },
        },
        PostUpdateRequest: {
          type: 'object',
          required: ['content'],
          properties: {
            content: { type: 'string' },
          },
        },
        PostImproveRequest: {
          type: 'object',
          required: ['content'],
          properties: {
            content: { type: 'string' },
          },
        },
        PostImproveResponse: {
          type: 'object',
          required: ['content'],
          properties: {
            content: { type: 'string' },
          },
        },
        PostRewriteToneRequest: {
          type: 'object',
          required: ['content', 'tone'],
          properties: {
            content: { type: 'string' },
            tone: {
              type: 'string',
              enum: ['formal', 'friendly', 'short'],
            },
          },
        },
        PostRewriteToneResponse: {
          type: 'object',
          required: ['content'],
          properties: {
            content: { type: 'string' },
          },
        },
        PostSummaryResponse: {
          type: 'object',
          required: ['summary'],
          properties: {
            summary: { type: 'string' },
          },
        },
        AiAskRequest: {
          type: 'object',
          required: ['question'],
          properties: {
            question: { type: 'string' },
          },
        },
        AiAskResponse: {
          type: 'object',
          required: ['answer'],
          properties: {
            answer: { type: 'string' },
          },
        },
        CommentCreateRequest: {
          type: 'object',
          required: ['post_id', 'content'],
          properties: {
            post_id: { type: 'number' },
            content: { type: 'string' },
          },
        },
        CommentUpdateRequest: {
          type: 'object',
          required: ['content'],
          properties: {
            content: { type: 'string' },
          },
        },
        ProjectCreateRequest: {
          type: 'object',
          required: ['title', 'description', 'url'],
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            url: { type: 'string' },
          },
        },
        ProjectUpdateRequest: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            url: { type: 'string' },
          },
        },
      },
    },
  },
  apis: ['modules/**/routes/*.routes.ts', 'dist/modules/**/routes/*.routes.js'],
});
