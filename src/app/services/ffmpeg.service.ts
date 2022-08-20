import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root',
})
export class FfmpegService {
  isReady = false;
  private ffmpeg;
  isRunning: boolean = false;

  constructor() {
    this.ffmpeg = createFFmpeg({ log: true });
    this.init();
  }

  async getScreenshots(file: File) {
    this.isRunning = true;
    const data = await fetchFile(file);
    const seconds = [1, 2, 3];
    const commands: string[] = [];

    seconds.forEach((second) => {
      commands.push(
        //input options
        '-i',
        file.name,
        //output options
        '-ss', `00:00:0${second}`,
        '-frames:v', '1',
        '-filter:v', 'scale=510:-1',
        //output settings
        `output_0${second}.png`
      );
    });

    this.ffmpeg.FS('writeFile', file.name, data);

    await this.ffmpeg.run(...commands);

    const screenshots:string[] = [];

    seconds.forEach(second => {
      const screenshotFile = this.ffmpeg.FS('readFile', `output_0${second}.png`);

      const screenshotBlob = new Blob(
        [screenshotFile.buffer], {
          type: 'image/png'
        }
      );

      const screenshotUrl = URL.createObjectURL(screenshotBlob);
      screenshots.push(screenshotUrl);
    })

    this.isRunning = false;

    return screenshots;
  }

  async init() {
    if (this.isReady) return;

    await this.ffmpeg.load();

    this.isReady = true;
  }

  async blobFromUrl(url: string) {
    const response = await fetch(url);
    const data = await response.blob();
    return data;
  }
}
