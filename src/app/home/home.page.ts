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
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AlertController } from '@ionic/angular';


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
  emailVerified?:boolean;
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
  style = 'mapbox://styles/mapbox/outdoors-v9';
  lat = 37.75;
  lng = -122.41;
  message = 'Hello World!';
  centermarker : any;
  user: User = {
    uid : "",
    email : "",
    photoURL : "",
    displayName : "",
    favoriteColor : "",
    emailVerified: false
  };
  source1: any;
  source2:any;
  gps:any;
  privmarkers: any;
  pubmarkers:any;
  settings:any;
  mailsplit:any;
  markerlocation:any;
  timesentered = 0;
  searchbar: string;

  constructor(private alertCtrl: AlertController,private nativeGeocoder: NativeGeocoder, private locationAccuracy: LocationAccuracy, private auth : AuthServiceService, private db : DbService,private geolocation: Geolocation, private storage : LocalstorageService) {

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

  ionViewWillEnter(){
    console.log('view will enter');
    if(this.timesentered == 0){
        this.timesentered = 1
    }else{
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
      this.storage.provide().then(settings => {
        this.settings = settings;
        this.initializeMap(settings,this.mailsplit);
      })
    });
  }

  report(location,collection){
    this.db.reportlocation(location,collection);
  }
  private initializeMap(settings,mailsplit) {
    /// locate the user

    if (false) {
       console.log("using old");
       navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.privmarkers = this.db.locations(settings.currrad,mailsplit[mailsplit.length-1],this.lat,this.lng);
        this.pubmarkers = this.db.publocations(settings.currrad,this.lat,this.lng);
        this.buildMap();
        this.map.flyTo({
          center: [this.lng, this.lat]
        })
        this.centermarker = new mapboxgl.Marker({
          draggable: true
        }).setLngLat([this.lng, this.lat]).addTo(this.map);
        this.centermarker.on('dragend', markerval => {
          this.changetype(markerval);
          this.markerlocation = markerval;
        })

      });
    }else{
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        console.log(canRequest);
        if(canRequest) {
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => {
              console.log('got permission');
              this.geolocation.getCurrentPosition().then((resp) => {
                console.log(resp);
                this.lat = resp.coords.latitude;
                this.lng = resp.coords.longitude;
                this.privmarkers = this.db.locations(settings.favrad,mailsplit[mailsplit.length-1],this.lat,this.lng);
                this.pubmarkers = this.db.publocations(settings.currrad,this.lat,this.lng);
                this.buildMap();
                this.map.flyTo({
                  center: [this.lng, this.lat]
                })
                this.centermarker = new mapboxgl.Marker({
                  draggable: true
                }).setLngLat([this.lng, this.lat]).addTo(this.map);
                this.centermarker.on('dragend', markerval => {
                  console.log(markerval)
                  this.changetype(markerval);
                  this.markerlocation=markerval;
                })


              })
            },
            error => console.log('Error requesting location permissions', error)
          );
        }

      } , (err)=> {console.log(err)});
    }




  }

  changetype(newlocation){
    console.log(newlocation.target._lngLat);
    this.privmarkers = this.db.locations(this.settings.favrad,this.mailsplit[this.mailsplit.length - 1],newlocation.target._lngLat.lat,newlocation.target._lngLat.lng);
    this.pubmarkers = this.db.publocations(this.settings.currrad,newlocation.target._lngLat.lat,newlocation.target._lngLat.lng);

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

    /// get source
    this.source1 = this.map.getSource('firebase');
    this.source2 = this.map.getSource('firebase2');
    /// subscribe to realtime database and set data source
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

    /// create map layers with realtime data

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

  async sendnotification(id,collection){
    const alert = await this.alertCtrl.create({
    header: 'Confirm!',
    message: 'Do  you wish to report this location',
    buttons: [
    {
    text: 'Cancel',
    role: 'cancel',
    cssClass: 'secondary',
    handler: (blah) => {
      console.log('Confirm Cancel: blah');
    }
    }, {
    text: 'Okay',
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


        this.map.on('click', 'firebase', (e) => {
          var coordinates = e.features[0].geometry.coordinates.slice();
          var description = e.features[0].properties.id
          this.sendnotification(description,'private')
        });

        this.map.on('click', 'firebase2', (e) => {
            var coordinates = e.features[0].geometry.coordinates.slice();
            var description = e.features[0].properties.id
            this.sendnotification(description,'public')
        });

    /// Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('load', (event) => {


          // Add the geocoder to the map

          /// register source
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
          /// subscribe to realtime database and set data source
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
          this.geolocation.watchPosition().subscribe(data => {
              let pos = [data.coords.longitude,data.coords.latitude]
              let x = new GeoJson(pos);
              let arr = [x];
              const fc = new FeatureCollection(arr);
              console.log(fc);
              this.gps.setData(fc);
          });

          /// create map layers with realtime data
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



    /// Add realtime firebase data on map load


  }


  /// Helpers


  flyTo(data: GeoJson) {
    this.map.flyTo({
      center: data.geometry.coordinates
    })
  }

}
