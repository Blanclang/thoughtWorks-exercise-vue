import * as types from './mutation-types'

export default {
  [types.CHANGENAV_STATUS] (state,data) {
    state.navStatus = data;
  }
}