
import { AuthService } from 'src/app/auth/auth.service';
import { Component, OnInit } from "@angular/core";

import { AchievementsService } from "./../../../shared/achievements/achievements.service";
import { Achievements } from "../../../shared/achievements/achievements.model";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";

import { LoadingComponent } from "./../../loading/loading.component";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventService } from 'src/app/shared/events/event.service';
export var Achievement: Achievements = {
  uploadedFiles: [], 
  achCat: "",
  achSubCat: "" 
};

@Component({
  selector: "app-achievements",
  templateUrl: "./achievements.component.html",
  styleUrls: ["./achievements.component.css"]
})
export class AchievementsComponent implements OnInit {
  profileUrlExists=false
  imageToShow:any
  uploadedFiles: Array < File > ;
  showSpinner: boolean = true;
  ach_list: any;
  enableClose=false
   link:string
   actualLink:any
   path:''



   config = {

    search: true,
    height: 'auto',
    placeholder: 'Select',
    displayKey: 'catName'

  };

  configSubCat = {

    search: true,
    height: 'auto',
    placeholder: 'Select',
    displayKey: 'subCatName'

  };
  subCatName: any;
  categoryOption: any;
  subcatOptions: any;
  noOfChoice = new Array<string>();
  localStorage: any;



  constructor(public achService: AchievementsService, private router: Router,private http: HttpClient, public auth:AuthService
    ,private catService: EventService)  {
    this.noOfChoice.push('1');
  }

  ngOnInit() {
    this.refreshAchievements();
    this.getAllCategory();
    
  }

  
  getAllCategory() {

    this.catService.getcategoryDetails().subscribe(res => {
      this.categoryOption = res;
      console.log(this.categoryOption);
    });
  }


  selectionChanged(event) {
    this.subCatName = null;
    console.log(event)
    console.log(event.value);
   
    Achievement.achCat=event.value['catName']
    this.catService.getSubCategory(event.value.catId).subscribe(res => {
      this.subcatOptions = res;
     
    });
  }






  adduserInterestList() {

    let arr = [];
    for (let i = 0; i < this.subCatName.length; i++) {
      arr.push(this.subCatName[i].subCatName);
    }
    console.log(arr)
    console.log(this.subCatName['subCatName'])
    Achievement.achSubCat=this.subCatName['subCatName']
  
    console.log(this.uploadedFiles);
   
    let formData = new FormData();
    for (var i = 0; i < this.uploadedFiles.length; i++) {
      formData.append("uploads[]", this.uploadedFiles[i], this.uploadedFiles[i].name);
        }
        
        console.log(formData)
        this.http.post('http://localhost:3000/abcd', formData)
          .subscribe((response) => {
              console.log('response received is ', response);
              Achievement.uploadedFiles=response['Image']
              console.log(Achievement)
              this.achService.postAchievements(Achievement).subscribe((res)=>{
                console.log(res)
          })

       
        });



  }


  onSubmit(form: NgForm) {
    console.log('UPLOAD METHOD');
    console.log(form.value)  
  }


    logout(){
      this.auth.logout()
    }
  refreshAchievements() {
    this.achService.getAchievements().subscribe(res => {
      this.ach_list = res as Achievements[];
      console.log(this.ach_list);
      for ( var i=0;i<3;i++){
       console.log((this.ach_list[i].Image))
       var pa=this.ach_list[i].Image
       console.log(pa) 
       this.postToIt(pa)
      }
      
      this.showSpinner = false;
      console.log(
        "Show spinner is now false and we are in the refresh achievements method"
      );
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
  
  

  postToIt(id:string){
    this.http.post('http://localhost:3000/achImg',id,{ responseType:'blob'}).subscribe
    ((response:Blob)=>{
      console.log('response as blob');
      console.log(response);
       this.createImageFromBlob(response);
    }); 
  }

  onDelete(_id: string) {
    if (confirm('Do you want to delete this record ?') == true) {
      this.achService.deleteAchievement(_id).subscribe((res) => {
        this.refreshAchievements();
      })
    }
  }


  fileChange(element) {
    this.uploadedFiles = element.target.files;
    this.enableClose=true
}

}