import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { List } from 'src/app/model/forcast';
import { Datas, } from 'src/app/model/rapidPlace';
import { IWeather } from 'src/app/model/weather';
import { PlaceAndWeatherService } from '../services/place-and-weather.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  userInput!: string
  places!: Datas[];
  current!: IWeather
  $currentdata!: Observable<IWeather>


  placeDeatils$: any
  userSearch = new Subject<string>

  constructor(private placeWeatherService: PlaceAndWeatherService, private datepipe: DatePipe) {
    this.userSearch.pipe(debounceTime(800)).subscribe(val => this.getPlaces(val))
  }

  getPlaces(searchString: string) {
    this.placeWeatherService.getPlaces(searchString).subscribe(res => this.places = res)
  }



  // searchInput!: string;
  $forcast!: List[]
  todaysforcast!: List[]
  weeklyforcast!: List[]
  forcastTime!: List[]
  nextDays!: List[]
  $currentForecast!: any
  DateToday = new Date();
  $input = new Subject<string>()
  date = new Date()
  today: number = Date.now();
  intervalId: any;
  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.date = new Date();
    }, 1000);






  }


  getDeatails(item: any) {

    this.placeWeatherService.getCurrentWeatherData(item.latitude, item.longitude).subscribe(result => {
      this.current = result
      this.userInput = this.current.name
      this.places = []

      this.placeWeatherService.getforcast(item.latitude, item.longitude).subscribe(result => {
        this.$forcast = result.filter(val => {
          console.log(this.datepipe?.transform(val.dt_txt, 'yyyy/MM/dd'));

          const allday = this.datepipe?.transform(val.dt_txt, 'yyyy/MM/dd')
          const today = this.datepipe?.transform(this.date, 'yyyy/MM/dd')
          console.log(today,' ',allday);
          console.log(allday);


          return today === allday
        })
        this.weeklyforcast = result.filter((val) => {
          let a = this.datepipe.transform(val.dt_txt, 'hh:mm a');
          let b = '12:00 PM'
          return a == b
        })

        this.todaysforcast = result.filter((val) => {
          let a = this.datepipe.transform(val.dt_txt, 'yyyy/MM/dd');
          let b = this.datepipe.transform(this.date, 'yyyy/MM/dd')
          return a == b

      })

    });

  })
  }

  myLocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(loc=>{
      this.passPlace(loc.coords)
      })
    }
    else{alert('Your system rejected this request')}
  }
  passPlace(coords: GeolocationCoordinates) {
    throw new Error('Method not implemented.');
  }



}


