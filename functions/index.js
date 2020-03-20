const functions = require('firebase-functions');
const admin = require("firebase-admin");
const express = require("express");

const firebaseHelper = require('firebase-functions-helper');
const bodyParser = require('body-parser');

admin.initializeApp();
const db = admin.firestore();


const app = express();
const api = express();

api.use('/home', app);
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));


const profilesCollection = 'profiles';

class Profile {
    constructor(name, birth, email, password, office, description, tags, image, link) {
        this.name = name,
        this.birth = birth,
        this.email = email,
        this.password = password,
        this.office = office,
        this.description = description,
        this.tags = tags,
        this.image = image,
        this.link = link
    }
}

// Add new profile
app.post('/profiles', async (req, res) => {
    try {
        const profile = new Profile();

        profile.name = req.body['name'];
        profile.birth = req.body['birth'];
        profile.email = req.body['email'];
        profile.password = req.body['password'];
        profile.office = req.body['office'];
        profile.description = req.body['description'];
        profile.tags = req.body['tags'];
        profile.image = req.body['image'];
        profile.link = req.body['link'];

        const user = JSON.parse(JSON.stringify(profile));

        const ref = await db.collection('profiles').add(user);

        res.json({
            id: ref.id,
            user
        });
        res.status(201).send(user);

    } catch (error) {
        res.status(400).send(user)
    }        
})

// View all profiles
app.get('/profiles', (req, res) => {
    firebaseHelper.firestore
        .backup(db, profilesCollection)
        .then(data => res.status(200).send(data))
        .catch(error => res.status(400).send(`Cannot get profiles: ${error}`));
})

exports.api = functions.https.onRequest(api);