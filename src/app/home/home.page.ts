import { AfterContentInit, Component, OnInit, ViewChild} from '@angular/core';
declare var google;
import { environment } from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DbService } from '../db.service';
import { AuthServiceService } from '../auth-service.service';
import { LocalstorageService } from '../localstorage.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { NativeGeocoder, NativeGeocoderReverseResult,
   NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AlertController } from '@ionic/angular';
import { Network } from '@ionic-native/network/ngx';


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
  searchbar: string;

  constructor(private network: Network,private alertCtrl: AlertController,private nativeGeocoder: NativeGeocoder,
    private locationAccuracy: LocationAccuracy, private auth: AuthServiceService,
    private db: DbService, private geolocation: Geolocation, private storage: LocalstorageService) {

    mapboxgl.accessToken = environment.mapbox.accessToken

  }

  getResults(){
    let options: NativeGeocoderOptions = {
        useLocale: true,
        maxResults: 5
    };
    this.nativeGeocoder.forwardGeocode(this.searchbar, options)
      .then((coordinates: NativeGeocoderForwardResult[]) => {
        console.log(coordinates);
        console.log('The coordinates are latitude=' + coordinates[0].latitude + ' and longitude=' + coordinates[0].longitude)
        this.searchbar = null;
        this.centermarker.setLngLat([coordinates[0].longitude, coordinates[0].latitude])
        var markerval = {target : { _lngLat : { lat : coordinates[0].latitude , lng:coordinates[0].longitude }}}
        this.markerlocation = markerval;
        this.changetype(markerval);
        this.map.flyTo({
          center: [coordinates[0].longitude, coordinates[0].latitude]
        })
      })
      .catch((error: any) => console.log(error));
  }

  ionViewWillEnter() {
    console.log('view will enter');
    if (this.timesentered == 0) {
        this.timesentered = 1
    } else {
      this.storage.provide().then(settings => {
        this.settings = settings;
        this.changetype(this.markerlocation);
      })
    }

  }

  ionViewDidLeave(){
    console.log('view did leave');
  }

  ngOnInit(): void {
    console.log('ng on init')
    this.auth.user.subscribe( val => {
      this.user = val;
      this.mailsplit = this.user.email.split('@');
      // When running the first time if network has not been connected do not initialize map
      if(this.network.type != 'none'){
        console.log("network is "+this.network.type);
        this.storage.provide().then(settings => {
          this.settings = settings;
          this.initializeMap(settings,this.mailsplit);
        })
      }
      // If connected to network and map has not been initialized already initialize
      this.network.onConnect().subscribe(()=>{
        console.log("got connection "+this.network.type);
        if(this.mapInitialized == false){
          this.storage.provide().then(settings => {
            this.settings = settings;
            this.initializeMap(settings,this.mailsplit);
          })
        }
      });

    });
  }

  report(location, collection) {
    this.db.reportlocation(location, collection);
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
                this.privmarkers = this.db.locations(settings.favrad,mailsplit[mailsplit.length-1],this.lat,this.lng);
                this.pubmarkers = this.db.publocations(settings.currrad,this.lat,this.lng);
                // Load Map
                this.buildMap();
                // Go to center
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
        layout: {
          'text-field': '{ps}',
          'text-size': 24,
          'text-transform': 'uppercase',
          'icon-image': 'car-15',
          'text-offset': [0, 1.5]
        },
        paint: {
          'text-color': '#f16624',
          'text-halo-color': '#fff',
          'text-halo-width': 2
        }
      })
    }
    if(this.settings.currshow){
      this.map.addLayer({
        id: 'firebase2',
        source: 'firebase2',
        type: 'symbol',
        layout: {
          'text-field': '{ps}',
          'text-size': 24,
          'text-transform': 'uppercase',
          'icon-image': 'car-15',
          'text-offset': [0, 1.5]
        },
        paint: {
          'text-color': '#fd323f',
          'text-halo-color': '#fff',
          'text-halo-width': 2
        }
      })
    }
  }

  // Send Notification to Confirm Reporting of a location
  async sendnotification(id, collection, description) {
    const alert = await this.alertCtrl.create({
      header: 'Info',
      message: description,
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
                    this.report(id,collection)
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
          this.sendnotification(description,'private',info)
        });
        // Add a click event to the private layer of the map
        this.map.on('click', 'firebase2', (e) => {
            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties.id;
            var info = e.features[0].properties.description;
            this.sendnotification(description,'public',info)
        });

    /// Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('load', (event) => {
          this.mapInitialized = true;
          /// register the 3 sources public,private and gps to the map
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

          this.map.addSource('gps', {
             type: 'geojson',
             data: {
               type: 'FeatureCollection',
               features: []
             }
          });
          /// get source
          this.source1 = this.map.getSource('firebase');
          this.source2 = this.map.getSource('firebase2');
          this.gps = this.map.getSource('gps');
          // assign private source
          this.privmarkers.subscribe(markers => {
              console.log(markers);
              let data = markers
              this.source1.setData(data)
          })
          // assign the public source
          this.pubmarkers.subscribe(markers => {
              console.log(markers);
              let data = markers
              this.source2.setData(data)
          })
          // assign the gps source
          this.geolocation.watchPosition().subscribe(data => {
              let pos = [data.coords.longitude,data.coords.latitude]
              let x = new GeoJson(pos);
              let arr = [x];
              const fc = new FeatureCollection(arr);
              console.log(fc);
              this.gps.setData(fc);
          });

          // Add private source to the map
          if(this.settings.favshow){
            this.map.addLayer({
              id: 'firebase',
              source: 'firebase',
              type: 'symbol',
              layout: {
                'text-field': '{ps}',
                'text-size': 24,
                'text-transform': 'uppercase',
                'icon-image': 'car-15',
                'text-offset': [0, 1.5]
              },
              paint: {
                'text-color': '#f16624',
                'text-halo-color': '#fff',
                'text-halo-width': 2
              }
            })
          }

          // Add public source to the map
          if(this.settings.currshow){
            this.map.addLayer({
              id: 'firebase2',
              source: 'firebase2',
              type: 'symbol',
              layout: {
                'text-field': '{ps}',
                'text-size': 24,
                'text-transform': 'uppercase',
                'icon-image': 'car-15',
                'text-offset': [0, 1.5]
              },
              paint: {
                'text-color': '#fd323f',
                'text-halo-color': '#fff',
                'text-halo-width': 2
              }
            })
          }

          // Add gps source to the map
          this.map.addLayer({
            id: 'gps',
            source: 'gps',
            type: 'symbol',
            layout: {
              'text-field': '',
              'text-size': 24,
              'text-transform': 'uppercase',
              'icon-image': 'circle-15',
              'text-offset': [0, 1.5]
            },
            paint: {
              'text-color': '#f16624',
              'text-halo-color': '#fff',
              'text-halo-width': 2
            }
          })

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
