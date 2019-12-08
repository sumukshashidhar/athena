import { Component, OnInit } from "@angular/core";

import { AchievementsService } from "./../../../shared/achievements/achievements.service";
import { Achievements } from "./../../../shared/achievements/achievements.model";
import { Router } from "@angular/router";
import { NgForm } from "@angular/forms";

import { LoadingComponent } from "./../../loading/loading.component";
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
export var  uploadedFiles: Array < File > ;
@Component({
  selector: "app-achievements",
  templateUrl: "./achievements.component.html",
  styleUrls: ["./achievements.component.css"]
})
export class AchievementsComponent implements OnInit {
  showSpinner: boolean = true;
  ach_list: any;
  url = '';
  fileChange(event) {
    uploadedFiles = event.target.files;
    console.log(uploadedFiles)
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        // this.url = event.target.result;
      }
    }
  }
  constructor(private auth:AuthService,public achService: AchievementsService, private router: Router,private http: HttpClient) {}

  ngOnInit() {
    this.refreshAchievements();
  }
  
  onSubmit(form: NgForm) {
    console.log('UPLOAD METHOD');
    console.log(form.value)
    var cat= form.value['achCat']
    var subcat= form.value['achSubCat']
    var file= uploadedFiles;

    console.log(`YES ${cat}`)
    console.log(`THIS ${subcat}`)
    console.log(`DONE${file}`)
    console.log(uploadedFiles[0]['name'])
 
    let formData = new FormData();
      for (var i = 0; i < uploadedFiles.length; i++) {
          formData.append("uploads[]", uploadedFiles[i], uploadedFiles[i].name);
      }


      var selectedAchievements: Achievements = {
        uploadedFiles: file, 
        achCat: cat,
        achSubCat: subcat 
      };
      console.log('YES THIS WORKS')
      console.log(selectedAchievements)



    this.achService.postAchievements(selectedAchievements).subscribe(
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


  logout() {
    this.auth.logout();
    this.router.navigate(["/login"]);
  }
  refreshAchievements() {
    this.achService.getAchievements().subscribe(res => {
      this.ach_list = res as Achievements[];
      console.log(this.ach_list);
      this.showSpinner = false;
      console.log(
        "Show spinner is now false and we are in the refresh achievements method"
      );
    });
  }

  onDelete(_id: string) {
    if (confirm('Do you want to delete this record ?') == true) {
      console.log(_id)
      this.achService.deleteAchievement(_id).subscribe((res) => {
        this.refreshAchievements();
      })
    }
  }


//   fileChange(element) {
    // this.uploadedFiles = element.target.files;
// }

// upload() {
//   console.log('UPLOAD METHOD');
//   console.log(this.uploadedFiles);
//   let formData = new FormData();
//     for (var i = 0; i < this.uploadedFiles.length; i++) {
//         formData.append("uploads[]", this.uploadedFiles[i], this.uploadedFiles[i].name);
//     }
//     this.http.post('http://localhost:3000/achievements', formData)
//         .subscribe((response) => {
//             console.log('response received is ', response);
//         })

// }

}


