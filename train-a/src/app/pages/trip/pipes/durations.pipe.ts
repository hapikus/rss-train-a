import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durations',
  standalone: true
})
export class DurationsPipe implements PipeTransform {
  transform(duration: number): string {
    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    if (!hours) {
      return `${this.pad(minutes)}:${this.pad(seconds)}`;  
    }

    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
