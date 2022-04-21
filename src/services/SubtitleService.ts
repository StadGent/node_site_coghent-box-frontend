import Development from '@/Three/defaults.development';
import axios from 'axios';
import Parser, * as SRT from 'srt-parser-2';

export type srtObject = {
  id: string;
  startTime: string;
  endTime: string;
  text: string;
};

export default class SubtitleService {
  private parser: Parser;
  private readonly defaultSrtIndex = 1;

  public currentSubtitle = '';
  public currentSubtitleIndex = 1;

  subtitles: Array<srtObject> | null = null;

  constructor() {
    this.parser = new SRT.default();
  }

  srtToJsonObjects(_srtFile: string) {
    return this.parser.fromSrt(_srtFile);
  }

  async downloadSRTFile(_url: string, _convertToJson = true) {
    let data: string | Array<srtObject> | null = null;
    if (_url) {
      if (!_url.includes('https')) {
        _url = _url.replace('http', 'https');
      }
      try {
        const response = await axios.get(_url);
        data = response.data;
        if (_convertToJson) {
          data = this.srtToJsonObjects(data as string);
          this.setSRTObjects(data);
        }
      } catch (error) {
        data = null;
        console.error({ error });
      }
    } else {
      data = null;
    }
    if (Development().showSubtitleLogs()) console.log('subtitles', data);
    return data;
  }

  setSRTObjects(_objects: Array<srtObject>) {
    this.subtitles = _objects;
  }

  private checkTime(_time: string) {
    const regexP: RegExp = /[0-9]{2}:[0-9]{2}:[0-9]{2},[0-9]{3}/;
    return regexP.test(_time);
  }

  timeToSeconds(_time: string) {
    let convertedTime = 0;
    if (this.checkTime(_time)) {
      const hours = _time.slice(0, _time.indexOf(':', 1));
      convertedTime += parseInt(hours) * 3600;
      _time = _time.slice(_time.indexOf(':', 1));
      const minutes = _time.slice(1, _time.indexOf(':', 1));
      convertedTime += parseInt(minutes) * 60;
      _time = _time.slice(_time.indexOf(':', 1));
      const seconds = _time.slice(1, _time.indexOf(',', 1));
      convertedTime += parseInt(seconds);
      _time = _time.slice(_time.indexOf(',', 1));
      const miliseconds = _time.slice(1, _time.length);
      convertedTime += parseInt(miliseconds) / 1000;
    }
    return convertedTime;
  }

  getSrtForTime(_currentTime: number) {
    let srtLineToDisplay = null;
    if (this.subtitles) {
      for (const srt of this.subtitles) {
        if (
          _currentTime > this.timeToSeconds(srt.startTime) - 0.25 &&
          _currentTime <= this.timeToSeconds(srt.endTime) + 0.25
        ) {
          console.log(srt);
          srtLineToDisplay = srt;
          if (Development().showSubtitleLogs()) console.log(`${srt.id}. `, srt.text);
        }
      }
    }
    return srtLineToDisplay;
  }

  getCurrentSubtitleText(_currentTime: number) {
    const srtSection = this.getSrtForTime(_currentTime);
    if (srtSection) {
      this.currentSubtitle = srtSection.text;
      this.currentSubtitleIndex = Number(srtSection.id);
    } else this.currentSubtitle = '';
    return this.currentSubtitle;
  }

  returnPreviousSubtitle(_index: number) {
    let previousText = '';
    if (_index > 1 && this.subtitles) {
      _index -= 1;
      const action = this.subtitles.filter(
        (_action) => _index == parseInt(_action.id),
      )[0];
      previousText = action.text;
    }
    return previousText;
  }

  reset() {
    this.subtitles = null;
    this.currentSubtitleIndex = this.defaultSrtIndex;
  }
}
