type DefaultImages = {
  story: {
    defaultIcon: string;
    checkmark: string;
  },
  pauseScreen : {
    man: string;
  },
  startOfSession : {
    arrow: string;
    scanQrCode: string;
  },
  endOfSession : {
    scanQrCode: string;
    touchtable: string;
    webPortal: string;
  },
}

const Images: DefaultImages = {
  story: {
    defaultIcon: '/images/Bucket.svg',
    checkmark: '/images/Checkmark.svg',
  },
  pauseScreen : {
    man: '/images/man.svg',
  },
  startOfSession : {
    arrow: '/images/arrow.svg',
    scanQrCode: '/images/scanQrCode.svg',
  },
  endOfSession : {
    scanQrCode: '/images/scanQrCode.svg',
    touchtable: '/images/touchtable.svg',
    webPortal: '/images/goToWebPortal.svg',
  }
};

export default Images;