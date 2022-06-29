<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }"><a href="/#/Main/" class="el-icon-s-home"></a></el-breadcrumb-item>
      <el-breadcrumb-item><a href="/#/Main/recordList">记录列表</a></el-breadcrumb-item>
    </el-breadcrumb>
    <br>
    <br>
    <el-form :model="ruleForm" label-width="7.2em">
      <div style="padding-right: 2vh;display:inline">
      <!--input block-->
      <div style="display:inline">
      <el-form-item label="客户联络方式" prop="phone" class="formItem">
        <el-input v-model="ruleForm.phone" style="width: 15em"></el-input>
      </el-form-item>
      <el-form-item label="对话记录ID" prop="id" class="formItem">
        <el-input v-model="ruleForm.id" style="width: 15em"></el-input>
      </el-form-item>
      </div>
      <!--button-->
      <div style="display:inline;float:right;padding-right: 2vh">
      <el-form-item class="formItem" >
        <el-button type="primary" @click="submitForm">查询</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
      </div>
      </div>
      <div style="padding-right: 2vh">
      <br>
      <!--display table-->
      <el-table :data="tableData"
                style="width: 100%">
        <el-table-column
          label="记录ID" prop="id">
          <template slot-scope="scope">
            <router-link :to="{name:'recordDetail', query:{id:scope.row.id}}" style="text-decoration: none">
              <el-link type="primary" :underline="false" href="#">{{scope.row.id}}</el-link>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          label="客户联络方式" prop="phone"></el-table-column>
        <el-table-column
          label="开始时间" prop="start_time"></el-table-column>
        <el-table-column
          label="结束时间" prop="end_time"></el-table-column>
        <el-table-column
          label="评分" prop="score"></el-table-column>
      </el-table>
      </div>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'RecordList',
  data () {
    return {
      job_id: 0,
      tableData: [],         //显示的数据
      totalData: [],         //根据工号查询的所有数据
      ruleForm: {
        phone: '',
        id: ''
      },
    }
  },
  created() {
    //从本地获取用户工号
    this.job_id = localStorage.getItem("userName")
    //向后端请求当前用户的通话记录
    this.$http.get('/record/queryByUserId?job_id=' + this.job_id, {
      headers: {
        'token': localStorage.getItem('token')
      }
    }).then(res => {
      //code为401时，用户token失效，需要重新登录
      if (res.data.code == 401) {
        this.$message.error('登录过期，请重新登录');
        this.$router.push('/login')
      } else {
        this.tableData = res.data
        this.totalData = res.data
      }
    })
  },
  methods: {
    submitForm () {
      let that = this
      let ruleForm = that.ruleForm
      if (ruleForm.phone === '' && ruleForm.id === '') {
        that.$message({
          message: '请输入搜索条件',
          type: 'warning'
        })
        that.tableData = that.totalData
        return
      }
      that.tableData = that.totalData.filter(function (item) {
        if (ruleForm.phone !== '' && ruleForm.id !== '') {
          return item.phone.startsWith(ruleForm.phone) && item.id === parseInt(ruleForm.id)
        } else if (ruleForm.phone !== '') {
          return item.phone.startsWith(ruleForm.phone)
        } else {
          return item.id === parseInt(ruleForm.id)
        }
      })
    },
    resetForm () {
      this.ruleForm.phone = ''
      this.ruleForm.id = ''
      this.tableData = this.totalData
    }
  }
}
</script>

<style scoped>
.small-font{
  font-size: 12px;
}

.formItem{
  display: inline-block;
}
</style>
