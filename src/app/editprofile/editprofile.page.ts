import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.page.html',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateY(100%)', opacity: 0}),
          animate('100ms', style({transform: 'translateY(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateY(0)', opacity: 1}),
          animate('100ms', style({transform: 'translateY(100%)', opacity: 0}))
        ])
      ]
    )
  ],
  styleUrls: ['./editprofile.page.scss'],
})
export class EditprofilePage implements OnInit {
  // list of all questions
  questions = [{ q : 'What it this App About ?' , a: 'Park&Go provides users a user friendly way to locate nearby parkings lots in the area visualized through our user friendly map' , o:false}
  ,{ q : 'What does everything mean?' , a: 'The car symbols on the area represent parking lots the number below represent the number of parking spots in the area', o:false}
  ,{ q : 'Why are there parking spaces with no numbers ?' , a: 'This is to preserve a unclustered view of the map. Simply zoom in to see a more detailed view', o:false},
  { q : 'What are these colors ?' , a: 'The red parking spots show empty parking spaces while green parking spots represent public parking blue parking spaces are private lots that are available to you', o:false},
  { q : 'What do the black Car Parks represent ?' , a: 'Black Symbols represent clustered areas, Zooming in further to these Areas will reveal more parking spaces', o:false},
  { q : 'I Cannot see a private parking spot that is available to me what should I do?' , a: 'Private parking spots are made available through private email domains Check again to see wether you are logged in with a private email domain', o:false},
  { q : 'How do I stop Notifications for nearby parking spots' , a: 'Notifications only arrive when the app is open or in the background. You can easily toggle these settings in the Settings Page', o:false},
  { q : 'How do post a new private location' , a: 'Posting new locations is only available if you are a registered customer. Please contact our nearest office for more information', o:false},
  { q : 'A location I went to does not have any parking what do I do' , a: 'If there was only a very limited amount of parking spaces when you First saw the location on the map Chances are that another person perhaps not even using ParkAndGo took the place. If so we do apologize for the inconvinence. If the Marker does not locate to a Parking Lot please Report the area. We will look into it.', o:false},
  { q : 'How Do I report a Location ?' , a: 'Simply click on the marker and proceed to Report the location', o:false}]
  constructor() { }

  ngOnInit() {
  }

  toggleSelection(index){
    this.questions[index].o = !this.questions[index].o
  }

}
