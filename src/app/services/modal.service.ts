import { Injectable } from '@angular/core';

interface IModal {
  id: string;
  visible: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private modals: IModal[] = [];

  isModalOpen = (id: string): boolean => {
    return !!this.modals.find((e) => e.id === id)?.visible;
  };

  toggleModal = (id: string) => {
    let modObj = this.modals.find((e) => e.id === id);
    if (modObj) {
      modObj.visible = !modObj.visible;
    }
  };

  register = (id: string) => {
    let alreadyExists = this.modals.find((e) => e.id == id);
    console.log({alreadyExists});
    if (alreadyExists) return;
    this.modals.push({
      id,
      visible: false,
    });
    console.log(id + ' modal registered');
    console.log({ modals: this.modals });
  };

  unRegister = (id: string) => {
    this.modals = this.modals.filter((e) => e.id !== id);
    console.log(id + ' modal un-registered');
    console.log({ modals: this.modals });
  };

  constructor() {}
}
