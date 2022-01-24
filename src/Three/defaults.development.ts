const Development = (): {
  showZonesInOverview: () => true | false;
  showDevTimeLogs: () => true | false;
  showGarbageLogs: () => true | false;
} => {
  const showZonesInOverview = () => false;
  const showDevTimeLogs = () => false;
  const showGarbageLogs = () => false;

  return {
    showZonesInOverview,
    showDevTimeLogs,
    showGarbageLogs
  }
}

export default Development;