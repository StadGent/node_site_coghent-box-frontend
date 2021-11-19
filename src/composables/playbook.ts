const PlayBook = (): {
  addToPlayBook: (func: any) => void;
  getPlayBookFunctions: () => Array<any>;
} => {
  const playbookFunctions: Array<Function> = [];
  const addToPlayBook = (func: Function) => {
    playbookFunctions.push(func as Function);
    console.log(`Added function to playbook => total ${playbookFunctions.length}`);
  };

  const getPlayBookFunctions = () => {
    return playbookFunctions;
  };

  return {
    addToPlayBook,
    getPlayBookFunctions,
  };
};

export default PlayBook;
