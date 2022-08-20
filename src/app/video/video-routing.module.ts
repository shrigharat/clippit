import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClipComponent } from '../clip/clip.component';
import { ManageComponent } from './manage/manage.component';
import { UploadComponent } from './upload/upload.component';
import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
} from '@angular/fire/compat/auth-guard';
import { ClipService } from '../services/clip.service';

const redirectUnauthorizedToHome = () => redirectUnauthorizedTo('/');

const routes: Routes = [
  {
    path: 'manage',
    component: ManageComponent,
    data: { authOnly: true, authGuardPipe: redirectUnauthorizedToHome },
    canActivate: [AngularFireAuthGuard],
  },
  {
    path: 'upload',
    component: UploadComponent,
    data: { authOnly: true, authGuardPipe: redirectUnauthorizedToHome },
    canActivate: [AngularFireAuthGuard],
  },
  {
    path: 'clip/:id',
    component: ClipComponent,
    data: { authOnly: true, authGuardPipe: redirectUnauthorizedToHome },
    canActivate: [AngularFireAuthGuard],
    resolve: {
      clip: ClipService
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoRoutingModule {}
