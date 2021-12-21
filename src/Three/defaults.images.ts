type DefaultImages = {
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