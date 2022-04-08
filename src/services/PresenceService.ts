import Development from '@/Three/defaults.development';
import TaggingHelper from '@/Three/helper.tagging';
import { Vector3 } from 'three';
import TaggingService, { Tags } from './TaggingService';
import ThreeService from './ThreeService';

export default class PresenceService {
  private threeService: ThreeService
  private taggingService: TaggingService

  constructor(_threeService: ThreeService, _taggingService: TaggingService) {
    this.threeService = _threeService
    this.taggingService = _taggingService
  }

  private title(_titleObject: string) {
    if (Development().showPresenceLogs()) {
      console.log('------------------')
      console.log(`${_titleObject}:`)
    }
  }
  private present(_object: string) {
    if (Development().showPresenceLogs()) {
      console.log(`✅  ${_object}`)
    }
  }
  private notFound(_object: string) {
    if (Development().showPresenceLogs()) {
      console.log(`❌  ${_object}`)
    }
  }

  activeStoryCircle() {
    const activeCircleObjects = TaggingHelper(this.taggingService).getActiveStoryCircle()
    this.title('activeCircleObjects')
    let property: keyof typeof activeCircleObjects
    for (property in activeCircleObjects) {
      const element = activeCircleObjects[property] as any
      element != undefined ? this.present(property) : this.notFound(property)
    }
  }

  activeFrameRingPosition(_from: Vector3, _to: Vector3) {
    this.title('activeFrameRingPosition')
    const frameRing = this.taggingService.getByTag(Tags.ActiveStoryCircleFrameRing)
    if (frameRing && frameRing[0] && frameRing[0].object) {
      this.present('frameRing array of objects')

      for (const _group of frameRing[0].object) {
        if (_group.position) {
          _group.position.x === _to.x ? this.present(`Current x: ${_group.position.x} y: ${_group.position.y} z: ${_group.position.z}`) : this.notFound(`Current x: ${_group.position.x} y: ${_group.position.y} z: ${_group.position.z}`)
        }
      }
    } else {
      this.notFound("frameRing array of objects")
    }

  }

  overviewStoryCircles(_storyIds: Array<string>) {
    this.title('overviewStoryCircles')
    if (_storyIds.length >= 0) {
      for (const id of _storyIds) {
        const circleObjects = this.taggingService.getByTagsId(id)
        if (circleObjects.length >= 0) {
          this.present(`Found objects for ID: ${id}`)
          for (const object of circleObjects) {
            object.object ? this.present(object.tag) : this.notFound(object.tag)
          }
          if (Development().showPresenceLogs()) console.log('------------------')
        } else this.notFound(`Couldn't find objects for ID: ${id}`)
      }
    }

  }
}