import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { last } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit{
  isDragOver = false
  file : File | null = null
  nextStep = false
  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  })
  uploadForm = new FormGroup({
    title: this.title
  })

  showAlert = false
  alertColor = 'blue'
  alertMessage = 'Please wait. Your clip is being uploaded ...'
  inSubmission = false

  percentage = 0
  showPercentage = false
  constructor(private storage: AngularFireStorage){}

  ngOnInit(): void {  
  }

  storeFile($event: Event){
    this.isDragOver = false
    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null
    if (!this.file || this.file.type != 'video/mp4') {
      return
    }

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''))
    this.nextStep = true

  }

  uploadFile() {
    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMessage = 'Please wait. Your clip is being uploaded ...'
    this.inSubmission = true
    this.showPercentage = true

    const clipFileName = uuid()
    const clipPath = `clips/${clipFileName}.mp4`
    
    const task = this.storage.upload(clipPath, this.file)
    task.percentageChanges().subscribe(progress => {
      this.percentage = progress as number / 100
    })

    task.snapshotChanges().pipe(
      last()
    ).subscribe({
      next: (snapshot) => {
        this.alertColor = 'green'
        this.alertMessage = 'Success! Your clip is now ready to share with the world'
        this.showPercentage = false
      },
      error: (err) => {
        this.alertColor = 'red'
        this.alertMessage = 'Upload failed! Please try again later'
        this.inSubmission = true
        this.showPercentage = false
        console.log(err);
        
      }
    });
  }
}