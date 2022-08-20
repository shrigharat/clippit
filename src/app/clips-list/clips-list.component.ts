import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ClipService } from '../services/clip.service';

@Component({
  selector: 'app-clips-list',
  templateUrl: './clips-list.component.html',
  styleUrls: ['./clips-list.component.css'],
  providers: [DatePipe]
})
export class ClipsListComponent implements OnInit, OnDestroy {

  @Input() scrollable = true;

  constructor(public clipService: ClipService) { }

  ngOnInit(): void {
    if(this.scrollable) {
      window.addEventListener('scroll', this.handleScroll);
    }
  }

  ngOnDestroy() {
    if(this.scrollable) {
      window.removeEventListener('scroll', this.handleScroll);
    }
  }

  handleScroll = () => {
    const {scrollTop, offsetHeight} = document.documentElement;
    const { innerHeight } = window;

    const bottomOfWindow = Math.ceil(scrollTop) + offsetHeight >= innerHeight;

    console.log({bottomOfWindow, scrollTop, offsetHeight,total: Math.ceil(scrollTop)+offsetHeight, innerHeight})

    if(bottomOfWindow) {
      this.clipService.getClips();
    }
  }
}
