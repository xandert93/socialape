const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();
const collectionRef = db.collection('screams');

exports.helloWorld = functions.https.onRequest((req, res) => {
  res.send('Hello World!');
});

exports.getScreams = functions.https.onRequest((req, res) => {
  collectionRef
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push(doc.data());
      });
      res.json(screams);
    })
    .catch((err) => console.error(err));
});

exports.createScream = functions.https.onRequest((req, res) => {
  req.method !== 'POST' &&
    res.status(400).json({ errMsg: 'Method not allowed.' });

  let { body, userHandle } = req.body;

  const newScream = {
    body,
    userHandle,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
  };

  collectionRef
    .add(newScream)
    .then((doc) => res.json({ msg: `document ${doc.id} created successfully` }))
    .catch((err) => {
      res.status(500).json({ errMsg: 'something went wrong!' });
      console.error(err);
    });
});
