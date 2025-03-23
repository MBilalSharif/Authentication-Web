const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const FormDataModel = require('./models/FormData');
const path = require('path');
require('dotenv').config();  // ✅ Load variables from .env file

const mongoURI = process.env.MONGO_URI;
console.log("MONGO_URI:", mongoURI);  // ✅ Proper logging

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => console.error('❌ MongoDB Atlas connection error:', err));

app.post('/register', (req, res) => {
    const { email, password } = req.body;
    FormDataModel.findOne({ email: email })
        .then(user => {
            if (user) {
                res.json("Already registered");
            } else {
                FormDataModel.create(req.body)
                    .then(log_reg_form => res.json(log_reg_form))
                    .catch(err => res.json(err));
            }
        });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    FormDataModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json("Success");
                } else {
                    res.json("Wrong password");
                }
            } else {
                res.json("No records found!");
            }
        });
});

// Serve frontend build
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// ✅ Use PORT from .env or fallback to 80
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
