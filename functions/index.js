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


exports.api = functions.https.onRequest(api);

//== == == == == == == == == == == == == == ==
//Define 

//Define Collection profiles
const profilesCollection = 'profiles';

//Define Collection projects
const projectsCollection = 'projects';

//Define class Profile
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

//Define class Project
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
}

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
})

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
})

//== == == == == == == == == == == == == == == 
//View

// View all profiles
app.get('/profiles', (req, res) => {
    firebaseHelper.firestore
        .backup(db, profilesCollection)
        .then(data => res.status(200).send(data))
        .catch(error => res.status(400).send(`Cannot get profiles: ${error}`));
})

// View a profile
app.get('/profiles/:profileId', (req, res) => {
    firebaseHelper.firestore
        .getDocument(db, profilesCollection, req.params.profileId)
        .then(doc => res.status(200).send(doc))
        .catch(error => res.status(400).send(`Cannot get profile: ${error}`));
})


// View all projects
app.get('/projects', (req, res) => {
    firebaseHelper.firestore
        .backup(db, projectsCollection)
        .then(data => res.status(200).send(data))
        .catch(error => res.status(400).send(`Cannot get projects: ${error}`));
})

// View a project
app.get('/projects/:projectId', (req, res) => {
    firebaseHelper.firestore
        .getDocument(db, projectsCollection, req.params.projectId)
        .then(doc => res.status(200).send(doc))
        .catch(error => res.status(400).send(`Cannot get profile: ${error}`));
})