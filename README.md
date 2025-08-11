# Auro REST API Backend

![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)
![Express](https://img.shields.io/badge/Express-4.18.2-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

Hey there! 👋 This is the backend API that powers the **Auro** personal productivity application. If you're working on the Auro project or just curious about how we built the server-side magic, you're in the right place!

Auro is all about helping people organize their lives, track their habits, and achieve their goals. This REST API handles everything from user authentication to storing journal entries, managing tasks, and tracking personal progress. Think of it as the brain behind the Auro app that keeps all your productivity data safe and accessible.

## ✨ What Makes Auro Special

The Auro project was born from a simple idea: what if managing your life could actually be enjoyable? We wanted to create something that goes beyond basic to-do lists and calendar apps. Here's what our API enables in the Auro app:

- **Smart Authentication** - Secure user accounts with JWT tokens (because nobody wants their personal data floating around)
- **Task Management That Actually Works** - Create tasks with priorities, due dates, and track your progress without the overwhelm
- **Habit Building & Breaking** - Monitor both the good habits you want to build and the bad ones you want to kick
- **Digital Journaling** - Write about your day and track your moods (it's like having a conversation with yourself)
- **Flexible Note-Taking** - Jot down thoughts, link related notes, and attach files when you need them
- **Goal Planning** - Set big plans, break them into milestones, and actually achieve them
- **Personal Memory Bank** - Store important info and preferences that make your Auro experience uniquely yours
- **Progress Tracking** - See how you're doing over time (spoiler: you're probably doing better than you think!)
- **Full Customization** - Make Auro look and feel exactly how you want it
- **Developer-Friendly Docs** - Interactive API documentation because we know you want to tinker

## 🏗️ How We Organized Everything

Building the Auro backend, we wanted to keep things clean and maintainable. Here's how we structured the codebase so you can jump in and understand what's happening:

```
├── server.js              # The heart of it all - starts everything up
├── package.json            # All our dependencies and scripts
├── swagger.js             # API documentation configuration
├── controllers/           # The business logic (where the magic happens)
│   ├── authController.js      # User registration and login
│   ├── habitController.js     # Good and bad habit management
│   ├── journalController.js   # Personal journal entries
│   ├── memoryController.js    # Key-value storage for user data
│   ├── milestoneController.js # Progress milestones
│   ├── noteController.js      # Note-taking functionality
│   ├── planController.js      # Goal planning and management
│   ├── taskController.js      # Task creation and tracking
│   ├── trackerController.js   # Daily activity tracking
│   └── userController.js      # User profiles and settings
├── middleware/            # Express middleware (the gatekeepers)
│   └── authMiddleware.js      # JWT token validation
├── models/               # MongoDB schemas (our data structure)
│   ├── Journal.js            # Journal entry data model
│   ├── Memory.js             # Memory storage model
│   ├── Milestone.js          # Milestone tracking model
│   ├── Note.js               # Note data model
│   ├── Plan.js               # Plan structure model
│   ├── Task.js               # Task management model
│   ├── Tracker.js            # Activity tracking model
│   └── User.js               # User account model
├── routes/               # API endpoints (the front door)
│   ├── auth.js               # Authentication routes
│   ├── habits.js             # Habit tracking routes
│   ├── journal.js            # Journal entry routes
│   ├── memory.js             # Memory storage routes
│   ├── milestones.js         # Milestone routes
│   ├── notes.js              # Note management routes
│   ├── plan.js               # Plan creation routes
│   ├── tasks.js              # Task management routes
│   ├── tracker.js            # Activity tracking routes
│   └── user.js               # User profile routes
└── utils/
    └── db.js                 # Database connection helper
```

## 🚀 Getting Started with the Auro Backend

Ready to run the Auro API on your machine? Let's get you set up! Don't worry, it's easier than you might think.

### What You'll Need First

- **Node.js** (version 18 or newer) - This is what runs our JavaScript on the server
- **MongoDB** - Either install it locally or grab a free account on MongoDB Atlas
- **npm or yarn** - For managing our dependencies (npm comes with Node.js)

### Setting Everything Up

**1. Get the Code**
   ```bash
   git clone https://github.com/YoussefReaper/Auro_REST_Database.git
   cd "REST Database"
   ```

**2. Install the Dependencies**
   ```bash
   npm install
   ```
   This grabs all the packages we need to make Auro work.

**3. Set Up Your Environment**
   
   Create a `.env` file in the root folder and add these variables:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string_here
   KEY=your_super_secret_jwt_key_here
   ```
   
   **Pro tip**: Make your JWT key something long and random. Your users' security depends on it!

**4. Fire It Up**
   ```bash
   # For development (auto-restarts when you make changes)
   npm run dev
   
   # For production
   npm start
   ```

**5. Check If Everything's Working**
   - **Main API**: `http://localhost:3000/api`
   - **Interactive Docs**: `http://localhost:3000/api-docs` (this is pretty cool, check it out!)
   - **Health Check**: `http://localhost:3000/health` (just to make sure the server is alive)

## 📚 Working with the Auro API

If you're building a frontend for Auro or just want to understand how our API works, here's the roadmap to all our endpoints:

### Getting Users Authenticated

| What You Want To Do | Method | Endpoint | What Happens |
|---------------------|--------|----------|--------------|
| Create a new Auro account | POST | `/api/auth/register` | Signs up a new user |
| Log into Auro | POST | `/api/auth/login` | Returns a JWT token for API access |

### The Core Auro Experience

| Feature | Methods | Endpoint | What It Does |
|---------|---------|----------|--------------|
| **Tasks** | GET, POST | `/api/tasks` | List all tasks or create new ones |
| | PUT, DELETE | `/api/tasks/:id` | Update or remove a specific task |
| **Habits** | GET, POST, DELETE | `/api/habits` | Manage those good and bad habits |
| **Journal** | GET, POST | `/api/journals` | Read or write journal entries |
| | GET, PUT, DELETE | `/api/journals/:id` | Work with specific journal entries |
| **Notes** | GET, POST | `/api/notes` | Quick note-taking and retrieval |
| | GET, PUT, DELETE | `/api/notes/:id` | Manage individual notes |
| **Plans** | GET, POST | `/api/plans` | Create and view your big goals |
| | GET, PUT, DELETE | `/api/plans/:id` | Update your plans as life changes |
| **Milestones** | GET, POST | `/api/milestones` | Track progress on your plans |
| | PUT, DELETE | `/api/milestones/:id` | Adjust milestones as needed |
| **Memory** | GET, POST | `/api/memory` | Store key-value data for the app |
| | DELETE | `/api/memory/:key` | Remove stored memories |
| **Tracker** | GET, POST | `/api/tracker` | Log and view daily activities |
| **User Profile** | GET | `/api/user/profile` | Get user information |
| | PATCH | `/api/user/customization` | Update theme and preferences |

### About Authentication

Most endpoints need you to be logged in. After you get your JWT token from login, include it like this:

```bash
Authorization: Bearer your_actual_jwt_token_here
```

Don't worry if this seems complicated - our interactive docs at `/api-docs` make it super easy to test!

## 💾 How We Store Your Data

We designed our database with MongoDB to keep your Auro data organized and accessible. Here's how we structure everything:

### User Accounts
Each Auro user gets their own secure profile with:
- Username and encrypted password (we use bcrypt - your password is safe!)
- Lists of good and bad habits you're tracking
- Chat history with any AI features we add
- Achievement badges you've earned
- Your personal theme and app preferences
- Links to all your tasks, memories, and tracking data

### Tasks That Actually Get Done
We built our task system to be flexible but not overwhelming:
- Basic info: title, description, and due dates
- Priority levels (low, medium, high) so you know what matters most
- Progress tracking to see how far you've come
- Categories for organization
- Support for recurring tasks (because some things just need to happen regularly)
- File attachments when you need to reference something

### Personal Journaling
Your journal entries are private and secure:
- Title and content for your thoughts
- Mood tracking with six different emotions (happy, sad, angry, neutral, excited, stressed)
- Timestamps so you can look back and see your journey

### Smart Note-Taking
Notes in Auro are more than just text:
- Title and rich content
- Tags for easy searching and organization
- Image attachments for visual notes
- Ability to link related notes together
- Full timestamps for when inspiration strikes

### Goal Planning Made Real
Our planning system helps you actually achieve your goals:
- Plan name, description, and realistic deadlines
- Connection to specific milestones that break down big goals
- Reference storage for books, links, and resources that inspire you
- File attachments for important documents

### Milestone Tracking
Because big goals need smaller steps:
- Milestone name and detailed description
- Progress percentage so you can see advancement
- Connection to specific tasks that move you forward
- Deadline tracking to keep you accountable
- Notes and attachments for important milestone details

## 🛠️ Development Notes

If you're contributing to the Auro project or setting up your own development environment:

### Commands You'll Use

```bash
# Start the server with auto-restart (great for development)
npm run dev

# Start the production server
npm start

# Install new dependencies
npm install
```

### The Tech Stack We Chose

We picked these technologies specifically for the Auro project:

**Core Backend:**
- `express` - Our web framework (reliable and well-documented)
- `mongoose` - Makes working with MongoDB much nicer
- `bcrypt` - Keeps user passwords secure with proper hashing
- `jsonwebtoken` - Handles user authentication tokens
- `cors` - Lets our frontend talk to our backend from different domains
- `dotenv` - Keeps our secret keys and config safe
- `moment` - Because working with dates in JavaScript can be painful

**API Documentation:**
- `swagger-jsdoc` - Generates our API docs from code comments
- `swagger-ui-express` - Provides that nice interactive documentation interface

**Development Tools:**
- `nodemon` - Automatically restarts the server when you make changes (lifesaver!)

## 🔒 Security in the Auro API

We take security seriously in the Auro project. Here's how we protect user data:

- **Password Protection**: We use bcrypt to hash passwords - even we can't see your actual password
- **JWT Tokens**: Stateless authentication that expires automatically (no permanent sessions sitting around)
- **CORS Configuration**: Controlled access so only authorized domains can use our API
- **Input Validation**: MongoDB schemas validate all data before it hits our database
- **Environment Variables**: All sensitive config (database URLs, secret keys) stay out of our code

## 📖 Try It Out

Want to see the API in action? Here are some examples you can run:

### Create Your Auro Account
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "your_username", "password": "your_secure_password"}'
```

### Log In and Get Your Token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "your_username", "password": "your_secure_password"}'
```

### Add Your First Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title": "Try out the Auro API", "description": "Test the task creation", "priority": "high"}'
```

### Write Your First Journal Entry
```bash
curl -X POST http://localhost:3000/api/journals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title": "Testing Auro", "content": "Just set up the API and it works great!", "mood": "excited"}'
```

## 🌐 Interactive Documentation

This is the coolest part - visit `http://localhost:3000/api-docs` when your server is running. You'll get:

- Every single endpoint documented with examples
- Request and response formats clearly shown
- A built-in testing interface (no need for external tools!)
- Authentication examples that actually work

Seriously, spend some time here. It's like having a playground for the entire Auro API.

## 🤝 Want to Contribute to Auro?

We'd love your help making Auro even better! Whether you're fixing bugs, adding features, or improving documentation:

1. **Fork the repository** (grab your own copy)
2. **Create a feature branch** (`git checkout -b feature/awesome-improvement`)
3. **Make your changes** (and test them!)
4. **Commit with a clear message** (`git commit -m 'Add this awesome feature'`)
5. **Push to your branch** (`git push origin feature/awesome-improvement`)
6. **Open a Pull Request** (tell us what you built!)

## 📝 License

This project is open source under the MIT License - check out the [LICENSE](LICENSE) file for the details.

## 🔗 Important Links

- **Main Repository**: [https://github.com/YoussefReaper/Auro_REST_Database](https://github.com/YoussefReaper/Auro_REST_Database)
- **Live API Docs**: Available at `/api-docs` when you're running the server
- **Report Issues**: [GitHub Issues](https://github.com/YoussefReaper/Auro_REST_Database/issues)
- **Current Branch**: Hello (where all the latest development happens)

## 📧 Need Help?

Got stuck? Found a bug? Have ideas for making Auro better? 

Feel free to open an issue on GitHub or reach out to the team. We're pretty responsive and love hearing from people using Auro!

---

**Built with ❤️ for the Auro productivity project**  
*Node.js + Express + MongoDB = A powerful foundation for personal productivity*