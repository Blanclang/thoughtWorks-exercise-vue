import * as types from './mutation-types';

export default {
  changeStatusNavPhone ({state,commit},data) {
    commit(types.CHANGENAV_STATUS,data)
  }
}