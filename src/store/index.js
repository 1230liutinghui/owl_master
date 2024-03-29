import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

function createStore () {
  return new Vuex.Store({
    state: {
      isLogin: true,
      loginUserInfo: {},
      callStatus: '', // 状态, idle, calling, connected
      isInviter: false,
      isAccepted: false,
      meetingUserIdList: [],
      muteAudioUserIdList: []
    },
    mutations: {
      userLoginSuccess (state) {
        state.isLogin = true;
      },
      userLogoutSuccess (state) {
        state.isLogin = false;
        state.loginUserId = '';
      },
      setLoginUserInfo (state, payload) {
        const {userId, userSig} = payload;
        state.loginUserInfo = {
          userId, userSig
        }
      },
      updateIsInviter (state, isInviter) {
        state.isInviter = isInviter;
      },
      updateCallStatus (state, callStatus) {
        state.callStatus = callStatus;
      },
      userJoinMeeting (state, userId) {
        if (state.meetingUserIdList.indexOf(userId) === -1) {
          state.meetingUserIdList.push(userId);
        }
      },
      userAccepted (state, isAccepted) {
        state.isAccepted = isAccepted;
      },
      userLeaveMeeting (state, userId) {
        const index = state.meetingUserIdList.findIndex(item => item === userId);
        if (index >= 0) {
          state.meetingUserIdList.splice(index, 1);
        }
      },
      dissolveMeeting (state) {
        state.meetingUserIdList = [];
        state.muteAudioUserIdList = [];
      },
      updateMuteAudioUserIdList (state, userIdList) {
        state.muteAudioUserIdList = userIdList;
      }
    }
  });
}

const store = createStore();
export default store;
