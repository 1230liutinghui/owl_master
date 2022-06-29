<template>
  <div style="padding-right: 2vh">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/记录列表' }"><a href="/#/Main/" class="el-icon-s-home"></a></el-breadcrumb-item>
      <el-breadcrumb-item><a href="/#/Main/recordList">记录列表</a></el-breadcrumb-item>
      <el-breadcrumb-item><a >记录详情</a></el-breadcrumb-item>
    </el-breadcrumb>
    <br>
    <el-card class="box-card">
      <div style="margin-bottom: 1.3em">
        <b>记录信息</b>
      </div>
      <el-row>
        <el-col :span="8"><div>记录ID：{{this.record.id}}</div></el-col>
        <el-col :span="8"><div>销售人员工号：{{this.record.job_id}}</div></el-col>
        <el-col :span="8"><div>客户联系方式：{{this.record.phone}}</div></el-col>
      </el-row>
      <br>
      <el-row>
        <el-col :span="8"><div>开始时间：{{this.record.start_time}}</div></el-col>
        <el-col :span="8"><div>结束时间：{{this.record.end_time}}</div></el-col>
        <el-col :span="8">
          <div>销售人员评分：
            <el-rate class="rateStyle"
                     v-model="value"
                     disabled
                     show-score
                     text-color="#ff9900"
                     score-template="{value}">
            </el-rate>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <br>
    <div class="communicate_box">
      <el-scrollbar style="height:100%">
        <el-card class="box-card">
          <div class="box-card" v-for="(str, index) in content" :key="index">
              <!--营销人员-->
              <div v-if="str.startsWith('1')" style="text-align: right">
                <div v-for="(s, index) in str.slice(2).split('\t').reverse()" :key="index">
                  <div v-if="index==0">
                    <div style="font-size: 1px">{{s}}</div>
                  </div>
                  <div v-else>
                    <div style="margin-top: 0.4em">
                    <el-card :body-style="{padding:'10px'}" style="display: inline-block">
                      {{s}}
                    </el-card>
                    <el-image :src="require('@/assets/8.png')" style="width: 2.4em;margin-bottom: 0.2em"></el-image>
                    </div>
                  </div>
                </div>
              </div>
              <!--客户-->
              <div v-else-if="str.startsWith('2')" style="text-align: left">
                <div v-for="(s, index) in str.slice(3).split('\t').reverse()" :key="index">
                  <div v-if="index==0">
                    <div style="font-size: 1px">{{s}}</div>
                  </div>
                  <div v-else>
                    <div style="margin-top: 0.4em">
                    <el-image :src="require('@/assets/client.png')" style="width: 2.4em;margin-bottom: 0.2em"></el-image>
                    <el-card :body-style="{padding:'10px'}" style="display: inline-block;">
                      {{s}}
                    </el-card>
                    </div>
                  </div>
                </div>
                <br>
              </div>
              <!--提示-->
              <div v-else style="text-align: left">
                <el-card>
                  <div v-for="(s, index) in str.slice(2).split('\t')" :key="index">
                    <div v-if="index%2 == 0">
                      <b>{{s}}</b>
                    </div>
                    <div v-else>
                      {{s}}
                    </div>
                  </div>
                </el-card>
              </div>
            <div><br></div>
            </div>
        </el-card>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecordDetail',
  data () {
    return {
      id: 0,
      record: {},
      value: 0,
      content: []
    }
  },
  created() {
    //获取路由跳转的参数
    this.id = this.$route.query.id
    //根据id查询记录详情
    this.$http.get('/record/queryById?id=' + this.id, {
      headers: {
        'token': localStorage.getItem('token')
      }
    }).then(res => {
      if (res.data.code === 401) {
        this.$message.error('登录过期，请重新登录');
        this.$router.push('/login')
      }
      this.record = res.data
      this.value = res.data.score
      this.content = res.data.content.substring(0, res.data.content.length - 1).split('\n')
    })
  }
}
</script>

<style scoped>
.rateStyle{
  display: inline-block;
}
</style>
