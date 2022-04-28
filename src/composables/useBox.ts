import { StoryData } from '@/services/StoryService'

export const getUnseenStories = (_storyData: Array<StoryData>) => {
  const storiesToSee: Array<StoryData> = []
  for (const story of _storyData) {
    let totalOfFrames = 0
    if(story && story.totalOfFrames ){
      totalOfFrames = story.totalOfFrames
    }
    if (story && totalOfFrames > story.totalOfFramesSeen) {
      storiesToSee.push(story)
    }
  }
  return storiesToSee
}

export const getFirstStoryToSee = (_storiesdata: Array<StoryData>) => {
  if (_storiesdata.length > 0) {
    return _storiesdata[0]
  }
}
