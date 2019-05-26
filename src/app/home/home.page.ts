import { AfterContentInit, Component, OnInit, ViewChild} from '@angular/core';
declare var google;
import { environment } from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DbService } from '../db.service';
import { AuthServiceService } from '../auth-service.service';
import { LocalstorageService } from '../localstorage.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { AlertController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';
import * as MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';

export interface IGeometry {
    type: string;
    coordinates: number[];
}

export interface IGeoJson {
    type: string;
    geometry: IGeometry;
    properties?: any;
    $key?: string;
}

export class FeatureCollection {
  type = 'FeatureCollection'
  constructor(public features: Array<GeoJson>) {}
}

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  favoriteColor?: string;
  emailVerified?: boolean;
}


export class GeoJson implements IGeoJson {
  type = 'Feature';
  geometry: IGeometry;
  constructor(coordinates, public properties?) {
    this.geometry = {
      type: 'Point',
      coordinates: coordinates
    }
  }
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  map: mapboxgl.Map;
  mapInitialized= false;
  style = 'mapbox://styles/mapbox/outdoors-v9';
  lat = 37.75;
  lng = -122.41;
  message = 'Hello World!';
  centermarker: any;
  user: User = {
    uid : '',
    email : '',
    photoURL : '',
    displayName : '',
    favoriteColor : '',
    emailVerified: false
  };
  // Data sources for Public Locations and Private Locations
  source1: any;
  source2: any;
  gps: any;  // Data Source for GPS
  // Markers for Map
  privmarkers: any;
  pubmarkers: any;
  // User settings
  settings: any;
  mailsplit: any;
  markerlocation: any;
  // Times entered into the Page
  timesentered = 0;
  search: MapboxGeocoder;
  tempbool = true;
  alreadysubed = false;
  direction : MapboxDirections;

  constructor(private network: Network,private alertCtrl: AlertController,
    private locationAccuracy: LocationAccuracy, private auth: AuthServiceService,
    private db: DbService, private geolocation: Geolocation, private storage: LocalstorageService) {

    mapboxgl.accessToken = environment.mapbox.accessToken

  }

  getResults(resp){
    console.log('got result')
    console.log([resp.result.center[1], resp.result.center[0]])
    this.centermarker.setLngLat([resp.result.center[0], resp.result.center[1]])
    var markerval = {target : { _lngLat : { lat : resp.result.center[1] , lng:resp.result.center[0]}}}
    this.markerlocation = markerval;
    this.changetype(markerval);
  }

  ionViewWillEnter() {
    console.log('view will enter');
    if (this.timesentered == 0) {
        this.timesentered = 1
    } else {
      this.map.resize();
      this.storage.provide().then(settings => {
        this.settings = settings;
        this.changetype(this.markerlocation);
      })
    }

  }


  ngOnInit(): void {
    console.log('ng on init')
    this.auth.getuser().subscribe( val => {
      this.user = val;
      this.mailsplit = this.user.email.split('@');
      // When running the first time if network has not been connected do not initialize map
      if(this.network.type != 'none'){
        console.log("network is "+this.network.type);
        this.storage.provide().then(settings => {
          console.log('storage');
          this.settings = settings;
          this.initializeMap(settings,this.mailsplit);
        })
      }
      // If connected to network and map has not been initialized already initialize
      else{
        this.alreadysubed = true;
        this.network.onConnect().subscribe(()=>{
          console.log("got connection "+this.network.type);
          if(this.mapInitialized == false){
            this.storage.provide().then(settings => {
              this.settings = settings;
              this.initializeMap(settings,this.mailsplit);
            })
          }
        });
      }



    });
  }

  report(location, collection , issue) {
    this.db.reportlocation(location, collection ,issue);
  }

  delay(time: number){
    return new Promise( resolve => setTimeout(resolve,time));
  }
  initializeMap(settings, mailsplit) {

    if (false) {
        // Code base for Web App
    } else {
      // Check wether user has gps on
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        console.log(canRequest);
        if ( canRequest ) {
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => {
              // Get Current Location
              console.log('got permission');
              this.geolocation.getCurrentPosition().then((resp) => {
                console.log(resp);
                this.lat = resp.coords.latitude;
                this.lng = resp.coords.longitude;
                // Initialize Markers for public and private locations by gettind data from db
                if(this.network.type != 'none' || !this.tempbool){
                  this.privmarkers = this.db.locations(settings.favrad,mailsplit[mailsplit.length-1],this.lat,this.lng);
                  this.pubmarkers = this.db.publocations(settings.currrad,this.lat,this.lng);
                  // Load Map
                  this.buildMap();
                  // Go to center
                  if(this.tempbool){
                    this.map.flyTo({
                      center: [this.lng, this.lat]
                    })
                    // Set different for user to drag and query location
                    this.centermarker = new mapboxgl.Marker({
                      draggable: true
                    }).setLngLat([this.lng, this.lat]).addTo(this.map);

                    // FInd new data from db and update layers from changetype function
                    this.centermarker.on('dragend', markerval => {
                      console.log(markerval)
                      this.changetype(markerval);
                      this.markerlocation = markerval;
                    })
                  }
                }else{
                  if(!this.alreadysubed){
                    this.alreadysubed = true;
                    this.network.onConnect().subscribe(()=>{
                      console.log("got connection "+this.network.type);
                      if(this.mapInitialized == false){
                        this.storage.provide().then(settings => {
                          this.settings = settings;
                          this.initializeMap(settings,this.mailsplit);
                        })
                      }
                    });
                  }
                }
              })
            },
            (async (error) => { await this.delay(5000); this.initializeMap(settings,mailsplit)})
          );
        }

      } , (err) => {console.log(err)});
    }
  }

  // Much similar to build map function runs everytime we reopen this page to respond to settings changes made by user
  // Also Act upon user querying different location and update layers
  changetype(newlocation){
    console.log(newlocation.target._lngLat);
    this.privmarkers = this.db.locations(this.settings.favrad, this.mailsplit[this.mailsplit.length - 1],
      newlocation.target._lngLat.lat, newlocation.target._lngLat.lng);
    this.pubmarkers = this.db.publocations(this.settings.currrad, newlocation.target._lngLat.lat, newlocation.target._lngLat.lng);

    this.map.removeLayer('firebase');
    this.map.removeSource('firebase');

    this.map.removeLayer('firebase2');
    this.map.removeSource('firebase2');

    this.map.addSource('firebase', {
       type: 'geojson',
       data: {
         type: 'FeatureCollection',
         features: []
       },
       cluster: true,
       clusterMaxZoom: 14,
       clusterRadius: 50
    });

    this.map.addSource('firebase2', {
       type: 'geojson',
       data: {
         type: 'FeatureCollection',
         features: []
       },
       cluster: true,
       clusterMaxZoom: 14,
       clusterRadius: 50
    });

    this.source1 = this.map.getSource('firebase');
    this.source2 = this.map.getSource('firebase2');

    this.privmarkers.subscribe(markers => {
        console.log(markers);
        let data = markers
        this.source1.setData(data)
    })
    this.pubmarkers.subscribe(markers => {
        console.log(markers);
        let data = markers
        this.source2.setData(data)
    })

    if(this.settings.favshow){
      this.map.addLayer({
        id: 'firebase',
        source: 'firebase',
        type: 'symbol',
        layout : {
          'icon-image':'cat',
          "icon-size": 0.06
        },
        paint: {
          "icon-color": {
            "property": "ps",
            "stops": [
              [0, "#ef3b2c"],
              [1, "#0080ff"]
            ]
          }
        }
      })
    }
    if(this.settings.currshow){
      this.map.addLayer({
        id: 'firebase2',
        source: 'firebase2',
        type: 'symbol',
        layout : {
          'icon-image':'cat',
          "icon-size": 0.06
        },
        paint: {
          "icon-color": {
            "property": "ps",
            "stops": [
              [0, "#ef3b2c"],
              [1, "#0b6623"]
            ]
          }
        }
      })
    }
  }

  drawroute(location){
    this.geolocation.getCurrentPosition().then((resp) => {
      this.direction.setOrigin([resp.coords.longitude,resp.coords.latitude])
      this.direction.setDestination(location)
    });

  }

  // Send Notification to Confirm Reporting of a location
  async sendnotification(id, collection, description,reportno,flagged,ps,location) {
    let d = ""
    console.log(location)
    if(flagged){
      d = '<p>'+description+' </p><br /><p>No of Parking Spaces : '+ps+'</p> <br /><ion-icon color="gp" md="md-flag"></ion-icon><p>This location has been Flagged</p><br /><p> Reports on this location : '+reportno+'</p>'
    } else {
      d = '<p>'+description+' </p> <br /><p>No of Parking Spaces : '+ps+'</p> <br /><p> Reports on this location : '+reportno+'</p>'
    }
    const alert = await this.alertCtrl.create({
      header: 'Info',
      message: d,
      buttons: [
                {
                  text: 'OK',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: (blah) => {
                    console.log('Confirm Cancel: blah');
                  }
                },
                {
                  text: 'Report',
                  handler: () => {
                    this.reportalert(id,collection,description);
                  }
                },
                {
                  text: 'GoTo',
                  handler: () => {
                    this.drawroute(location)
                  }
                }
              ]
    });
    await alert.present();
  }

  async reportalert(id, collection, description) {
    const alert = await this.alertCtrl.create({
      header: 'Report Location',
      message: 'Please enter a description of the issue',
      inputs: [
      {
        name: 'issue',
        placeholder:'Write the issue'
      }
      ],
      buttons: [
                {
                  text: 'Cancel',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: (blah) => {
                    console.log('Confirm Cancel: blah');
                  }
                },
                {
                  text: 'Report',
                  handler: (data) => {
                    this.finalconfirmation(id,collection,data.issue)
                  }
                }
              ]
    });
    await alert.present();
  }

  async finalconfirmation(id, collection, description) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm',
      message: 'Are you sure you want to report?',
      buttons: [
                {
                  text: 'No',
                  role: 'cancel',
                  cssClass: 'secondary',
                  handler: (blah) => {
                    console.log('Confirm Cancel: blah');
                  }
                },
                {
                  text: 'Yes',
                  handler: () => {
                    this.report(id,collection,description);
                  }
                }
              ]
    });
    await alert.present();
  }


  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat]
    });

        // Add a click event to the public layer of the map
        this.map.on('click', 'firebase', (e) => {
          var coordinates = e.features[0].geometry.coordinates.slice();
          var description = e.features[0].properties.id;
          var info = e.features[0].properties.description;
          var rn = e.features[0].properties.rb;
          var ps = e.features[0].properties.ps;
          if(e.features[0].properties.flagged){
            var flagged = true;
          }else{
            var flagged = false;
          }
          this.sendnotification(description,'private',info,rn,flagged,ps,coordinates)
        });
        // Add a click event to the private layer of the map
        this.map.on('click', 'firebase2', (e) => {
            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties.id;
            var info = e.features[0].properties.description;
            var rn = e.features[0].properties.rb;
            var ps = e.features[0].properties.ps;
            if(e.features[0].properties.flagged){
              var flagged = true;
            }else{
              var flagged = false;
            }
            this.sendnotification(description,'public',info,rn,flagged,ps,coordinates)
        });

    /// Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());
    var that = this
    this.map.on('load', (event) => {
        this.search = new MapboxGeocoder({accessToken : mapboxgl.accessToken, mapbox : mapboxgl})
        this.search.on('result', object => {
          console.log(object);
          that.getResults(object)
        });
        this.direction = new MapboxDirections({interactive: false,accessToken : mapboxgl.accessToken, mapbox : mapboxgl ,
           controls : {inputs :false,profileSwitcher:false}});
        this.map.addControl(this.search,'top-left');
        this.map.addControl(this.direction,'bottom-left');
          this.map.loadImage('../../assets/a.png', function(error, image) {
            that.mapInitialized = true;
            that.map.addImage('cat', image , {sdf:true});
            /// register the 3 sources public,private and gps to the map
            that.map.addSource('firebase', {
               type: 'geojson',
               data: {
                 type: 'FeatureCollection',
                 features: []
               },
               cluster: true,
               clusterMaxZoom: 14,
               clusterRadius: 50
            });

            that.map.addSource('firebase2', {
               type: 'geojson',
               data: {
                 type: 'FeatureCollection',
                 features: []
               },
               cluster: true,
               clusterMaxZoom: 14,
               clusterRadius: 50
            });

            that.map.addSource('gps', {
               type: 'geojson',
               data: {
                 type: 'FeatureCollection',
                 features: []
               }
            });
            /// get source
            that.source1 = that.map.getSource('firebase');
            that.source2 = that.map.getSource('firebase2');
            that.gps = that.map.getSource('gps');
            // assign private source
            that.privmarkers.subscribe(markers => {
                console.log(markers);
                let data = markers
                that.source1.setData(data)
            })
            // assign the public source
            that.pubmarkers.subscribe(markers => {
                console.log(markers);
                let data = markers
                that.source2.setData(data)
            })
            // assign the gps source
            that.geolocation.watchPosition().subscribe(data => {
                let pos = [data.coords.longitude,data.coords.latitude]
                let x = new GeoJson(pos);
                let arr = [x];
                const fc = new FeatureCollection(arr);
                console.log(fc);
                that.gps.setData(fc);
            });

            // Add private source to the map
            if(that.settings.favshow){
              that.map.addLayer({
                id: 'firebase',
                source: 'firebase',
                type: 'symbol',
                layout : {
                  'icon-image':'cat',
                  "icon-size": 0.06
                },
                paint: {
                  "icon-color": {
                    "property": "ps",
                    "stops": [
                      [0, "#ef3b2c"],
                      [1, "#0080ff"]
                    ]
                  }
                }
              })
            }

            // Add public source to the map
            if(that.settings.currshow){
              that.map.addLayer({
                id: 'firebase2',
                source: 'firebase2',
                type: 'symbol',
                layout : {
                  'icon-image':'cat',
                  "icon-size": 0.06
                },
                paint: {
                  "icon-color": {
                    "property": "ps",
                    "stops": [
                      [0, "#ef3b2c"],
                      [1, "#0b6623"]
                    ]
                  }
                }
              })
            }

            // Add gps source to the map
            that.map.addLayer({
              id: 'gps',
              source: 'gps',
              type: 'symbol',
              layout: {
                'icon-image': 'circle-15'
              },
              paint: {
                'icon-color': '#f16624'
              }
            })

          });


    })

  }


  /// Helper function to the Map flyto location
  flyTo(data: GeoJson) {
    this.map.flyTo({
      offset : [100,0],
      center: data.geometry.coordinates
    })
  }

}
