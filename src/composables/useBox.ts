import { Entity, Relation } from 'coghent-vue-3-component-library/lib/queries'


export const getUnseenStories = (storyRelations: Array<Relation>) => {
  const storiesToSee: Array<Relation> = []
  for (const story of storyRelations) {
    if (story.seen_frames && story.total_frames) {
      if (story.seen_frames.length < story.total_frames) {
        storiesToSee.push(story)
      }
    } else {
      storiesToSee.push(story)
    }
  }
  return storiesToSee
}

export const getFirstStoryToSee = (storyRelations: Array<Relation>) => {
  if (storyRelations.length > 0) {
    return storyRelations[0]
  }
}

export const getNextFrame = () => {

}
