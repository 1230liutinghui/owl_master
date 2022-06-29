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
            <el-form status-icon class="demo-ruleForm">
              <el-form-item>
                <br>
                <el-row style="text-align: center">
                  <b style="font-size: 32px; margin-bottom: 0"> 登录 </b>
                </el-row>
              </el-form-item>
              <el-form-item>
                <el-row style="text-align: center">
                  <b style="font-size: 20px;"> 抱歉，您当前无访问权限 </b>
                </el-row>
              </el-form-item>
              <el-form-item>
                <el-row style="text-align: center">
                  <el-button type="danger" style="margin-left: 0em;font-weight: 300;font-size: 1em;" size="small"><router-link to="/Login" class="buttonStyle">返回登录</router-link></el-button>
                </el-row>
              </el-form-item>
              </el-form>
          </div>
        </el-col>
        <el-col :span="3">
          <div style="width:100%;overflow: hidden;" >
            <el-image :src="require('@/assets/7.png')" style="margin-top:6em;width: 3em;opacity: 0%;" class="bg_picture"></el-image>
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
export default {
  name: 'Error',
  data () {
    return {
      activeIndex: this.$route.path
    }
  },
  methods: {
    LogOutNotification () {
      this.$confirm('Are you sure to log out?', 'Warning', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: 'log out success!'
        })
        this.$router.push({path: '/'})
      }).catch(() => {
        this.$message({
          type: 'info',
          message: 'log out canceled'
        })
      })
    },
    handleSelect (key) {
      if (key === this.$route.path) {
        return
      }
      this.$router.push(key)
    }
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 60px;
}

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

.right {
  position: absolute;
  right: 25px;
  margin: 5px;
  /*width: 300px;*/
  /*border: 3px solid #73AD21;*/
  /*padding: 10px;*/
}

.top_left_text{
  position: absolute;
  left: 70px;
  margin: 10px;
}

.buttonStyle{
  text-decoration:none;
  color: white;
  font-size: 20px;
}
</style>
