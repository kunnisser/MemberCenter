const state = {
  state: {
    personInfo: {},
    ucInfo: {},
    cardInfo: {},
    myZoneIndex: 0,
    zoneIndex: 0
  },
  mutations: {
    setUserInfo (state, userinfo) {
      state.personInfo = userinfo.baseinfo;
      state.ucInfo = userinfo.detailinfo;
    },
    setPrizeInfo (state, prizeInfo) {
      state.cardInfo = prizeInfo;
    }
  }
};

export default state;
