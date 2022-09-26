import { BoxVisiter, Entity, Metadata, Relation, RelationType } from 'coghent-vue-3-component-library'

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

  const getStoriesFromBoxVisiterRelations = (): Array<typeof Relation> => {
    const storyAndStoryboxes = [];
    for (const relation of _boxVisiter.relations) {
      if (relation.type === RelationType.Stories) {
        storyAndStoryboxes.push(relation)
      }
    }
    return storyAndStoryboxes;
  }

  const hasOneStory = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const relations = getStoriesFromBoxVisiterRelations();
      if (relations) {
        relations.length === 1 ? resolve(true) : resolve(false)
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

  const getStoryId = async (): Promise<string> => {
    const hasSingleStory = await hasOneStory()
    let id = ''
    if (hasSingleStory) {
      _boxVisiter.relations[0].key ? id = _boxVisiter.relations[0].key.replaceAll(`entities/`, '') : ''
    }
    return id
  }

  const getEntityTitle = async (_entity: typeof Entity): Promise<string | null> => {
    return new Promise((resolve, reject) => {
      if (_entity && _entity.title && _entity.title[0]) resolve(_entity.title[0].value)
      else resolve(null)
    })
  }

  const swapFrameTitleWithStoryTitle = async (_activeStory: typeof Entity, _frameTitle: string): Promise<typeof Entity> => {
    const story = {} as typeof Entity
    Object.assign(story, _activeStory)
    const storyTitle = await getEntityTitle(_activeStory)
    if (storyTitle != null && _frameTitle !== storyTitle) {
      const tmpMeta = {} as typeof Metadata
      Object.assign(tmpMeta, story.title[0])
      tmpMeta.value = _frameTitle
      story.title = [tmpMeta]
    }
    return story
  }

  const setTitleOfFrameAsStoryTitle = async (_activeStory: typeof Entity): Promise<typeof Entity> => {
    if (_activeStory.frames && _activeStory.frames.length === 1) {
      const frame = _activeStory.frames[0]
      const frameTitle = await getEntityTitle(frame)
      frameTitle != null ? _activeStory = await swapFrameTitleWithStoryTitle(_activeStory, frameTitle) : null
    }
    return _activeStory
  }

  return {
    isCustom,
    getStoryId,
    setTitleOfFrameAsStoryTitle,
  }
}

export default useCustomStory