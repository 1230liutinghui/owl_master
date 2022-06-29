<template>
  <el-container style="height: 100%">
    <el-header>
      <el-col :span="4">
        <div style="text-align: left">
          <el-image :src="require('@/assets/Group 1.png')" style="height: 1.2em;top: 0.6em;left: 0.3em"></el-image>
        </div>
        <div style="text-align: center">
          <b class="top_left_text" style="top: 0.4em;left: 3.2em;margin: 0">猫头鹰助理</b>
        </div>
      </el-col>
    </el-header>
    <el-main style = "height: 100%;padding-right: 0;">
      <el-row>
        <el-col :span="8"><div class="grid-content bg-white"></div></el-col>
        <el-col :span="8" style="margin-top: 80px">
          <div style="margin-top: 3em">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
              <el-form-item>
                <el-row style="text-align: center">
                  <br>
                  <b style="font-size: 32px; margin-bottom: 0"> 登录 </b>
                </el-row>
              </el-form-item>
              <el-form-item>
                <div style="text-align: center">
                <el-image :src="require('@/assets/8.png')" style="width: 9em;" class="user_picture"></el-image>
                </div>
              </el-form-item>
              <el-form-item style="margin-bottom: 0">
                <el-row style="text-align: center;margin-top: 1em">
                  <el-button type="primary" @click="login"> OA自动登录</el-button>
                </el-row>
              </el-form-item>
              <el-form-item>
                <el-row style="text-align: center">
                  <router-link to="/login" style="text-decoration: none;color: dodgerblue">账号密码登录</router-link>
                </el-row>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="1">
          <div style="width:100%;overflow: hidden;" >
            <el-image :src="require('@/assets/7.png')" style="margin-top:6em;width: 3em;opacity: 0%;" class="bg_picture"></el-image>
          </div>
        </el-col>
        <el-col :span="7">
          <div style="text-align:right;width:100%;height:100%;overflow: hidden;" >
            <el-image :src="require('@/assets/7.png')" style="margin-top:6em;width: 22em;opacity: 70%;"></el-image>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data () {
    var validateId = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入工号'))
      } else {
        callback()
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        userName: '',
        password: ''
      },
      rules: {
        checkId: [
          { validator: validateId, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login() {
      let token = localStorage.getItem('token')
      if (token !== null) {
        this.$router.push('/main')
      } else {
        alert('未登录，请使用账号密码登录')
      }
    }
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.el-header, .el-footer {
  background-color: #FFFFFF;
  color: #333;
  line-height: 3em;
  border-bottom:1px solid #D3DCE6
}

.el-col.last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.bg-white {
  background: #ffffff
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.bg_picture {
  left: 30%;
  opacity: 60%;
}

.el-divider--horizontal {
  display: block;
  height: 1px;
  width: 100%;
  margin: 20px 0px;
}
.top_left_text{
  position: absolute;
  left: 80px;
  margin: 10px;
}
</style>
