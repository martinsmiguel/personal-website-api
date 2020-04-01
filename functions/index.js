//Save a private data in .env
//require('dotenv').config();

//API dependencies
const admin = require("firebase-admin");
const functions = require('firebase-functions');
const firebaseHelper = require('firebase-functions-helper');
const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');

// //ServiceAccountKey.json is in .gitignore
// const serviceAccount = require('./ServiceAccountKey.json');
// //Initialize Firebase with ServiceAccount
// admin.initializeApp({
//    credential: admin.credential.cert(serviceAccount),
//    databaseURL: "process.env.databaseURL"
// });

//config.js is in .gitignore
const config = require("./config");
//Initialize Firebase Configs
admin.initializeApp(config);

//Define database
const db = admin.firestore();

//Express for CRUD application
const app = express();
//Express for API
const api = express();

//Define endpoint
api.use('/home', app);
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));
api.use(cors());
app.use(cors());

//Export api with https functions
exports.api = functions.https.onRequest(api);

//== == == == == == == == == == == == == == ==
//Define 

//Define Profiles Collection
const profilesCollection = 'profiles';

//Define Projects Collection
const projectsCollection = 'projects';

//Define Profile class
class Profile {
    constructor(name, birth, email, password, office, description, tags, image, link, bookId, projectId) {
        this.name = name,
        this.birth = birth,
        this.email = email,
        this.password = password,
        this.office = office,
        this.description = description,
        this.tags = tags,
        this.image = image,
        this.link = link,
        this.bookId = bookId,
        this.projectId = projectId
    }
};

//Define Project class 
class Project {
    constructor( type, date, title, description, author, collaborators, tags, image, link, status) {
        this.type = type,
        this.date = date,
        this.title = title,
        this.description = description,
        this.author = author,
        this.collaborators = collaborators,
        this.tags = tags,
        this.image = image,
        this.link = link
        this.status = status
    }
};

//== == == == == == == == == == == == == == ==
//ADD

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
        profile.bookId = req.body['bookId'];
        profile.projectId = req.body['projectId'];

        const user = JSON.parse(JSON.stringify(profile));

        const refProfile = await db.collection('profiles').add(user);

        res.json({
            id: refProfile.id,
            user
        });
        res.status(201).send(user);

    } catch (error) {
        res.status(400).send(user)
    }        
});

// Add new project
app.post('/projects', async (req, res) => {
    try {
        const project = new Project();

        project.type = req.body['type'];
        project.date = req.body['date'];
        project.title = req.body['title'];
        project.description = req.body['description'];
        project.author = req.body['author'];
        project.collaborators = req.body['collaborators'];
        project.tags = req.body['tags'];
        project.image = req.body['image'];
        project.link = req.body['link'];
        project.status = req.body['status'];

        const prjt = JSON.parse(JSON.stringify(project));

        const refProject = await db.collection('projects').add(prjt);
        res.json({
            id: refProject.id,
            prjt
        });
        res.status(201).send(prjt);

    } catch (error) {
        res.status(400).send(prjt)
    }        
});

//== == == == == == == == == == == == == == == 
//Get

// Get all profiles
app.get('/profiles', (req, res) => {
    firebaseHelper.firestore
        .backup(db, profilesCollection)
        .then(data => res.status(200).send(data))
        .catch(error => res.status(400).send(`Cannot get profiles: ${error}`));
});

// Get a profile
app.get('/profiles/:profileId', (req, res) => {
    firebaseHelper.firestore
        .getDocument(db, profilesCollection, req.params.profileId)
        .then(doc => res.status(200).send(doc))
        .catch(error => res.status(400).send(`Cannot get profile: ${error}`));
});


// Get all projects
app.get('/projects', (req, res) => {
    firebaseHelper.firestore
        .backup(db, projectsCollection)
        .then(data => res.status(200).send(data))
        .catch(error => res.status(400).send(`Cannot get projects: ${error}`));
});

// Get a project
app.get('/projects/:projectId', (req, res) => {
    firebaseHelper.firestore
        .getDocument(db, projectsCollection, req.params.projectId)
        .then(doc => res.status(200).send(doc))
        .catch(error => res.status(400).send(`Cannot get profile: ${error}`));
});


//== == == == == == == == == == == == == == ==
//Update

// Update a profile 
app.patch('/profiles/:profileId', async (req, res) => {
    const updatedDoc = await firebaseHelper.firestore
        .updateDocument(db, profilesCollection, req.params.profileId, req.body);
    res.status(204).send(`Update a new profile: ${updatedDoc}`);
});

// Update a project
app.patch('/projects/:projectId', async (req, res) => {
    const updatedDoc = await firebaseHelper.firestore
        .updateDocument(db, projectsCollection, req.params.projectId, req.body);
    res.status(204).send(`Update a new projects: ${updatedDoc}`);
});

//== == == == == == == == == == == == == == ==
//Delete

// Delete a Profile  
app.delete('/profiles/:profileId', async (req, res) => {
    const deletedProfile = await firebaseHelper.firestore
        .deleteDocument(db, profilesCollection, req.params.profileId);
    res.status(204).send(`Profile is deleted: ${deletedProfile}`);
});

// Delete a project 
app.delete('/projects/:projectId', async (req, res) => {
    const deletedProject = await firebaseHelper.firestore
        .deleteDocument(db, projectsCollection, req.params.projectId);
    res.status(204).send(`Project is deleted: ${deletedProject}`);
});

//== == == == == == == == == == == == == == ==
