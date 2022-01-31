const Development = (): {
  showZonesInOverview: () => true | false;
  showDevTimeLogs: () => true | false;
  showGarbageLogs: () => true | false;
  showMoveLogs: () => true | false;
  showSubtitleLogs: () => true | false;
} => {
  const showZonesInOverview = () => false;
  const showDevTimeLogs = () => true;
  const showGarbageLogs = () => false;
  const showMoveLogs = () => false;
  const showSubtitleLogs = () => false;

  return {
    showZonesInOverview,
    showDevTimeLogs,
    showGarbageLogs,
    showMoveLogs,
    showSubtitleLogs,
  }
}

export default Development;