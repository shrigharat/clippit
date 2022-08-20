import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import IClip from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: IClip | null = null;
  showAlert = false;
  alertColor = '';
  alertTitle = '';
  inSubmission = false;
  @Output() clipUpdated = new EventEmitter<any>();

  //'rgba(58, 240, 61)'

  clipID = new FormControl('');
  title = new FormControl('', [Validators.required, Validators.minLength(5)]);

  editForm = new FormGroup({
    title: this.title,
    id: this.clipID,
  });

  constructor(
    private modalService: ModalService,
    private clipService: ClipService
  ) {}

  submit() {
    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'rgba(68, 44, 222)';
    this.alertTitle = 'Please wait! Updating clip...';
    this.clipService
      .updateClip(this.clipID.value!, this.title.value!)
      .then((response) => {
        this.inSubmission = false;
        this.showAlert = true;
        this.alertColor = 'rgba(58, 240, 61)';
        this.alertTitle = 'Clip updated Succesfully';
        this.clipUpdated.emit({
          id: this.clipID.value!,
          title: this.title.value!,
        });
      })
      .catch((e) => {
        this.inSubmission = false;
        this.showAlert = true;
        this.alertColor = 'rgba(58, 240, 61)';
        this.alertTitle = 'An error occurred!';
        console.error(e);
      });
    return false;
  }

  ngOnInit(): void {
    this.modalService.register('editClip');
  }

  ngOnChanges() {
    if (!this.activeClip) return;

    this.inSubmission = false;
    this.showAlert = false;

    if (this.activeClip.docID) {
      this.clipID.setValue(this.activeClip.docID);
      this.title.setValue(this.activeClip.title);
    }
  }

  ngOnDestroy() {
    this.modalService.unRegister('editClip');
  }
}
