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
  showplayBookLogs: () => true | false;
  showVideoLogs: () => true | false;
  showPresenceLogs: () => true | false;
} => {
  const showZonesInOverview = () => false;
  const showDevTimeLogs = () => false;
  const showGarbageLogs = () => false;
  const showMoveLogs = () => false;
  const showSubtitleLogs = () => false;
  const showBuildLogs = () => false;
  const stateLogs = () => false;
  const sceneLogs = () => false;
  const showVisiterCodePopUp = () => false;
  const showplayBookLogs = () => false;
  const showVideoLogs = () => false;
  const showPresenceLogs = () => false;

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
    showplayBookLogs,
    showVideoLogs,
    showPresenceLogs,
  };
};

export default Development;
