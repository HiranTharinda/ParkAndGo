import { AfterContentInit, Component, OnInit, ViewChild} from '@angular/core';
declare var google;
import { environment } from '../../environments/environment';
import * as mapboxgl from 'mapbox-gl';
import { DbService } from '../db.service';
import { AuthServiceService } from '../auth-service.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';

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
  source: any;
  privmarkers: any;

  constructor(private auth : AuthServiceService, private db : DbService,private geolocation: Geolocation) {

    mapboxgl.accessToken = environment.mapbox.accessToken

  }

  ngOnInit(): void {
    this.initializeMap();
    this.privmarkers = this.db.locations();
    this.auth.user.subscribe( val => {
          this.user = val;
          console.log(this.user);
        });
  }

  private initializeMap() {
    /// locate the user
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.map.flyTo({
          center: [this.lng, this.lat]
        })
        this.centermarker = new mapboxgl.Marker({
          draggable: true
        }).setLngLat([this.lng, this.lat]).addTo(this.map);
        this.centermarker.on('dragend', markerval => {
          console.log(markerval);
        })
      });
    }else{
      console.log('ya');
      this.geolocation.getCurrentPosition().then((resp) => {
        console.log(resp);
        this.lat = resp.coords.latitude;
        this.lng = resp.coords.longitude;
        this.map.flyTo({
          center: [this.lng, this.lat]
        })
        this.centermarker = new mapboxgl.Marker({
          draggable: true
        }).setLngLat([this.lng, this.lat]).addTo(this.map);
        this.centermarker.on('dragend', markerval => {
          console.log(markerval);
        })
      })
    }

    this.buildMap()

  }

  changetype(){
    this.privmarkers = this.db.publocations();
    this.map.removeLayer('firebase');
    this.map.removeSource('firebase');
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

    /// get source
    this.source = this.map.getSource('firebase')

    /// subscribe to realtime database and set data source
    this.privmarkers.subscribe(markers => {
        let data = markers
        this.source.setData(data)
    })

    /// create map layers with realtime data
    this.map.addLayer({
      id: 'firebase',
      source: 'firebase',
      type: 'symbol',
      layout: {
        'text-field': '{ps}',
        'text-size': 24,
        'text-transform': 'uppercase',
        'icon-image': 'rocket-15',
        'text-offset': [0, 1.5]
      },
      paint: {
        'text-color': '#f16624',
        'text-halo-color': '#fff',
        'text-halo-width': 2
      }
    })

  }

  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat]
    });


    /// Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('load', (event) => {


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

          /// get source
          this.source = this.map.getSource('firebase')

          /// subscribe to realtime database and set data source
          this.privmarkers.subscribe(markers => {
              let data = markers
              this.source.setData(data)
          })

          /// create map layers with realtime data
          this.map.addLayer({
            id: 'firebase',
            source: 'firebase',
            type: 'symbol',
            layout: {
              'text-field': '{ps}',
              'text-size': 24,
              'text-transform': 'uppercase',
              'icon-image': 'rocket-15',
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
