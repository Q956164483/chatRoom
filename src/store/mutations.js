export const mutations = {
  routerAni (state, value) {
    state.routerAni = value
  },
  isLoading (state, value) {
    state.isLoading = value
  },
  userInfo (state, value) {
    localStorage.setItem('userInfo', JSON.stringify(value))
    state.userInfo = value
  },
  groupList (state, value) {
    state.groupList = value
  },
  nowGroup (state, value) {
    localStorage.setItem('nowGroup', JSON.stringify(value))
    state.nowGroup = value
  },
  nowPrivate (state, value) {
    localStorage.setItem('nowPrivate', JSON.stringify(value))
    state.nowPrivate = value
  },
  nowRoomMsgList (state, value) {
    state.nowRoomMsgList = value
  },
  addRobotMsgList (state, value) {
    state.robotMsgList.push(value)
    localStorage.setItem('robotMsgList', JSON.stringify(state.robotMsgList))
  },
  receiveNews (state, value) {
    state.receiveNews = value
  },
  hasLogin (state, value) {
    state.hasLogin = value
  }
}
