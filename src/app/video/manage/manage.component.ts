import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import IClip from 'src/app/models/clip.model';
import {ClipService} from "src/app/services/clip.service";
import { ModalService } from 'src/app/services/modal.service';
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit {
  videoOrder = '1';
  clips: IClip[] = [];
  activeClip: IClip | null = null;
  sort$: BehaviorSubject<string>;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    private clipService: ClipService,
    private modalService: ModalService
  ) {
    this.sort$ = new BehaviorSubject(this.videoOrder);
    this.sort$.subscribe(console.log);
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((p: Params) => {
      // console.log('Params changed -> ', p['params'].sort);
      if (p['params'].sort) {
        console.log('Setting sort queryparam -> ', p['params'].sort);
        this.videoOrder = p['params'].sort === '2' ? p['params'].sort : '1';
        this.sort$.next(this.videoOrder);
      }
    });
    this.clipService.getUserClips(this.sort$).subscribe(docs => {
      this.clips = [];

      docs.forEach(doc => {
        this.clips.push({
          docID: doc.id,
          ...doc.data()
        });
      });
      console.log(this.clips);
    });
  }

  sort = (e: Event) => {
    const { value } = e.target as HTMLSelectElement;
    this.router.navigateByUrl(`/manage?sort=${value}`);
  };

  openModal(event: Event, clip: IClip) {
    event.preventDefault();
    this.activeClip = clip;
    this.modalService.toggleModal('editClip');
  }

  handleClipUpdate(updatedClip: any) {
    let clip = this.clips.find(clip => clip.docID === updatedClip.id);
    if(clip) {
      clip.title = updatedClip.title;
    }
  }

  async deleteClip($event: any, clip: IClip) {
    $event.preventDefault();

    await this.clipService.deleteClip(clip);

    this.clips = this.clips.filter(currClip => clip.docID !== currClip.docID);
  }
}
