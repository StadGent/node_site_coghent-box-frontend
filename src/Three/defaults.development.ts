const Development = (): {
  showZonesInOverview: () => true | false;
  showDevTimeLogs: () => true | false;
  showGarbageLogs: () => true | false;
  showMoveLogs: () => true | false;
} => {
  const showZonesInOverview = () => false;
  const showDevTimeLogs = () => false;
  const showGarbageLogs = () => false;
  const showMoveLogs = () => false;

  return {
    showZonesInOverview,
    showDevTimeLogs,
    showGarbageLogs,
    showMoveLogs,
  }
}

export default Development;