const Development = (): {
  showZonesInOverview: () => true | false;
  showDevTimeLogs: () => true | false;
  showGarbageLogs: () => true | false;
  showMoveLogs: () => true | false;
  showSubtitleLogs: () => true | false;
  showBuildLogs: () => true | false;
  stateLogs: () => true | false;
} => {
  const showZonesInOverview = () => false;
  const showDevTimeLogs = () => false;
  const showGarbageLogs = () => false;
  const showMoveLogs = () => false;
  const showSubtitleLogs = () => false;
  const showBuildLogs = () => false;
  const stateLogs = () => true;

  return {
    showZonesInOverview,
    showDevTimeLogs,
    showGarbageLogs,
    showMoveLogs,
    showSubtitleLogs,
    showBuildLogs,
    stateLogs,
  }
}

export default Development;