require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db');
//const {swaggerUi, specs} = require('./swagger');

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
app.use(express.json());
app.use(cors());

// Serve static files from public directory
app.use(express.static('public'));

// Serve the index.html at root
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';

if (!MONGO_URI) {
    console.error('Missing MONGO_URI in .env');
    process.exit(1);
}

connectDB(MONGO_URI);

// Database initialization endpoints
app.get('/api/init/status', async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const connected = mongoose.connection.readyState === 1;
        res.json({ 
            connected, 
            status: connected ? 'Connected' : 'Disconnected',
            database: mongoose.connection.db ? mongoose.connection.db.databaseName : 'Unknown'
        });
    } catch (error) {
        res.status(500).json({ connected: false, error: error.message });
    }
});

app.post('/api/init/database', async (req, res) => {
    try {
        const mongoose = require('mongoose');
        const User = require('./models/User');
        const Task = require('./models/Task');
        const Journal = require('./models/Journal');
        const Note = require('./models/Note');
        const Plan = require('./models/Plan');
        const Milestone = require('./models/Milestone');
        const Memory = require('./models/Memory');
        const Tracker = require('./models/Tracker');

        // Check if collections exist (this will create them if they don't)
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);

        res.json({ 
            success: true, 
            message: 'Database collections initialized',
            collections: collectionNames
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/init/sample-data', async (req, res) => {
    try {
        const bcrypt = require('bcrypt');
        const User = require('./models/User');
        const Task = require('./models/Task');
        const Journal = require('./models/Journal');

        // Check if sample user already exists
        const existingUser = await User.findOne({ username: 'demo_user' });
        if (existingUser) {
            return res.json({ success: true, message: 'Sample data already exists' });
        }

        // Create sample user
        const hashedPassword = await bcrypt.hash('demo123', 10);
        const sampleUser = new User({
            username: 'demo_user',
            password: hashedPassword,
            goodHabits: ['Exercise', 'Read books', 'Drink water'],
            badHabits: ['Procrastination', 'Too much social media'],
            customization: {
                colorPreset: 'default',
                background: 'default.jpg',
                preferences: {
                    notifications: true,
                    sound: true,
                    language: 'en'
                }
            }
        });
        await sampleUser.save();

        // Create sample tasks
        const sampleTasks = [
            {
                userId: sampleUser._id,
                title: 'Welcome to Auro!',
                description: 'Explore the Auro API and start your productivity journey',
                priority: 'high',
                category: 'Getting Started',
                completed: false
            },
            {
                userId: sampleUser._id,
                title: 'Create your first journal entry',
                description: 'Document your thoughts and mood for today',
                priority: 'medium',
                category: 'Personal',
                completed: false
            }
        ];

        for (const taskData of sampleTasks) {
            const task = new Task(taskData);
            await task.save();
            sampleUser.tasks.push(task._id);
        }

        // Create sample journal entry
        const sampleJournal = new Journal({
            userId: sampleUser._id,
            title: 'My First Day with Auro',
            content: 'Today I started using the Auro productivity system. I\'m excited to see how it helps me organize my life and achieve my goals!',
            mood: 'excited'
        });
        await sampleJournal.save();

        await sampleUser.save();

        res.json({ 
            success: true, 
            message: 'Sample data created successfully',
            sampleUser: {
                username: 'demo_user',
                password: 'demo123',
                tasksCreated: sampleTasks.length,
                journalEntries: 1
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/api/init/verify', async (req, res) => {
    try {
        const User = require('./models/User');
        const Task = require('./models/Task');
        const Journal = require('./models/Journal');

        const userCount = await User.countDocuments();
        const taskCount = await Task.countDocuments();
        const journalCount = await Journal.countDocuments();

        res.json({
            success: true,
            verification: {
                users: userCount,
                tasks: taskCount,
                journals: journalCount,
                status: userCount > 0 ? 'Database ready' : 'No users found'
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.post('/api/init/reset', async (req, res) => {
    try {
        const mongoose = require('mongoose');
        
        // Drop all collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        for (const collection of collections) {
            await mongoose.connection.db.dropCollection(collection.name);
        }

        res.json({ 
            success: true, 
            message: 'Database reset successfully',
            collectionsDropped: collections.map(c => c.name)
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.use('/api/auth', require('./routes/auth'));

app.use('/api/journals', require('./routes/journal'));
app.use('/api/plans', require('./routes/plan'));
app.use('/api/user', require('./routes/user'));
app.use('/api/habits', require('./routes/habits'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/tracker', require('./routes/tracker'));
app.use('/api/memory', require('./routes/memory'));
app.use('/api/milestones', require('./routes/milestones'));
app.use('/api/notes', require('./routes/notes'));

// Health check endpoint
app.get('/health', (req, res) => res.json({ 
    status: 'ok', 
    time: Date.now(),
    uptime: process.uptime(),
    version: '1.0.0',
    service: 'Auro API'
}));

// API info endpoint
app.get('/api', (req, res) => res.json({
    message: 'Welcome to Auro API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
        auth: '/api/auth',
        tasks: '/api/tasks',
        habits: '/api/habits',
        journals: '/api/journals',
        notes: '/api/notes',
        plans: '/api/plans',
        milestones: '/api/milestones',
        tracker: '/api/tracker',
        memory: '/api/memory',
        user: '/api/user'
    }
}));

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({
        error: 'API endpoint not found',
        message: `The endpoint ${req.originalUrl} does not exist`,
        availableEndpoints: '/api'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`Server Dashboard: http://localhost:${PORT}/`);
});