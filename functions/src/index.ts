import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
//import * as request from 'request';

export const pubreport = functions.firestore.document('pubreports/{locationID}/reportlist/{reportid}').onCreate((snapshot,context) => {
// Grab the current value of what was written to the Realtime Database.
  const locid = context.params.locationID;
  const docref = admin.firestore().collection('public').doc(locid);
  docref.update({ rb: admin.firestore.FieldValue.increment(1) }).then(()=> {console.log('done')}).catch(error => console.log(error))

});

export const privreport = functions.firestore.document('privreports/{locationID}/reportlist/{reportid}').onCreate((snapshot,context) => {
// Grab the current value of what was written to the Realtime Database.
  const locid = context.params.locationID;
  const docref = admin.firestore().collection('private').doc(locid);
  docref.update({ rb: admin.firestore.FieldValue.increment(1) }).then(()=> {console.log('done')}).catch(error => console.log(error))

});

export const pubreportdelete = functions.firestore.document('pubreports/{locationID}/reportlist/{reportid}').onDelete((snapshot,context) => {
// Grab the current value of what was written to the Realtime Database.
  const locid = context.params.locationID;
  const docref = admin.firestore().collection('public').doc(locid);
  docref.update({ rb: admin.firestore.FieldValue.increment(-1) }).then(()=> {console.log('done')}).catch(error => console.log(error))

});

export const privreportdelete = functions.firestore.document('privreports/{locationID}/reportlist/{reportid}').onDelete((snapshot,context) => {
// Grab the current value of what was written to the Realtime Database.
  const locid = context.params.locationID;
  const docref = admin.firestore().collection('private').doc(locid);
  docref.update({ rb: admin.firestore.FieldValue.increment(-1) }).then(()=> {console.log('done')}).catch(error => console.log(error))

});


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
          type: 'public',
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
            type: 'private',
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

export const callme = functions.pubsub
  .topic('getalldata')
  .onPublish(async message => {
      let count = 0;
      admin.firestore().collection("public").stream().on('data', (documentSnapshot) => {
        let domainnames = documentSnapshot.get('url');
        //let id = documentSnapshot.id;
        console.log(domainnames)
        /*const d = (JSON.stringify(domainnames))
        request.post(
            'http://35.194.195.18:80/?url='+d,
            { json: { urls: 'value' } },
            function (error, response, body) {
                console.log(response);
                if (!error && response.statusCode == 200) {
                    if(body.free == 0 ){
                      console.log(id);
                      console.log(body);
                      admin.firestore().collection("public").doc(id).update({
                        ps: 0,
                        flagged : true
                      }).then( resp => { console.log("done")}).catch(err => {console.log("err")})
                    }else{
                      admin.firestore().collection("public").doc(id).update({
                        ps: body.free
                      }).then( resp => { console.log("done")}).catch(err => {console.log("err")})
                    }

                }
                else if(error){
                  admin.firestore().collection("public").doc(id).update({
                    flagged : true
                  }).then( resp => { console.log("done")}).catch(err => {console.log("err")})
                }else if(response.statusCode == 500 ){
                  admin.firestore().collection("public").doc(id).update({
                    ps: 0,
                    flagged : true
                  }).then( resp => { console.log("done")}).catch(err => {console.log("err")})
                }
            }
        );*/
      }).on('end', () => {
        console.log(count);
      });
  });
