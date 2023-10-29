const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');

const app = express();
const PORT = 9901;
const DB_URL = 'mongodb://127.0.0.1:27017/local?directConnection=true&serverSelectionTimeoutMS=2000&appName=ExpresstoMongo';

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let db;

MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
        console.log('Connected to MongoDB');
        db = client.db('local');
        insertDefaultUsers();
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

function insertDefaultUsers() {
    const defaultUsers = [
        { userid: '101', password: 'JohnDoe123', emailid: 'johndoe@gmail.com' },
        { userid: '102', password: 'AliceSmith456', emailid: 'alice.smith@yahoo.com' },
        { userid: '103', password: 'BobJohnson789', emailid: 'bob.johnson@gmail.com' },
        { userid: '104', password: 'EmmaWhite321', emailid: 'emma.white@yahoo.com' },
        { userid: '105', password: 'MichaelBrown654', emailid: 'michael.brown@gmail.com' },
        { userid: '106', password: 'OliviaMiller987', emailid: 'olivia.miller@yahoo.com' },
        { userid: '107', password: 'DavidWilson234', emailid: 'david.wilson@gmail.com' },
        { userid: '108', password: 'SophiaJones567', emailid: 'sophia.jones@yahoo.com' }
    ];

    db.collection('users').createIndex({ userid: 1 }, { unique: true }) // Create unique index on userid field
        .then(() => {
            console.log('Unique index created on userid field.');
            return db.collection('users').insertMany(defaultUsers); // Insert default users after creating the unique index
        })
        .then(() => {
            console.log('Default users inserted successfully.');
        })
        .catch((err) => {
            console.error('Error inserting default users:', err);
        });
}

app.get('/getAll', async (request, response) => {
    try {
        const results = await db.collection('users').find().toArray();
        response.send(results);
    } catch (error) {
        console.error('Error fetching users:', error);
        response.status(500).send('Internal Server Error');
    }
});

app.get('/getById', async (request, response) => {
    const userId = request.query.uid;
    try {
        const result = await db.collection('users').findOne({ userid: userId });
        response.send(result);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        response.status(500).send('Internal Server Error');
    }
});

app.post('/insert', async (request, response) => {
    const newUser = {
        userid: request.body.userid,
        password: request.body.password,
        emailid: request.body.emailid
    };

    try {
        await db.collection('users').insertOne(newUser);
        response.send('<b>Insert Successful...</b>');
    } catch (error) {
        console.error('Error inserting user:', error);
        response.status(500).send('Internal Server Error');
    }
});

app.put('/update', async (request, response) => {
    const userId = request.body.userid;
    const updatedUser = {
        userid: userId,
        password: request.body.password,
        emailid: request.body.emailid
    };

    try {
        await db.collection('users').updateOne({ userid: userId }, { $set: updatedUser });
        response.send('<b>Update Successful...</b>');
    } catch (error) {
        console.error('Error updating user:', error);
        response.status(500).send('Internal Server Error');
    }
});

app.post('/delete', async (request, response) => {
    const userId = request.body.userid;
    try {
        await db.collection('users').deleteOne({ userid: userId });
        response.send('<b>Delete Successful...</b>');
    } catch (error) {
        console.error('Error deleting user:', error);
        response.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
