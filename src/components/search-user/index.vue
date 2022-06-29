<template>
  <div>
    <el-breadcrumb separator="/" style="margin-bottom: 20px">
      <el-breadcrumb-item :to="{ path: '/' }"><a href="/#/Main/" class="el-icon-s-home"></a></el-breadcrumb-item>
      <el-breadcrumb-item><a href="/#/Main/phoneAssist">电话辅销</a></el-breadcrumb-item>
    </el-breadcrumb>
    <el-row :gutter="20">
      <el-col :span="8">
          <el-input v-model="searchInput" maxlength="11" placeholder="请输入客户联系方式"></el-input>
      </el-col>
      <el-col :span="8"></el-col>
      <el-col :span="8">
        <div v-show="callStatus !== 'connected'" class="search-user-list">
          <div v-if="callStatus === 'calling' && isInviter" class="calling-user-footer">
            <el-button class="user-item-join-btn calling">呼叫中</el-button>
            <el-button class="user-item-cancel-join-btn" :disabled="cancel" :loading="cancel" @click="handleCancelCallBtnClick">取消</el-button>
          </div>
          <el-button v-else @click="handleCallBtnClick(searchInput)" :disabled="call" class="user-item-join-btn">呼叫</el-button>
        </div>
        <div v-show="callStatus === 'connected'">
          <el-button type="primary" style="">通话中</el-button>
          <el-button type="danger" @click="handleHangup">挂断</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "SearchUser",
  props:{
    callFlag: {
      type: Boolean
    },
    cancelFlag:{
      type: Boolean
    },
  },
  data() {
    return {
      searchInput: "",
      callUserId: "",
      call: false,
      cancel: false
    };
  },
  computed: {
    ...mapState({
      loginUserInfo: state => state.loginUserInfo,
      meetingUserIdList: state => state.meetingUserIdList,
      callStatus: state => state.callStatus,
      isAccepted: state => state.isAccepted,
      isInviter: state => state.isInviter
    })
  },
  watch: {
    callStatus:function(newVal){
      if (newVal === "idle") {
        this.searchInput = "";
        this.callUserId = "";
      }
    },
    callFlag(newVal) {
      this.call = newVal
    },
    cancelFlag(newVal) {
      this.cancel = newVal
    }
  },
  methods: {
    handleCallBtnClick: function(param) {
      if (param === this.loginUserInfo.userId) {
        this.$message("输入正确的电话号码");
        return;
      }
      this.call = true
      this.callUserId = param;
      this.$emit("callUser", { param });
    },
    handleCancelCallBtnClick: function() {
      // The user accepted the invitation but failed to enter the room
      // 对方刚接受邀请，但进房未成功
      this.cancel = true
      this.$emit("cancelCallUser");
    },
    handleHangup: function () {
      this.$emit("hangUp");
    }
  }
};
</script>

<style scoped>

</style>
