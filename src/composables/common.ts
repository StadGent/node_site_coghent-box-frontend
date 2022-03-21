import { Mesh, Vector3 } from 'three';

export type SensorObject = {
  topic: string;
  id: number;
  msg: boolean;
}

const Common = (): {
  FilterOutIdAfterSlash: (str: string) => string;
  RemoveEntersFromString: (str: string) => string;
  pixelsToMeters: (pixels: number) => number;
  firstIsBiggest: (first: number, second: number) => boolean;
  awaitTimeout: (time: number) => Promise<unknown>;
  setScale: (_object: Mesh, scale: number) => void;
  setPosition: (_object: Mesh, _position: Vector3) => void;
  getFilenameFromStorageLink: (_storageAPILink: string, _download: string) => string
  fillStringToIdealLength: (_title: string) => string
  getCodeFromString: (_string: string) => string | null
  getUrlParamValue: (_searchParam: string) => string | null
  isVideo: (_url: string) => boolean
} => {
  const FilterOutIdAfterSlash = (str: string) => {
    const index = (str.indexOf('/') as number) + 1;
    const id = str.slice(index);
    return id;
  };

  const RemoveEntersFromString = (str: string) => {
    return str.replace(/\n/g, '');
  };

  const pixelsToMeters = (pixels: number) => {
    return pixels
    // return pixels * Defaults().pixelInMeter();
  };

  const firstIsBiggest = (first: number, second: number) => {
    return first > second;
  }

  const awaitTimeout = (time: number) => {
    return new Promise((resolve) =>
      setTimeout(resolve, time),
    );
  }
  const setScale = (_object: Mesh, scale: number) => {
    _object.scale.set(scale, scale, scale);
  }

  const setPosition = (_object: Mesh, _position: Vector3) => {
    _object.position.set(_position.x, _position.y, _position.z);
  };

  const getFilenameFromStorageLink = (_storageAPILink: string, _download: string) => {
    // FORMAT https://api-uat.collectie.gent/storage/v1/download/3d4c1271e69f2b9a0a913144a9718f27-08575.JPG
    const endIndexOfDownload = _storageAPILink.indexOf(_download) + _download.length
    const filename = _storageAPILink.split('').splice(endIndexOfDownload).join('')
    return filename
  }

  const fillStringToIdealLength = (_title: string) => {
    let theString = _title
    const idealString = 'Antropomorfe vaas in aardewerk ';
    if (_title.length < idealString.length) {
      // console.log(idealString.length);
      const strginArray = _title.split('');
      // console.log(strginArray);
      const halfOfstring = Math.floor(strginArray.length / 2);
      // console.log(halfOfstring);
      const halfstringArray = strginArray.splice(halfOfstring);
      // console.log(halfstringArray);
      const lengthidealstringHalf = idealString.length / 2;
      const half = []
      for (let index = 0;index < lengthidealstringHalf - halfOfstring + 1;index++) {
        if (halfstringArray[index]) {
          half[index] = halfstringArray[index];
        } else {
          half[index] = ' ';
        }
      }
      const sechalf = []
      const halfstringArrayBegin = strginArray.splice(0, halfOfstring).reverse();
      // console.log(halfstringArrayBegin);
      for (let index = 0;index < lengthidealstringHalf - halfOfstring + 1;index++) {
        if (halfstringArrayBegin[index]) {
          sechalf[index] = halfstringArrayBegin[index];
        } else {
          sechalf[index] = ' ';
        }
      }
      // console.log(half.join(''))

      // console.log(sechalf.reverse().join(''))
      const firstHalf = sechalf.reverse()
      // console.log({ firstHalf })
      const secondHalf = half
      const newString = [...sechalf.reverse(), ...secondHalf]
      // console.log(newString.join(''))
      theString = newString.join('')
    }
    return theString

  }

  const getCodeFromString = (_string: string) => {
    const regex: RegExp = new RegExp('[0-9]{8}');
    let code: any = null
    if (regex.test(_string)) {
      const regexResult = regex.exec(_string)
      if (regexResult) code = regexResult[0]
    }
    return code
  }

  const getUrlParamValue = (_searchParam: string) => {
    const urlParams = window.location.search;
    const params = new URLSearchParams(urlParams);
    return params.get(_searchParam)
  };

  const isVideo = (_url: string) => {
    let includes = false
    const extensions = ['.mp4', '.mov']
    extensions.forEach(ext => {
      if (_url.includes(ext)) includes = true
    })
    return includes
  }

  return {
    FilterOutIdAfterSlash,
    RemoveEntersFromString,
    pixelsToMeters,
    firstIsBiggest,
    awaitTimeout,
    setScale,
    setPosition,
    getFilenameFromStorageLink,
    fillStringToIdealLength,
    getCodeFromString,
    getUrlParamValue,
    isVideo
  };
};

export default Common;
