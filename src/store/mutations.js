import * as types from './mutation-types'

export default {
  [types.SET_TOKEN] (state,data) {
    state.token = data
  },
  [types.SET_USER_INFO] (state,data) {
    state.userInfo = data;
  },
  [types.CLEAR_USER_INFO] (state,data) {
    state.userInfo = {};
  },
  [types.ADD_TAG_VIEW] (state,data) {
    let flag = state.tagsList.some(item => item.name === data.name);
    if (!!flag) { //已经打开过该页面
      return false;
    }

    //name重复的页面或者noCache为true就不要添加到keep-alive了
    if (!state.cacheList.some(item => item.name === data.name) && !data.meta.noCache) {
      state.cacheList.push({...data});
    }

    //tag和keep-alive分开两个数组保存，因为多级页面共用一个tab，但keep-alive即都需要缓存起来
    let index = state.tagsList.findIndex(item => item.meta.p === data.meta.p);
    if (index !== -1) { //如果是二级页面，比如详情页面，就把父页面替换成当前的详情页面
      state.tagsList.splice(index,1,data);
      return false;
    }
    state.tagsList.push({...data});
  },
  [types.REMOVE_TAG_VIEW] (state,route) {
    state.tagsList.splice(route.index,1);

    //如果删除的是多级页面，即在keep-alive列表里找出与这个页面meta.p相同的都删除
    let newList = [];
    state.cacheList.forEach((item,index) => {
      if (item.meta.p !== route.meta.p) {
        newList.push(item);
      }
    });
    state.cacheList = newList;
  },
  [types.REMOVE_CACHE] (state,routeName) { //手动删除keep-alive缓存，防止打开二级页面时无法刷新页面
    let index = state.cacheList.findIndex(item => item.name === routeName);
    index !== -1 && state.cacheList.splice(index,1);
  }
}