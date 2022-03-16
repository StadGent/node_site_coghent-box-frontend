import Development from '@/Three/defaults.development';
import axios from 'axios';
import Parser, * as SRT from 'srt-parser-2';

export type srtObject = {
  id: string;
  startTime: string;
  endTime: string;
  text: string;
}

export default class SubtitleService {
  private parser: Parser;

  public currentSubtitle = ''
  public currentSubtitleIndex = 1

  subtitles: Array<srtObject> = [];

  constructor() {
    this.parser = new SRT.default()
  }

  srtToJsonObjects(_srtFile: string) {
    return this.parser.fromSrt(_srtFile);
  }

  async downloadSRTFile(_url: string, _convertToJson = true) {
    let data: string | Array<srtObject> | null = null;
    if (_url) {
      _url = _url.replace('http','https')
      try {
        const response = await axios.get(_url);
        data = response.data;
        if (_convertToJson) {
          data = this.srtToJsonObjects(data as string);
          this.setSRTObjects(data);
        }
      } catch (error) {
        data = null
        console.error({error})
      }
    } else {
      data = null;
    }
    console.log('subtitles', data)
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
      _time = _time.slice(_time.indexOf(':', 1))
      const minutes = _time.slice(1, _time.indexOf(':', 1));
      convertedTime += parseInt(minutes) * 60;
      _time = _time.slice(_time.indexOf(':', 1))
      const seconds = _time.slice(1, _time.indexOf(',', 1));
      convertedTime += parseInt(seconds)
      _time = _time.slice(_time.indexOf(',', 1))
      const miliseconds = _time.slice(1, _time.length);
      convertedTime += parseInt(miliseconds) / 1000;
    }
    return convertedTime
  }

  getSubtitleForTime(_currentTime: number, _data: Array<srtObject>, _index: number) {
    const action = _data.filter(_objects => this.currentSubtitleIndex == parseInt(_objects.id))[0];
    console.log('action', action)

    if (_currentTime >= this.timeToSeconds(action.startTime)
      && _currentTime <= this.timeToSeconds(action.endTime)) {
      if (Development().showSubtitleLogs()) {
        console.log('| Subtitle Action');
        console.log('| currentAction startTime:', this.timeToSeconds(_data.filter(_objects => Number(action.id) == parseInt(_objects.id))[0].startTime));
        console.log('| currentAction endTime:', this.timeToSeconds(_data.filter(_objects => Number(action.id) == parseInt(_objects.id))[0].endTime));
        // console.log('| currentAction startTime:', this.timeToSeconds(_data.filter(_objects => Number(action.id) + 1 == parseInt(_objects.id))[0].startTime));
        // console.log('| currentAction endTime:', this.timeToSeconds(_data.filter(_objects => Number(action.id) + 1 == parseInt(_objects.id))[0].endTime));
        console.log(`| ${action.text}`)
        console.log('| --------------------------------');
      }
      this.currentSubtitle = action.text;

    } else {
      this.currentSubtitleIndex++
      const action = _data.filter(_objects => this.currentSubtitleIndex == parseInt(_objects.id))[0];
      this.currentSubtitle = action.text;
    }
    return {
      subtitle: this.currentSubtitle,
      index: this.currentSubtitleIndex,
    };
  }

  returnPreviousSubtitle(_index: number) {
    let previousText = '';
    if (_index > 1) {
      _index -= 1;
      const action = this.subtitles.filter(_action => _index == parseInt(_action.id))[0];
      previousText = action.text;
    }
    return previousText;
  }
}