import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appCopyToClipboard]'
})
export class CopyToClipboardDirective {

  @Input() clipID: string | undefined;

  @HostListener('click', ['$event'])
  async copyToClipboard($event: MouseEvent) {
    $event.preventDefault();

    if(!this.clipID) return;

    const url = `${location.origin}/clip/${this.clipID}`;
    await navigator.clipboard.writeText(url);

    alert('Link copied');
  }

  constructor() { }

}
