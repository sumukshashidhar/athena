import { EventService } from './../../../shared/events/event.service';
import { AchievementsService } from './../../../shared/achievements/achievements.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NameService } from "./../../../shared/name/name.service";
import { CookieService } from "ngx-cookie-service";
import * as jwt_decode from 'jwt-decode';
import { Component, OnInit, Inject } from "@angular/core";
import { SearchService } from "../../../shared/search/search.service";
import { AuthService } from './../../../shared/auth/auth.service'
import { Router } from "@angular/router";
import { Search } from "../../../shared/search/search.model";
import { NgForm } from "@angular/forms";
import { Observable } from 'rxjs';
import { Achievements } from 'src/app/shared/achievements/achievements.model';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { school } from '../signup/signup.component'
export var decoded :any 
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  profileUrlExists=false
  interestlist:any
  imageToShow:any
  uploadedFiles: Array < File > ;
  username: any;
  ipAddress:string;
  path:''
  ach_list:any
   School=school
   evn_list:any
  constructor(@Inject(LOCAL_STORAGE) private localStorage: any, 
    
    private auth: AuthService,
    private router: Router,
    private data: SearchService,
    private uname: NameService,
    public SearchService: SearchService,
    private http:HttpClient,
    private ach:AchievementsService,
    private eventService:EventService
  ) {
    
    decoded= localStorage.getItem('access_token');
    var decodedtoken= jwt_decode(decoded)
    var email=decodedtoken['email']
    this.postToIt()
    this.refreshAchievements();
    this.getInterests();
    this.getEvents()
  }
  refreshAchievements() {
    this.ach.getAchievements().subscribe(res => {
      this.ach_list = res as Achievements[];
      console.log(this.ach_list)
    });
  }


createImageFromBlob(image:Blob){
  let reader= new FileReader();
  reader.addEventListener("load",()=>{
    this.imageToShow=reader.result;
  },false);
  this.profileUrlExists=true
  if(image){
    reader.readAsDataURL(image)
  }
  }

  getEvents(){
    this.eventService.getFollowEvents().subscribe(
      res => {
        console.log(res)
        this.evn_list = res;
      },
      err => {
        console.log(err)
      }
    )
  }



  getInterests(){
    return this.http.get('http://ec2-13-126-238-105.ap-south-1.compute.amazonaws.com:3000/interests').subscribe(res=>{
      this.interestlist=res
      console.log(this.interestlist)
    })
  }

  

  send(){
    let formData = new FormData();
    for (var i = 0; i < this.uploadedFiles.length; i++) {
        formData.append("uploads[]", this.uploadedFiles[i], this.uploadedFiles[i].name);
    }
    console.log(formData)
    this.http.post('http://ec2-13-126-238-105.ap-south-1.compute.amazonaws.com:3000/uploadProfile', formData)
        .subscribe((response) => {
            console.log('response received is ', response);
            this.path= response['path']
            console.log(this.path)


        });

        this.postEvents();
        this.http.post('http://ec2-13-126-238-105.ap-south-1.compute.amazonaws.com:3000/uploadProfile',this.uploadedFiles)
  }





  postToIt(){
      this.http.get('http://ec2-13-126-238-105.ap-south-1.compute.amazonaws.com:3000/imageUpload',{ responseType:'blob'}).subscribe
      ((response:Blob)=>{
        console.log('response as blob');
        console.log(response);
         this.createImageFromBlob(response);
      }); 
    }











  
  fileChange(element) {
    this.uploadedFiles = element.target.files;
}


postEvents() {
  const token=this.localStorage.getItem('access_token')
  const headers = new HttpHeaders().set('Authorization','Bearer'+token) ;
  const options = {
    headers: headers
  };
  return this.http.post("http://ec2-13-126-238-105.ap-south-1.compute.amazonaws.com:3000/uploadProfile",options);
}
  logout() {
    this.auth.logout();
    this.router.navigate(["/login"]);
  }
  getIP()
  {
      this.auth.getIPAddress().subscribe((res:any)=>{
      this.ipAddress=res.ip;
      this.http.post('http://ec2-13-126-238-105.ap-south-1.compute.amazonaws.com:3000/api/ip', this.ipAddress )
      console.log('IP POSTED')
    });
  }
  ngOnInit() {
    console.log(this.School)
    var decodedtoken= jwt_decode(decoded)
    this.getIP();

    this.data.currentName.subscribe((res: Response) => {
      if (decodedtoken["role"] == "Student") {
        this.username = decodedtoken["given_name"];
      }
      console.log(this.username);
    });
  }

  onSubmit(form: NgForm) {
    this.SearchService.postSearch(form.value).subscribe(
      res => {
        console.log(res);
      },
      err => {
        if (err.status === 422) {
          console.log(422);
        } else {
          console.log(err);
        }
        console.log("Error");
      }
    );
  }
}
