<template>
  <div id="app">
    <router-view></router-view>
    <el-dialog :title="callTypeDisplayName" :visible.sync="isShowNewInvitationDialog" width="400px">
      <span>{{ this.getNewInvitationDialogContent() }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleRejectCall">Reject</el-button>
        <el-button type="primary" @click="handleAccept">Accept</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapState} from "vuex";
// import { reactive } from 'vue'
import {log} from "./utils";
import {getUsernameByUserid} from "./service";
// import { meetPerson, initClient, initLocalStream, addFar } from './video.js'
// import config from "./config";
//import makeAsr from './audio.js'
import ASR from "../sdkmain/examples/trtc/asr.esm.js";

let timeout;

//var roomIDget = ''

// const state = reactive({
//   userSig: '',
//   applicant: '',
//   mediator: '123',
//   respondent: '234',
//   roomId: '',
//   SDKAPPID: config.SDKAppID
// })

export default {
  name: "App",
  computed: mapState({
    isLogin: state => state.isLogin,
    loginUserInfo: state => state.loginUserInfo,
    callStatus: state => state.callStatus,
    isAccepted: state => state.isAccepted,
    meetingUserIdList: state => state.meetingUserIdList,
    muteVideoUserIdList: state => state.muteVideoUserIdList,
    muteAudioUserIdList: state => state.muteAudioUserIdList
  }),
  async created() {
    this.initListener();
  },
  data() {
    return {
      isInviterCanceled: false,
      isShowNewInvitationDialog: false,
      inviterName: "",
      callTypeDisplayName: "",
      inviteData: {},
      inviteID: "",
      activeIndex: this.$route.path
    };
  },
  destroyed() {
    this.removeListener();
  },
  methods: {
    handleSelect(key) {
      if (key === this.$route.path) {
        return
      }
      this.$router.push(key)
    },
    initListener: function () {
      this.$trtcCalling.on(this.TrtcCalling.EVENT.ERROR, this.handleError);
      this.$trtcCalling.on(
          this.TrtcCalling.EVENT.INVITED,
          this.handleNewInvitationReceived
      );
      this.$trtcCalling.on(
          this.TrtcCalling.EVENT.USER_ACCEPT,
          this.handleUserAccept
      );
      this.$trtcCalling.on(
          this.TrtcCalling.EVENT.USER_ENTER,
          this.handleUserEnter
      );
      this.$trtcCalling.on(
          this.TrtcCalling.EVENT.USER_LEAVE,
          this.handleUserLeave
      );
      this.$trtcCalling.on(
          this.TrtcCalling.EVENT.REJECT,
          this.handleInviteeReject
      );
      this.$trtcCalling.on(
          this.TrtcCalling.EVENT.LINE_BUSY,
          this.handleInviteeLineBusy
      );
      this.$trtcCalling.on(
          this.TrtcCalling.EVENT.CALLING_CANCEL,
          this.handleInviterCancel
      );
      this.$trtcCalling.on(
          this.TrtcCalling.EVENT.KICKED_OUT,
          this.handleKickedOut
      );
      this.$trtcCalling.on(
          this.TrtcCalling.EVENT.CALLING_TIMEOUT,
          this.handleCallTimeout
      );
      this.$trtcCalling.on(
          this.TrtcCalling.EVENT.NO_RESP,
          this.handleNoResponse
      );
      this.$trtcCalling.on(
          this.TrtcCalling.EVENT.CALLING_END,
          this.handleCallEnd
      );
      this.$trtcCalling.on(
          this.TrtcCalling.EVENT.USER_VIDEO_AVAILABLE,
          this.handleUserVideoChange
      );
      this.$trtcCalling.on(
          this.TrtcCalling.EVENT.USER_AUDIO_AVAILABLE,
          this.handleUserAudioChange
      );
    },
    removeListener: function () {
      this.$trtcCalling.off(this.TrtcCalling.EVENT.ERROR, this.handleError);
      this.$trtcCalling.off(
          this.TrtcCalling.EVENT.INVITED,
          this.handleNewInvitationReceived
      );
      this.$trtcCalling.off(
          this.TrtcCalling.EVENT.USER_ACCEPT,
          this.handleUserAccept
      );
      this.$trtcCalling.off(
          this.TrtcCalling.EVENT.USER_ENTER,
          this.handleUserEnter
      );
      this.$trtcCalling.off(
          this.TrtcCalling.EVENT.USER_LEAVE,
          this.handleUserLeave
      );
      this.$trtcCalling.off(
          this.TrtcCalling.EVENT.REJECT,
          this.handleInviteeReject
      );
      this.$trtcCalling.off(
          this.TrtcCalling.EVENT.LINE_BUSY,
          this.handleInviteeLineBusy
      );
      this.$trtcCalling.off(
          this.TrtcCalling.EVENT.CALLING_CANCEL,
          this.handleInviterCancel
      );
      this.$trtcCalling.off(
          this.TrtcCalling.EVENT.KICKED_OUT,
          this.handleKickedOut
      );
      this.$trtcCalling.off(
          this.TrtcCalling.EVENT.CALLING_TIMEOUT,
          this.handleCallTimeout
      );
      this.$trtcCalling.off(
          this.TrtcCalling.EVENT.NO_RESP,
          this.handleNoResponse
      );
      this.$trtcCalling.off(
          this.TrtcCalling.EVENT.CALLING_END,
          this.handleCallEnd
      );
      this.$trtcCalling.off(
          this.TrtcCalling.EVENT.USER_VIDEO_AVAILABLE,
          this.handleUserVideoChange
      );
      this.$trtcCalling.off(
          this.TrtcCalling.EVENT.USER_AUDIO_AVAILABLE,
          this.handleUserAudioChange
      );
    },
    handleError: function () {
    },
    handleNewInvitationReceived: async function (payload) {
      const {inviteID, sponsor, inviteData} = payload;
      log(`handleNewInvitationReceived ${JSON.stringify(payload)}`);
      if (inviteData.callEnd) {
        // The last user sends an invitation to hang up the call
        // 最后一个人发送 invite 进行挂断
        this.$store.commit("updateCallStatus", "idle");
        return;
      }
      if (sponsor === this.loginUserInfo.userId) {
        // You are the inviter. The same account can log in on multiple devices
        // 邀请人是自己, 同一个账号有可能在多端登录
        return;
      }
      // Here, busy line needs to be considered
      // 这里需要考虑忙线的情况
      if (this.callStatus === "calling" || this.callStatus === "connected") {
        await this.$trtcCalling.reject({inviteID, isBusy: true});
        return;
      }

      const {callType} = inviteData;
      this.inviteData = inviteData;
      this.inviteID = inviteID;
      this.isInviterCanceled = false;
      this.$store.commit("updateIsInviter", false);
      this.$store.commit("updateCallStatus", "calling");
      const userName = sponsor;
      this.inviterName = userName;
      this.callTypeDisplayName =
          callType === this.TrtcCalling.CALL_TYPE.AUDIO_CALL
              ? "Audio Call"
              : "Video Call";
      this.isShowNewInvitationDialog = true;
    },
    getNewInvitationDialogContent: function () {
      return `From ${this.inviterName} to ${this.callTypeDisplayName}`;
    },
    handleRejectCall: async function () {
      try {
        const {callType} = this.inviteData;
        await this.$trtcCalling.reject({
          inviteID: this.inviteID,
          isBusy: false,
          callType
        });
        this.dissolveMeetingIfNeed();
      } catch (e) {
        this.dissolveMeetingIfNeed();
      }
    },

    handleAccept: function () {
      this.handleDebounce(this.handleAcceptCall(), 500);
    },

    handleDebounce: function (func, wait) {
      let context = this;
      let args = arguments;
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(context, args);
      }, wait);
    },

    handleAcceptCall: async function () {
      try {
        const {callType, roomID} = this.inviteData;
        //roomIDget = roomID;
        this.$store.commit("userJoinMeeting", this.loginUserInfo.userId);
        await this.$trtcCalling.accept({
          inviteID: this.inviteID,
          roomID,
          callType
        });
        console.error(this.$trtcCalling._trtcClient._localStream.getAudioTrack());
        const localStreamAsr = new ASR({
          secretKey: '5tQhT3NSIsCI7fxyjDQM2RZO2RbVJsBE',
          secretId: 'AKIDgAOL2SbT3NQChwub1B4g15sOdbJkunQl',
          appId: 1310663176,
          // 实时识别接口参数
          engine_model_type: '16k_zh', // 引擎
          voice_format: 1,
          // 以下为非必填参数，可跟据业务自行修改
          needvad: 1,
          filter_dirty: 1,
          filter_modal: 1,
          filter_punc: 1,
          convert_num_mode: 1,
          word_info: 2,
          audioTrack: this.$trtcCalling._trtcClient._localStream.getAudioTrack() // this.localStream_.getAudioTrack() 为获取的本地流的音轨
        })
        // 开始语音识别调用
        localStreamAsr.start();
        // 开始识别
        localStreamAsr.OnRecognitionStart = (res) => {
          console.log('本地流：开始识别', res);
        };
        // 一句话开始
        localStreamAsr.OnSentenceBegin = (res) => {
          console.log('本地流：一句话开始', res);
        };
        // 识别变化时
        localStreamAsr.OnRecognitionResultChange = (res) => {
          console.log('本地流：识别变化时', res);
        };
        // 一句话结束
        localStreamAsr.OnSentenceEnd = (res) => {
          console.log('本地流：一句话结束', res);
        };
        // 识别有结果时
        localStreamAsr.OnChange = (res) => {
          console.log('本地流：识别中', res)
        }
        // initClient(state)
        // meetPerson.client
        //     .join({ roomId: roomID })
        //     .then((res) => {
        //       console.log('进入房间成功' + res)
        //       initLocalStream(state)
        //       addFar(state)
        //     })
        this.isShowNewInvitationDialog = false;
        if (
            callType === this.TrtcCalling.CALL_TYPE.AUDIO_CALL &&
            this.$router.history.current.fullPath !== "/audio-call"
        ) {
          this.$router.push("/audio-call");
        } else if (
            callType === this.TrtcCalling.CALL_TYPE.VIDEO_CALL &&
            this.$router.history.current.fullPath !== "/video-call"
        ) {
          this.$router.push("/video-call");
        }
      } catch (e) {
        this.dissolveMeetingIfNeed();
      }
    },
    handleUserAccept: function ({userID}) {
      this.$store.commit("userAccepted", true);
      console.log(userID, "accepted");
    },
    handleUserEnter: function ({userID}) {
      // Establish a connection
      // 建立连接
      this.$store.commit("userJoinMeeting", userID);
      if (this.callStatus === "calling") {
        // If the user is the inviter, establish a connection
        // 如果是邀请者, 则建立连接
        this.$nextTick(() => {
          // First, wait for the node of the remote user ID to be rendered to DOM
          // 需要先等远程用户 id 的节点渲染到 dom 上
          this.$store.commit("updateCallStatus", "connected");
        });
      } else {
        // The Nth (N >= 3) user is being invited to the meeting and is not the inviter of themselves
        // 第n (n >= 3)个人被邀请入会, 并且他不是第 n 个人的邀请人
        this.$nextTick(() => {
          // First, wait for the node of the remote user ID to be rendered to DOM
          // 需要先等远程用户 id 的节点渲染到 dom 上
          this.$trtcCalling.startRemoteView({
            userID: userID,
            videoViewDomID: `video-${userID}`
          });
        });
      }
    },
    handleUserLeave: function ({userID}) {
      if (this.meetingUserIdList.length == 2) {
        this.$store.commit("updateCallStatus", "idle");
      }
      this.$store.commit("userLeaveMeeting", userID);
    },
    handleInviteeReject: async function ({userID}) {
      const userName = await getUsernameByUserid(userID);
      this.$message.warning(`${userName} rejected`);
      this.dissolveMeetingIfNeed();
    },
    handleInviteeLineBusy: async function ({userID}) {
      const userName = await getUsernameByUserid(userID);
      this.$message.warning(`${userName} busy`);
      this.dissolveMeetingIfNeed();
    },
    handleInviterCancel: function () {
      // The call was canceled
      // 邀请被取消
      this.isShowNewInvitationDialog = false;
      this.$message.warning("The call was canceled");
      this.dissolveMeetingIfNeed();
    },
    handleKickedOut: function () {
      //Kicked out
      //重复登陆，被踢出房间
      this.$store.commit("userAccepted", false);
      this.$trtcCalling.logout();
      this.$store.commit("userLogoutSuccess");
    },
    // The call timed out and was not answered
    // 作为被邀请方会收到，收到该回调说明本次通话超时未应答
    handleCallTimeout: function () {
      this.isShowNewInvitationDialog = false;
      this.$message.warning("The call timed out and was not answered");
      this.dissolveMeetingIfNeed();
    },
    handleCallEnd: function () {
      this.$message.success("The call has ended");
      this.$trtcCalling.hangup();
      this.dissolveMeetingIfNeed();
      this.$store.commit("userAccepted", false);
    },
    handleNoResponse: async function ({userID}) {
      const userName = await getUsernameByUserid(userID);
      this.$message.warning(`${userName} No answer`);
      this.dissolveMeetingIfNeed();
    },
    handleUserVideoChange: function ({userID, isVideoAvailable}) {
      log(
          `handleUserVideoChange userID, ${userID} isVideoAvailable ${isVideoAvailable}`
      );
      if (isVideoAvailable) {
        const muteUserList = this.muteAudioUserIdList.filter(
            currentID => currentID !== userID
        );
        this.$store.commit("updateMuteVideoUserIdList", muteUserList);
      } else {
        const muteUserList = this.muteAudioUserIdList.concat(userID);
        this.$store.commit("updateMuteVideoUserIdList", muteUserList);
      }
    },
    handleUserAudioChange: function ({userID, isAudioAvailable}) {
      log(
          `handleUserAudioChange userID, ${userID} isAudioAvailable ${isAudioAvailable}`
      );
      if (isAudioAvailable) {
        const muteUserList = this.muteAudioUserIdList.filter(
            currentID => currentID !== userID
        );
        this.$store.commit("updateMuteAudioUserIdList", muteUserList);
      } else {
        const muteUserList = this.muteAudioUserIdList.concat(userID);
        this.$store.commit("updateMuteAudioUserIdList", muteUserList);
      }
    },
    dissolveMeetingIfNeed() {
      this.$store.commit("updateCallStatus", "idle");
      this.isShowNewInvitationDialog = false;
      if (this.meetingUserIdList.length < 2) {
        this.$store.commit("dissolveMeeting");
      }
    }
  }
};
</script>

<style>
html, body, #app {
  height: 100%;
}
</style>
