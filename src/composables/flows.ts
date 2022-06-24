export const enum FlowStage {
  VIDEO = 'video',
  MENU = 'menu',
  FRAME = 'frame',
  ENDSESSION = 'endsession'
}

export const Flow = {
  start: [
    FlowStage.VIDEO,
    FlowStage.FRAME,
    FlowStage.MENU,
    FlowStage.ENDSESSION,
  ],
  normal: [
    FlowStage.MENU,
    FlowStage.FRAME,
    FlowStage.ENDSESSION,
  ],
  seenFullStory: [
    FlowStage.MENU,
    FlowStage.FRAME,
    FlowStage.ENDSESSION,
  ],
  customStory: [
    FlowStage.FRAME,
  ],
}

export type Flows = 'start' | 'normal' | 'seenFullStory' | 'customStory'


let activeFlow: Flows = 'start'

const useFlow = () => {
  const current = (): Flows => activeFlow
  const currentFlowStages = (): Array<FlowStage> => Flow[activeFlow].map(_stage => _stage)
  const showAction = (_stage: FlowStage) => currentFlowStages().includes(_stage)
  const setCurrent = (_flow: Flows) => activeFlow = _flow

  return {
    current,
    currentFlowStages,
    showAction,
    setCurrent,
  }
}

export default useFlow