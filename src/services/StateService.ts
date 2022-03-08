import Development from '@/Three/defaults.development'

export enum FlowState {
  welcome,
  countdownToFrame,
  storySelected,
  buildFrame,
  framePlaying,
  storyOverview,
  endCountdown,
  end
}

class StateService {

  private currentState: string
  private states: Array<string>

  constructor(_intitalState: FlowState) {
    this.currentState = FlowState[_intitalState]
    this.states = Object.keys(FlowState).filter(_k => isNaN(Number(_k)))
  }

  changeState(_state: FlowState) {
    this.currentState = FlowState[_state]
    if (Development().stateLogs()) {
      console.log('Flow state changed | ', this.currentState)
    }
    return this.currentState
  }

  getCurrentState() {
    if (Development().stateLogs()) {
      console.log('Flow state current | ', this.currentState)
    }
    return this.currentState
  }

  nextstState() {
    if (this.currentState != 'end') {
      const index = this.states.indexOf(this.currentState)
      const state = this.states[index]
      for (const _key of Object.keys(FlowState)) {
        if (_key == state) {
          this.currentState = FlowState[index + 1]
        }
      }
    }
    if (Development().stateLogs()) {
      console.log('Flow state updated | ', this.currentState)
    }
    return this.currentState
  }
}

export default StateService