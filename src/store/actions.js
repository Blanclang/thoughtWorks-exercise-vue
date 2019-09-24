// import shop from '@/http/shop'
import * as types from './mutation-types';
export default {
  // 这里将mutation中的方法以action的形式输出，主要是组件中有使用mutation的方法，到时仅需引用mapActions即可，可按实际情况使用
  setToken ({state,commit },datas) {
    console.log(datas);
    commit(types.SET_TOKEN,datas)
  },
  removeTagsView ({state,commit},name) {
    return new Promise((resolve,reject) => {
      let route = {};
      for (let i = 0; i < state.tagsList.length; i++) {
        if (state.tagsList[i].name === name) {
          route = {...state.tagsList[i]};
          route.index = i;
          commit(types.REMOVE_TAG_VIEW,route);
          break;
        }
      }
      resolve(route);
    })
  }
}