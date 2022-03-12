export const tweenPromise = (tween: any) => {
  return new Promise((resolve) => {
    tween.onComplete(resolve);
    tween.onStop(resolve);
  });
};
