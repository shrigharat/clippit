import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import videojs from "video.js";

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class ClipComponent implements OnInit {

  clip?: IClip;
  @ViewChild('videoPlayer', {static: true}) target?:ElementRef;
  player?:videojs.Player;

  constructor(public route: ActivatedRoute, private clipService: ClipService, public elementRef: ElementRef) {}

  ngOnInit(): void {
    this.player = videojs(this.target?.nativeElement);
    this.route.data.subscribe((data) => {
      this.clip = data['clip'] as IClip;
      this.player?.src({
        src: this.clip.url,
        type: 'video/mp4'
      })
    })
  }

  async init() {
    // this.clipInfo = await this.clipService.fetchClip(this.id);
  }
}
