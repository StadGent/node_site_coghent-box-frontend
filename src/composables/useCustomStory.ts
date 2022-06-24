import { BoxVisiter, Entity } from 'coghent-vue-3-component-library'

const useCustomStory = (_stories: Array<typeof Entity>, _boxVisiter: typeof BoxVisiter) => {

  const isCustom = async (): Promise<boolean> => {
    const checks: Array<boolean> = []
    const oneStory = await hasOneStory()
    checks.push(oneStory)
    if (oneStory) {
      const oneFrame = hasOneFrame()
      checks.push(oneFrame)
      if (oneFrame) {
        const isActiveBoxStory = await isAnActiveBoxStory(_boxVisiter.relations[0].key)
        checks.push(isActiveBoxStory)
      }
    }
    return checks.indexOf(false) === -1
  }

  const hasOneStory = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (_boxVisiter.relations) {
        _boxVisiter.relations.length === 1 ? resolve(true) : resolve(false)
      }
    })
  }

  const hasOneFrame = (): boolean => {
    return _boxVisiter.relations[0].total_frames && _boxVisiter.relations[0].total_frames === 1
  }

  const isAnActiveBoxStory = (_relationId: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      if (_stories && _stories.length > 0) {
        const found = _stories.find(story => story.id === _relationId.replaceAll(`entities/`, ''))
        found === undefined ? resolve(true) : resolve(false)
      }
    })
  }

  return {
    isCustom,
  }
}

export default useCustomStory