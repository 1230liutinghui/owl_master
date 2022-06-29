<template>
  <el-container style="height: 100%">
    <el-header>
      <el-row>
        <el-col :span="4">
          <div style="text-align: left">
            <el-image :src="require('@/assets/Group 1.png')"
                      style="height: 1.2em;width:1.3em;top: 0.6em;left: 0.3em"></el-image>
          </div>
          <div style="text-align: center">
            <b class="top_left_text" style="top: 0.4em;left: 1.8em">猫头鹰助理</b>
          </div>
        </el-col>
        <el-col :span="16"><br></el-col>
        <el-popover
          placement="top-start"
          width="150px"
          trigger="hover"
          class="right">
          <div style="margin-bottom: 10px; font-size: 15px">工号: {{user}}</div>
          <el-button type="danger" @click="LogOutNotification">注销</el-button>
          <el-button slot="reference" style="margin-top: 1.2em;margin-right: 1.8em" size="small">{{ user }}</el-button>
        </el-popover>
        <el-col :span="4">
          <div style="text-align: right">
            <el-image :src="require('@/assets/8.png')" style="width: 2.4em;top: 0.7em"></el-image>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container style="height: 100%">
      <el-aside width="15em">
        <el-menu
          :default-active="this.currentMenu"
          class="el-menu-vertical-demo"
          @select="handleSelect">
          <el-menu-item index="/Main/Home">
            <i class="el-icon-s-home"> 首页</i>
          </el-menu-item>
          <el-menu-item index="/Main/phoneAssist">
            <i class="el-icon-phone-outline"> 电话辅销</i>
          </el-menu-item>
          <el-menu-item index="/Main/recordList">
            <i class="el-icon-document"> 记录列表</i>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {setUserLoginInfo} from "../utils";

export default {
  name: 'Main',
  data() {
    return {
      currentMenu: '',
      user: localStorage.getItem('userName')
    }
  },
  methods: {
    LogOutNotification() {
      this.$confirm('确认注销?', '警告', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        this.$http.get('/user/logout', {
          headers: {
            'token': localStorage.getItem('token')
          }
        }).then(res => {
          if (res.data.code === 200) {
            this.$message({
              type: 'success',
              message: '注销成功!'
            })
            this.$trtcCalling.logout();
            this.$store.commit("userLogoutSuccess");
            setUserLoginInfo({
              token: "",
              phoneNum: ""
            });
            localStorage.removeItem('token')
            localStorage.removeItem('userName')
            localStorage.removeItem('path')
            this.$router.replace({path: '/'})
          } else if (res.data.code === 401) {
            this.$message.error('登录过期，请重新登录');
            this.$router.push('/login')
          } else {
            alert('注销失败，请重试')
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '注销失败'
        })
      })
    },
    handleSelect(key) {
      if (key === this.$route.path) {
        return
      }
      this.$router.push(key)
    }
  },
  created() {
    this.$http.get('/authority', {
      headers: {
        'token': localStorage.getItem('token')
      }
    }).then(res => {
      if (res.data.code === 401) {
        this.$message.error('登录过期，请重新登录');
        this.$router.push('/login')
      } else if (res.data.code === 403) {
        this.$router.push('/Error')
      }
    })
    let path = localStorage.getItem('path')
    this.currentMenu = path
    if (path === '/Main/recordList/recordDetail') {
      this.currentMenu = '/Main/recordList'
    }
  },
  watch: {
    $route(e) {
      localStorage.setItem('path', e.path)
      this.currentMenu = e.path;  // e里面的是当前路由的信息
      if (e.path.indexOf("Detail") !== -1) {
        this.currentMenu = "/Main/recordList"
      }
    },
  },
}

</script>

<style scoped>
/*.el-container{height:100%;padding:0;margin:0;width:100%;}*/

.el-menu {
  border-right: 0;
  border-bottom: 1px;
  font-size: 12px;
}

.el-menu-item {
  font-size: 12px;
}

.el-header, .el-footer {
  background-color: #FFFFFF;
  color: #333;
  line-height: 3em;
  border-bottom: 1px solid #D3DCE6
}

.el-aside {
  background-color: #FFFFFF;
  color: #333;
  line-height: 94vh;
}

.el-main {
  background-color: #FFFFFF;
  color: #333;
  border-left: 1px solid #D3DCE6;
  padding-right: 0;
  width: 80em;
  height: 100%;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.right {
  position: absolute;
  right: 25px;
  /*width: 300px;*/
  /*border: 3px solid #73AD21;*/
  /*padding: 10px;*/
}

.left {
  position: absolute;
  left: 25px;
  /*width: 300px;*/
  /*border: 3px solid #73AD21;*/
  /*padding: 10px;*/
}

.top_left_text {
  position: absolute;
  left: 80px;
}

</style>
