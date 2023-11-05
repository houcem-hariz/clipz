import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safeURL'
})
export class SafeURLPipe implements PipeTransform {

  constructor(private sanitizer : DomSanitizer) {

  }
  transform(value: string) {
    // dangerours !!!
    return this.sanitizer.bypassSecurityTrustUrl(value);
  }

}
