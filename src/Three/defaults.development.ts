const Development = (): {
  showZonesInOverview: () => true | false;
  showDevTimeLogs: () => true | false;
  showGarbageLogs: () => true | false;
  showMoveLogs: () => true | false;
  showSubtitleLogs: () => true | false;
  showBuildLogs: () => true | false;
  stateLogs: () => true | false;
  sceneLogs: () => true | false;
  showVisiterCodePopUp: () => true | false;
} => {
  const showZonesInOverview = () => true;
  const showDevTimeLogs = () => true;
  const showGarbageLogs = () => false;
  const showMoveLogs = () => false;
  const showSubtitleLogs = () => true;
  const showBuildLogs = () => true;
  const stateLogs = () => false;
  const sceneLogs = () => false;
  const showVisiterCodePopUp = () => false;

  return {
    showZonesInOverview,
    showDevTimeLogs,
    showGarbageLogs,
    showMoveLogs,
    showSubtitleLogs,
    showBuildLogs,
    stateLogs,
    sceneLogs,
    showVisiterCodePopUp,
  };
};

export default Development;
