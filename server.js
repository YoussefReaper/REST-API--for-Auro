require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db');
const session = require("express-session");
const passport = require("passport");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Auro API",
            version: "1.0.0",
            description: "API documentation for the Auro project"
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    servers: [
        {
            url: "http://localhost:3000/api",
            description: "Development server"
        }
    ],
    apis: ["./routes/*.js"]
};
const specs = swaggerJsdoc(options);

const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());
app.use(cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
}));
app.use(session({
    secret: process.env.SESSION_SECRET || "aurocore-secret",
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';

if (!MONGO_URI) {
    console.error('Missing MONGO_URI in .env');
    process.exit(1);
}

connectDB(MONGO_URI);


app.use('/auth', require('./routes/auth'));

app.use('/journals', require('./routes/journal'));
app.use('/plans', require('./routes/plan'));
app.use('/user', require('./routes/user'));
app.use('/habits', require('./routes/habits'));
app.use('/tasks', require('./routes/tasks'));
app.use('/tracker', require('./routes/tracker'));
app.use('/memory', require('./routes/memory'));
app.use('/milestones', require('./routes/milestones'));
app.use('/notes', require('./routes/notes'));

app.get('/health', (req, res) => res.json({ status: 'ok', time: Date.now()}));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});