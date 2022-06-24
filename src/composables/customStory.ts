import { BoxVisiter } from 'coghent-vue-3-component-library'

const useCustomStory = () => {

  const isCustom = async (_boxVisiter: typeof BoxVisiter): Promise<boolean> => {
    const checks: Array<boolean> = []
    const oneStory = await hasOneStory(_boxVisiter)
    checks.push(oneStory)
    if (oneStory) {
      const oneFrame = hasOneFrame(_boxVisiter)
      checks.push(oneFrame)
    }
    return checks.indexOf(false) === -1
  }

  const hasOneStory = (_boxVisiter: typeof BoxVisiter): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (_boxVisiter.relations) {
        _boxVisiter.relations.length === 1 ? resolve(true) : resolve(false)
      }
    })
  }

  const hasOneFrame = (_boxVisiter: typeof BoxVisiter): boolean => {
    return _boxVisiter.relations[0].total_frames && _boxVisiter.relations[0].total_frames === 1
  }

  return {
    isCustom,
  }
}

export default useCustomStory