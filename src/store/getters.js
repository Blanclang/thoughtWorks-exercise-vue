export default {
  getUserInfo: (state) => state.userInfo,
  getMenu: (state) => state.userInfo.resources || [],
  getCompanyCode: (state) => (state.userInfo.company && state.userInfo.company.code) || '',
  getUserCode: (state) => state.userInfo.code || '',
  getToken: (state) => state.token || '',
  getTagsList: (state) => state.tagsList || [],
  getCompanyInfo: (state) => state.userInfo.company || {},
  getCacheList: (state) => state.cacheList || [],
  getCarriersCode: (state) => (state.userInfo.company && state.userInfo.company.carriersCode) || '',
}