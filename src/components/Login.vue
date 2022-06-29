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
    <el-main style="height: 100%;padding-right: 0;">
      <el-row>
        <el-col :span="10">
          <div class="grid-content bg-white"></div>
        </el-col>
        <el-col :span="4" style="margin-top: 80px">
          <div style="margin-top: 3em">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
              <el-form-item>
                <br>
                <el-row style="text-align: center">
                  <b style="font-size: 32px; margin-bottom: 0"> 登录 </b>
                </el-row>
              </el-form-item>
              <el-form-item label="工号" prop="userName" style="font-weight: 600;">
                <el-input style="width: 100%" placeholder="请输入工号" v-model="ruleForm.userName"
                          autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password" style="font-weight: 600;">
                <el-input style="width: 100%" placeholder="请输入密码" type="password" v-model="ruleForm.password"
                          autocomplete="off" show-password></el-input>
              </el-form-item>
              <el-form-item>
                <el-row style="text-align: center;margin-top: 2em;">
                  <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                </el-row>
              </el-form-item>
              <el-form-item>
                <el-row style="text-align: center">
                  <router-link to="/OA" style="text-decoration: none;color: dodgerblue">OA登录</router-link>
                </el-row>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :span="3">
          <div style="width:100%;overflow: hidden;" >
            <el-image :src="require('@/assets/7.png')" style="margin-top:6em;width: 3em;opacity: 0;" class="bg_picture"></el-image>
          </div>
        </el-col>
        <el-col :span="7">
          <div style="text-align:right;width:100%;height:100%;overflow: hidden;" >
            <el-image :src="require('@/assets/7.png')" style="margin-top:6em;width: 22em;;opacity: 70%;"></el-image>
          </div>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import { genTestUserSig } from "../../public/debug/GenerateTestUserSig";

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
        userName: [
          {validator: validateId, trigger: 'blur'}
        ],
        password: [
          {validator: validatePass, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 向后端请求用户认证
          this.$http.post('/user/login', this.ruleForm).then(res => {
            // console.log(res.data)
            if (res.data.code === 200) {
              // alert(res.data.msg)
              localStorage.setItem('token', res.data.data.token)
              localStorage.setItem('userName', this.ruleForm.userName)
              this.$message({
                message: '登录成功',
                type: 'success'
              })
              const userSig = genTestUserSig(this.ruleForm.userName).userSig;
              const userId = this.ruleForm.userName;
              this.$store.commit("userLoginSuccess");
              this.$store.commit("setLoginUserInfo", {
                userId,
                userSig
              });

              // Log in to `trtcCalling`
              // 登录 trtcCalling
              this.$trtcCalling.login({
                userID: this.ruleForm.userName,
                userSig
              })
              this.$router.push('/main')
            } else if (res.data.code === 401) {
              alert('用户名或密码错误，请重试')
            } else {
              alert('请勿重复登录')
            }
          })
        } else {
          alert('用户名或密码不能为空')
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>

.router-link-active {
  text-decoration: none;
  color: blue;
}

.el-form-item__label {
  font-weight: 200;
}

.el-header, .el-footer {
  background-color: #FFFFFF;
  color: #333;
  line-height: 3em;
  border-bottom:1px solid #D3DCE6
}

.top_left_text{
  position: absolute;
  left: 80px;
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
