import { getMetadataOfTypeFromEntity } from 'coghent-vue-3-component-library'
import { Relation, Entity } from 'coghent-vue-3-component-library'
import Common from './common'

const PrepareWall = () => {
  const { removePrefixBeforeSlash } = Common()
  const prepareStories = async (_stories: Array<typeof Entity>) => {
    const updatedStories = []
    for (const story of _stories) {
      updatedStories.push(await prepareStory(story))
    }
    return updatedStories
  }

  const prepareStory = async (_story: typeof Entity) => {
    console.log(`PREPARE STORY | story`, _story)
    const theStory: typeof Entity = {}
    Object.assign(theStory, _story)
    theStory.frames = []
    theStory.frames = await prepareFrames(_story.frames)
    console.log(`PREPARE STORY | updated story`, theStory)

    return theStory
  }

  const prepareFrames = async (_frames: Array<typeof Entity>) => {
    const frames: Array<typeof Entity> = []
    if (_frames && _frames.length >= 1) {
      for (const frame of _frames) {
        const updatedFrame = await prepareFrame(frame)
        frames.push(updatedFrame)
      }
    }
    return frames
  }

  const prepareFrame = async (_frame: typeof Entity) => {
    const frame: typeof Entity = {}
    if (_frame) {
      Object.assign(frame, _frame)
      frame.assets = await filterOutAssetWithoutMediafileLocation(frame)
      frame.assets = await filterOutAssetsWithPublicationStatusNotPublic(frame)
      frame.relationMetadata = await updateRelationMetadataForAssets(frame)
    }
    return _frame ? frame : null
  }

  const filterOutAssetWithoutMediafileLocation = async (_frame: typeof Entity) => {
    const assets: Array<typeof Entity> = []
    if (_frame.assets && _frame.assets.length >= 1) {
      for (const asset of _frame.assets) {
        const hasMediafile = await checkEntityOnMediafile(asset)
        hasMediafile === true ? assets.push(asset) : null
      }
    }
    return assets
  }

  const filterOutAssetsWithPublicationStatusNotPublic = async (_frame: typeof Entity) => {
    const updatedAssets: Array<typeof Entity> = []
    if (_frame.assets && _frame.assets.length >= 1) {
      for (const asset of _frame.assets) {
        const status = getMetadataOfTypeFromEntity(asset, `publication_status`)
        if (status === undefined) {
          updatedAssets.push(asset)
        } else {
          if (status && status.value === `publiek`) {
            updatedAssets.push(asset)
          }
        }
      }
    }
    return updatedAssets
  }

  const checkEntityOnMediafile = async (_asset: typeof Entity) => {
    return new Promise((resolve, reject) => {
      const checks: Array<boolean> = []
      if (_asset.mediafiles && _asset.mediafiles.length >= 1) {
        resolve(true)
        // extra checks
        // mediafiles_location
        // transcode_location
        // etc..
      } else resolve(false)
    })
  }

  const updateRelationMetadataForAssets = async (_frame: typeof Entity) => {
    return new Promise((resolve, reject) => {
      const relationMetadata: Array<typeof Relation> = []
      if (_frame.assets && _frame.assets.length >= 1) {
        if (_frame.relationMetadata && _frame.relationMetadata.length >= 1) {
          for (const asset of _frame.assets) {
            const found = _frame.relationMetadata.filter((_relation: typeof Relation) => removePrefixBeforeSlash(_relation.key) === asset.id)
            if (found) {
              relationMetadata.push(...found)
            }
          }
        }
        resolve(relationMetadata)
      }
      resolve(relationMetadata)
    })
  }

  return {
    prepareStories,
    prepareStory,
  }
}

export default PrepareWall