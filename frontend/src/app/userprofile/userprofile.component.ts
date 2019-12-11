
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { Achievements } from '../shared/achievements/achievements.model';
import { AchievementsService } from '../shared/achievements/achievements.service';
import * as jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
  ach_list: any;
   decoded:any
  bio:any
  username:any
  constructor( private auth: AuthService,
    private router: Router,private http:HttpClient,public achService: AchievementsService) {
      this.decoded = localStorage.getItem('access_token');
     }



     getBio(email:String){
       this.http.post('http://localhost:3000/bio', email).subscribe(res=>{
        console.log('RESPONSE FOR BIO: ');
        console.log(res);
         this.bio=res
       })
       
     }
  ngOnInit() {
   

    var decodedtoken= jwt_decode(this.decoded)
    if (decodedtoken["role"] == "Student") {
      this.username = decodedtoken["given_name"];
      var EMAIL=decodedtoken['email']
      var BioInfo=this.getBio(EMAIL)
      console.log(BioInfo)
      console.log(EMAIL)
    }
    console.log(this.decoded)
    this.getAch()
  }
  logout() {
    this.auth.logout();
    this.router.navigate(["/login"]);
  }
  getAch(){
    this.achService.getAchievements().subscribe(res => {
      this.ach_list = res as Achievements[];
      console.log(this.ach_list);
    });
  }
}
