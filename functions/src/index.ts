import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

export const publicupdate = functions.firestore.document('public/{locationID}').onUpdate((event,context) => {
// Grab the current value of what was written to the Realtime Database.
  const originals = event.after;

  if(originals){
    const original = originals.data();
    if(original){
      console.log(original);
      const topic = 'public';

      const message = {
        data: {
          hash : original.position.geohash,
          lat : original.position.geopoint._latitude.toString(),
          lng : original.position.geopoint._longitude.toString(),
          parkingspots : original.ps.toString()
        },
        topic: topic
      };
      admin.messaging().send(message)
      .then(() => console.log('this will succeed')).catch(err => console.log(err))
    }

  }

});

export const privateupdate = functions.firestore.document('private/{locationID}').onUpdate((event,context) => {
// Grab the current value of what was written to the Realtime Database.
const originals = event.after;

if(originals){
  const original = originals.data();
    if(original){
      console.log(original);
      for(const i of original.dmn ){
        const message = {
          data: {
            hash : original.position.geohash,
            lat : original.position.geopoint._latitude.toString(),
            lng : original.position.geopoint._longitude.toString(),
            parkingspots : original.ps.toString()
          },
          topic: i
        };
        admin.messaging().send(message)
      .then(() => console.log('this will succeed')).catch(err => console.log(err))
      }
    }
  }


});


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
