export const state = {
  isLoading: false,
  routerAni: '',
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : '',
  groupList: [],
  nowGroup: localStorage.getItem('nowGroup') ? JSON.parse(localStorage.getItem('nowGroup')) : {},
  nowPrivate: localStorage.getItem('nowPrivate') ? JSON.parse(localStorage.getItem('nowPrivate')) : {},
  nowRoomMsgList: [],
  robotMsgList: localStorage.getItem('robotMsgList') ? JSON.parse(localStorage.getItem('robotMsgList')) : [],
  receiveNews: '',
  hasLogin: 0
}
