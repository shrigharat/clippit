import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { TabsContainerComponent } from './tabs-container/tabs-container.component';
import { TabComponent } from './tab/tab.component';
import { InputComponent } from './input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { EllipsisLoaderComponent } from './ellipsis-loader/ellipsis-loader.component';
import { EventBlockerDirective } from './directives/event-blocker.directive';
import { AlertComponent } from './alert/alert.component';
import { CopyToClipboardDirective } from './directives/copy-to-clipboard.directive';


@NgModule({
  declarations: [
    ModalComponent,
    TabsContainerComponent,
    TabComponent,
    InputComponent,
    EllipsisLoaderComponent,
    EventBlockerDirective,
    AlertComponent,
    CopyToClipboardDirective,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMaskModule.forRoot()
  ],
  exports: [
    ModalComponent,
    TabsContainerComponent,
    TabComponent,
    InputComponent,
    EllipsisLoaderComponent,
    EventBlockerDirective,
    AlertComponent,
    CopyToClipboardDirective,
  ]
})
export class SharedModule { }
