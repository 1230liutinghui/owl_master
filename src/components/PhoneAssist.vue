<template>
  <div>
    <div>
      <SearchUser :callFlag="callFlag" :cancelFlag="cancelFlag" @callUser="handleCallUser"
                  @cancelCallUser="handleCancelCallUser" @hangUp="handleHangup"></SearchUser>
    </div>

    <div class="communicate_box" style="padding-right: 2vh;height: 80vh">
      <el-scrollbar ref="leftScrollbar" style="height:100%">
        <div class="box-card" style="margin-bottom: 20px">
          <div v-for="item in list" :key="item" style="padding: 5px">
            <div v-if="item.startsWith('1')" style="text-align: right">
              <div>
                <el-card :body-style="{padding:'10px'}" style="display: inline-block;">
                  {{ item.slice(2) }}
                </el-card>
                <el-image :src="require('@/assets/8.png')" style="width: 2.4em;margin-bottom: 0.2em"></el-image>
              </div>
            </div>
            <div v-else style="text-align: left">
              <div>
                <el-image :src="require('@/assets/client.png')" style="width: 2.4em;margin-bottom: 0.2em"></el-image>
                <el-card :body-style="{padding:'10px'}" style="display: inline-block;">
                  {{ item.slice(2) }}
                </el-card>
              </div>
              <el-card>
                <div v-for="(key, index) in keywords[parseInt(item.substring(1, 2))]" :key="key" style="line-height: 2em">
                  <b>{{ key }}</b>
                  {{ contents[parseInt(item.substring(1, 2))][index] }}
                </div>
              </el-card>
            </div>
            <br>
          </div>
          <br>
        </div>
      </el-scrollbar>
    </div>

    <el-dialog title="对话记录" :visible.sync="dialogVisible" width="60%" height="100%">

      <div class="communicate_box_in_dialog">
        <el-row :gutter="20">
          <el-col :span="6">销售人员工号:</el-col>
          <el-col :span="6">{{ form.job_id }}</el-col>
          <el-col :span="6">客户联系方式</el-col>
          <el-col :span="6">{{ form.phone }}</el-col>
        </el-row>
        <br>
        <el-row :gutter="20">
          <el-col :span="6">开始时间:</el-col>
          <el-col :span="6">{{ form.start_time }}</el-col>
          <el-col :span="6">结束时间:</el-col>
          <el-col :span="6">{{ form.end_time }}</el-col>
        </el-row>
        <br>
        <div class="communicate_box" style="padding-right: 2vh;height: 40vh">
          <el-scrollbar ref="leftScrollbar" style="height:100%">
            <div class="box-card" style="margin-bottom: 20px">
              <div v-for="item in list" :key="item" style="padding: 5px">
                <div v-if="item.startsWith('1')" style="text-align: right">
                  <div>
                    <el-card :body-style="{padding:'10px'}" style="display: inline-block;">
                      {{ item.slice(2) }}
                    </el-card>
                    <el-image :src="require('@/assets/8.png')" style="width: 2.4em;margin-bottom: 0.2em"></el-image>
                  </div>
                </div>
                <div v-else style="text-align: left">
                  <div>
                    <el-image :src="require('@/assets/client.png')" style="width: 2.4em;margin-bottom: 0.2em"></el-image>
                    <el-card :body-style="{padding:'10px'}" style="display: inline-block;">
                      {{ item.slice(3) }}
                    </el-card>
                  </div>
                  <el-card>
                    <div v-for="(key, index) in keywords[parseInt(item.substring(1, 2))]" :key="key" style="line-height: 2em">
                      <b>{{ key }}</b>
                      {{ contents[parseInt(item.substring(1, 2))][index] }}
                    </div>
                  </el-card>
                </div>
                <br>
              </div>
              <br>
            </div>
          </el-scrollbar>
        </div>

      </div>
      <br>
      <br>
      <div class="rate">
        <el-rate
            v-model="form.score">
        </el-rate>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapState} from "vuex";
import SearchUser from "@/components/search-user";
import {getUserDetailInfoByUserid} from "../service";
import ASR from "../../sdkmain/examples/trtc/asr.esm";
//import { reactive } from 'vue'
//import { meetPerson, initClient, initLocalStream, addFar } from './video.js'
//import config from "./config";

// const state = reactive({
//   userSig: '',
//   applicant: '',
//   mediator: '123',
//   respondent: '234',
//   roomId: '',
//   SDKAPPID: config.SDKAppID
// })

export default {
  name: "PhoneAssist",
  components: {
    SearchUser
  },
  computed: {
    ...mapState({
      loginUserInfo: state => state.loginUserInfo,
      callStatus: state => state.callStatus,
      isInviter: state => state.isInviter,
      meetingUserIdList: state => state.meetingUserIdList,
      muteAudioUserIdList: state => state.muteAudioUserIdList
    })
  },
  data() {
    return {
      isShowAudioCall: false,
      isAudioOn: true,
      userId2User: {},
      callFlag: false,
      cancelFlag: false,
      list: [],               //保存每一句话的内容
      time: [],               //每一句话的开始时间
      dialogVisible: false,
      form: {
        job_id: 0,
        phone: '',
        score: 0,
        start_time: '',
        end_time: '',
        content: ''
      },
      keywords: [],                //返回的关键词
      contents: []                 //推荐的内容
    };
  },
  mounted() {
    if (this.callStatus === "connected" && !this.isInviter) {
      this.startMeeting();
      this.updateUserId2UserInfo(this.meetingUserIdList);
    }
    if (this.callStatus === "idle")
      this.list = []
  },
  destroyed() {
    this.$store.commit("updateMuteVideoUserIdList", []);
    this.$store.commit("updateMuteAudioUserIdList", []);
    if (this.callStatus === "connected") {
      this.$trtcCalling.hangup();
      this.$store.commit("updateCallStatus", "idle");
    }
  },
  watch: {
    callStatus: function (newStatus, oldStatus) {
      // Establish a call connection
      // 建立通话连接
      if (newStatus !== oldStatus && newStatus === "connected") {
        this.startMeeting();
        this.updateUserId2UserInfo(this.meetingUserIdList);
      }
    },
    meetingUserIdList: function (newList, oldList) {
      if (newList !== oldList || newList.length !== oldList.length) {
        this.updateUserId2UserInfo(newList);
      }
    }
  },
  methods: {
    handleCallUser: function ({param}) {
      this.callFlag = true
      this.$trtcCalling.call({
        userID: param,
        type: this.TrtcCalling.CALL_TYPE.AUDIO_CALL
      }).then(() => {
        this.callFlag = false
        this.$store.commit("userJoinMeeting", this.loginUserInfo.userId);
        this.$store.commit("updateCallStatus", "calling");
        this.$store.commit("updateIsInviter", true);
      })
    },
    handleCancelCallUser: function () {
      this.cancelFlag = true
      this.$trtcCalling.hangup().then(() => {
        this.cancelFlag = false
        this.$store.commit("dissolveMeeting");
        this.$store.commit("updateCallStatus", "idle");
      })
    },
    toggleAudio: function () {
      this.isAudioOn = !this.isAudioOn;
      this.$trtcCalling.setMicMute(!this.isAudioOn);
      if (this.isAudioOn) {
        const muteUserList = this.muteAudioUserIdList.filter(
            userId => userId !== this.loginUserInfo.userId
        );
        this.$store.commit("updateMuteAudioUserIdList", muteUserList);
      } else {
        const muteUserList = this.muteAudioUserIdList.concat(
            this.loginUserInfo.userId
        );
        this.$store.commit("updateMuteAudioUserIdList", muteUserList);
      }
    },
    handleHangup: function () {
      this.$trtcCalling.hangup();
      this.dialogVisible = true
      let date = new Date()
      this.form.end_time = date.toISOString().slice(0, 10) + ' ' + date.toLocaleTimeString()
      this.form.job_id = this.meetingUserIdList[0]
      this.form.phone = this.meetingUserIdList[1]
      for (let i = 0; i < this.list.length; i++) {
        //将每一句话的内容和开始时间存入数据库
        this.form.content += this.list[i] + '\t' + this.time[i] + '\n'
        if (this.list[i].startsWith(2)) {
          for (let j = 0; j < 3; j++) {
            this.form.content += '3' + '\t' + this.keywords[parseInt(this.list[i].substring(1, 2))][j] + '\t' + this.contents[parseInt(this.list[i].substring(1, 2))][j] + '\n'
          }
        }
      }
      this.$store.commit("updateCallStatus", "idle");
    },
    isUserMute: function (muteUserList, userId) {
      return muteUserList.indexOf(userId) !== -1;
    },
    startMeeting: function () {
      let date = new Date()
      this.form.start_time = date.toISOString().slice(0, 10) + ' ' + date.toLocaleTimeString()
      // initClient(state)
      // meetPerson.client
      //     .join({ roomId: roomID })
      //     .then((res) => {
      //       console.log('进入房间成功' + res)
      //       initLocalStream(state)
      //       addFar(state)
      //     })
      if (this.isInviter) {
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
        // 一句话开始
        localStreamAsr.OnSentenceBegin = (res) => {
          console.log('本地流：一句话开始', res);
          let date = new Date()
          let res_date = date.toISOString().slice(0, 10) + ' ' + date.toLocaleTimeString()
          this.time.push(res_date)
        };
        // 一句话结束
        localStreamAsr.OnSentenceEnd = (res) => {
          console.log('本地流：一句话结束', res.result);
          let voice = res.result.voice_text_str
          if (voice === '')
            return
          this.list.push('1' + '\t' + voice)
        };
        const remoteStreamAsr = new ASR({
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
          audioTrack: this.$trtcCalling._trtcClient._remoteStreams[0].getAudioTrack() // this.localStream_.getAudioTrack() 为获取的本地流的音轨
        })
        // 开始语音识别调用
        remoteStreamAsr.start();
        var count = 0;         //记录客户记录id
        // 一句话开始
        remoteStreamAsr.OnSentenceBegin = (res) => {
          console.log('远程流：一句话开始', res);
          let date = new Date()
          let res_date = date.toISOString().slice(0, 10) + ' ' + date.toLocaleTimeString()
          this.time.push(res_date)
        };
        // 一句话结束
        remoteStreamAsr.OnSentenceEnd = (res) => {
          console.log('远程流：一句话结束', res.result);
          let voice = res.result.voice_text_str;
          if (voice === '')
            return
          this.list.push('2' + count.toString() + '\t' + voice);
          count++;
          this.$http.get('/recommend?str=' + voice, {
            headers: {
              'token': localStorage.getItem('token')
            }
          }).then(res => {
            if (res.data.code === 200) {
              console.log(res.data.data)
              this.keywords.push(res.data.data.key_word)
              this.contents.push(res.data.data.content)
            }
          })
        };
      }
    },
    updateUserId2UserInfo: async function (userIdList) {
      let userId2UserInfo = {};
      let loginUserId = this.loginUserInfo.userId;
      for (let i = 0; i < userIdList.length; i++) {
        const userId = userIdList[i];
        const userInfo = await getUserDetailInfoByUserid(userId);
        userId2UserInfo[userId] = userInfo;
        if (loginUserId === userId) {
          userId2UserInfo[userId].name += "(me)";
        }
      }
      this.userId2User = {
        ...this.userId2User,
        ...userId2UserInfo
      };
    },
    submit() {
      this.dialogVisible = false
      this.$http.post('/record/addRecord', this.form,{
        headers: {
          'token': localStorage.getItem('token')
        }
      }).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.list = []
          this.$message({
            message: res.data.msg,
            type: 'success'
          })
        }else if (res.data.code === 401) {
          this.$message.error('登录过期，请重新登录');
          this.$router.push('/login')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
  }
};
</script>

<style scoped>

.audio-call-section-header {
  font-size: 24px;
}

.audio-call-section-title {
  margin-top: 30px;
  font-size: 20px;
}

.audio-conference-list {
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  justify-content: center;
}

.audio-conference-action {
  margin-top: 10px;
}

.user-audio-status {
  position: absolute;
  right: 20px;
  bottom: 20px;
  width: 22px;
  height: 27px;
  z-index: 10;
  background-image: url("../assets/mic-on.png");
  background-size: cover;
}

.audio-item-avatar-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 80px;
  height: 80px;
  z-index: 20;
}

.audio-item-avatar-wrapper img {
  width: 80px;
  height: 80px;
}

.user-audio-status.is-mute {
  background-image: url("../assets/mic-off.png");
}

.audio-item-username {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  color: #ffffff;
}

@media screen and (max-width: 767px) {
  .audio-call-section {
    width: 100%;
  }

  .audio-conference-list {
    padding: 0 10px;
  }

  .user-audio-container {
    margin: 5px;
    width: 180px;
    height: 120px;
  }
}

element.style {
  margin-top: 15vh;
  width: 70%;
  height: 65%;
}

.communicate_box {
  overflow: hidden;
  width: auto;
  color: #B3C0D1;
  /*margin: 0 auto;*/
}
.communicate_box_in_dialog{
  overflow: hidden;
  width: auto;
  height: 40vh;
  color: #575757;
  margin-left: 2vh;
  /*margin: 0 auto;*/
}

div.el-dialog__body {
  padding-bottom: 0px;
}
/*.scrollMenuBox {*/
/*  height: 200px;*/
/*  width: 100px;*/
/*  border: 1px solid red;*/
/*}*/
.rate{
  text-align:center;
}

/* 需要在外层套一个div,切记命名特殊一点,防止因缺少scoped，对其他页面会有冲突 */
.center .el-scrollbar__wrap {
  overflow-x: hidden;
}

.formItem {
  display: inline-block;
}
</style>
