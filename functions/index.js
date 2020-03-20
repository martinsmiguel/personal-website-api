const functions = require('firebase-functions');
const admin = require("firebase-admin");
const app = require("express");

admin.initializeApp();
//const db = admin.firestore().collection("todos");

//code

exports.api = functions.https.onRequest(app);