import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { combineLatest, forkJoin, last, switchMap } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { FfmpegService } from 'src/app/services/ffmpeg.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnDestroy {
  isDragOver = false;
  user: firebase.User | null = null;
  file: File | null = null;
  title = new FormControl('', [Validators.required, Validators.minLength(5)]);
  uploadForm = new FormGroup({
    title: this.title,
  });
  inSubmission = false;
  percentage = 0;
  showAlert = false;
  alertColor = '';
  alertTitle = '';
  alertSubtitle = '';
  task?: AngularFireUploadTask;
  screenshotUploadTask?: AngularFireUploadTask;
  screenshots: string[] = [];
  selectedScreenshot = 0;

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipService: ClipService,
    private router: Router,
    public ffmpegService: FfmpegService
  ) {
    auth.user.subscribe((user) => (this.user = user));
  }

  ngOnDestroy(): void {
    this.task?.cancel();
  }

  async storeFile(e: Event) {
    if (this.ffmpegService.isRunning) {
      return;
    }

    this.isDragOver = false;
    this.file = (e as DragEvent).dataTransfer
      ? (e as DragEvent).dataTransfer?.files.item(0) ?? null
      : (e.target as HTMLInputElement).files?.item(0) ?? null;

    if (!this.file || this.file.type != 'video/mp4') {
      return;
    }
    console.log('File');
    console.log(this.file);
    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));

    this.screenshots = await this.ffmpegService.getScreenshots(this.file);
    if (this.screenshots.length > 0) {
      this.selectedScreenshot = 0;
    }
  }

  async uploadVideo() {
    this.uploadForm.disable();
    this.showAlert = true;
    this.alertColor = 'rgba(68, 44, 222)';
    this.alertTitle = 'Upload in progress...';
    this.inSubmission = true;

    const fileName = uuid();
    const path = `clips/${fileName}.mp4`;
    console.log('File path: ', path);
    this.task = this.storage.upload(path, this.file);
    const clipRef = this.storage.ref(path);

    const imageBlob = await this.ffmpegService.blobFromUrl(
      this.screenshots[this.selectedScreenshot]
    );
    const screenshotPath = `screenshots/${fileName}.png`;
    this.screenshotUploadTask = this.storage.upload(screenshotPath, imageBlob);
    const screenshotRef = this.storage.ref(screenshotPath);

    combineLatest([
      this.task.percentageChanges(),
      this.screenshotUploadTask.percentageChanges(),
    ]).subscribe((progresses) => {
      const [clipProgress, screenshotProgress] = progresses;
      if (!clipProgress || !screenshotProgress) {
        return;
      }
      this.percentage = ((clipProgress + screenshotProgress) as number) / 200;
    });

    forkJoin([
      this.task.snapshotChanges(),
      this.screenshotUploadTask.snapshotChanges(),
    ]).pipe(
      switchMap(() =>
        forkJoin([clipRef.getDownloadURL(), screenshotRef.getDownloadURL()])
      )
    ).subscribe({
      next: async (urls) => {
        const [clipURL, screenshotURL] = urls;
        let uploadObj = {
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value as string,
          fileName: `${fileName}.mp4`,
          screenshotFileName: `${fileName}.png`,
          url: clipURL,
          screenshotURL,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        };
        this.inSubmission = false;
        this.alertColor = 'rgba(58, 240, 61)';
        this.alertTitle = 'Upload complete!';
        console.log({ uploadObj });
        let clipDoc = await this.clipService.createClip(uploadObj);
        console.log(clipDoc);
        this.router.navigateByUrl('clip/' + clipDoc.id);
      },
      error: (error) => {
        this.uploadForm.enable();
        this.inSubmission = false;
        this.alertColor = 'rgba(219, 38, 22)';
        this.alertTitle = 'An error occured while uploading the file.';
        console.error(error);
      },
    });

    this.task
      .snapshotChanges()
      .pipe(
        last(),
        switchMap(() => clipRef.getDownloadURL())
      )
      .subscribe({
        next: async (url) => {
          
        },
        
      });
  }
}
