# JuiceBox

Refactoring the Juicebox assignment to use Prisma.


server/
├── api/
│   ├── auth/
│   │   └── authRouter.js  // Authentication endpoints
│   ├── posts/
│   │   └── postsRouter.js // Post-related endpoints
│   ├── utils/
│   │   └── middleware.js  // Middleware functions
│   ├── tags/
│   │   └── tagsRouter.js  // Tag-related endpoints
│   └── apiRouter.js        // Main API router
├── db/
│   ├── index.js            // Prisma Client initialization and exports
│   ├── seed.js             // Database seeding script
│   ├── userMethods.js      // User-related database methods
│   ├── postMethods.js      // Post-related database methods
│   └── tagMethods.js       // Tag-related database methods
└── server.js  