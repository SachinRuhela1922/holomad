require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5000;
// Configure CORS to allow your frontend
const corsOptions = {
  origin: 'https://holomad-frontend.vercel.app',  // Your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Allowed methods
  credentials: true  // Allow cookies or credentials if needed
};

// Use CORS middleware with the options defined
app.use(cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json());

const uri = process.env.MONGO_URI || "mongodb+srv://pratapruhela1922:qwerty1922roundsround@demotour.6duqb.mongodb.net/DemoTour?retryWrites=true&w=majority";
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Mongoose connection for user authentication
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB for authentication');
}).catch(err => {
    console.error('Error connecting to MongoDB for authentication:', err);
});

// MongoDB client connection
const client = new MongoClient(uri);

// Middleware to verify JWT and retrieve username
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.username = user.username;
        next();
    });
};

// Connection to the 'result' database
let resultConnection;
try {
    resultConnection = mongoose.createConnection(`${uri.split('/')[0]}//${uri.split('/')[2]}/result?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    resultConnection.on('connected', () => {
        console.log('Connected to the "result" database');
    });

    resultConnection.on('error', (err) => {
        console.error('Error connecting to the "result" database:', err);
    });
} catch (err) {
    console.error('Error creating connection to "result" database:', err);
}

// Mongoose schema and model
const appointmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    appointmentDate: { type: Date, required: true },
    docname: { type: String, required: true }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

// API endpoint to handle appointment submissions
app.post('/api/appointments', async (req, res) => {
    try {
        const appointment = new Appointment(req.body);
        await appointment.save();
        res.status(201).json({ message: 'Appointment created successfully', appointment });
    } catch (error) {
        console.error('Error saving appointment:', error);
        res.status(500).json({ message: 'Error creating appointment', error });
    }
});
// Signup route
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const usersDb = client.db('users');
        const usersCollection = usersDb.collection('users');
        const existingUser = await usersCollection.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = { username, password: hashedPassword };
        await usersCollection.insertOne(newUser);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const usersDb = client.db('users');
        const usersCollection = usersDb.collection('users');
        const user = await usersCollection.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
