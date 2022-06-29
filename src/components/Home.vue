<template>
  <div>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/' }"><a href="/#/Main/" class="el-icon-s-home"></a></el-breadcrumb-item>
    <el-breadcrumb-item><a href="/#/Main">首页</a></el-breadcrumb-item>
  </el-breadcrumb>
    <el-row>
      <br>
    </el-row>
    <el-row>
      <br>
    </el-row>
    <el-row>
      <br>
    </el-row>
    <el-row>
      <br>
    </el-row>
    <el-row>
      <el-col :span="16">
        <div style="padding-left: 5vh;width: 20em">
        <br>
        <br>
        <br>
        <br>
        <br><b class="style1">猫头鹰助理</b>
        <br>
        <br><b class="style2">智能电话销售与邀约辅助问答系统</b>
        <br>
        <br>
        <br>
        <br>
        <el-button type="primary" style="font-weight: 300;font-size: 1em;"size="small"><router-link to="/Main/phoneAssist" class="buttonStyle">电话辅销</router-link></el-button>
        <el-button type="primary" style="margin-left: 1em;font-weight: 300;font-size: 1em;" size="small"><router-link to="/Main/recordList" class="buttonStyle">记录列表</router-link></el-button>
        </div>
      </el-col>
      <el-col :span="8">
        <div style="width:100%;text-align:right;overflow: hidden;" >
          <el-image :src="require('@/assets/7.png')" style="width: 22em;opacity: 70%;"></el-image>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'Home',
  data () {
    return {
      src: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
    }
  }
}
</script>

<style scoped>

.style1{
  background: linear-gradient(to right, #0e2cf0, #1a88e8, #4abaff);
  -webkit-background-clip: text;
  color: transparent;
  font-size: 4em;
  font-weight: 500;
}

.style2{
  background: linear-gradient(to right, #000000, #000000, #000000);
  -webkit-background-clip: text;
  color: transparent;
  font-weight: 450;
  font-size: 1.2em;
}

.pic{
  opacity: 60%;
}

/*.el-container{height:100%;padding:0;margin:0;width:100%;}*/

.el-header, .el-footer {
  background-color: #B3C0D1;
  color: #333;
  line-height: 40px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  line-height: 800px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  height: 800px;
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

.buttonStyle{
  text-decoration:none;
  color: white;
  font-size: 20px;
}

.bg_picture {
  left: 30%;
  opacity: 60%;
}

</style>
