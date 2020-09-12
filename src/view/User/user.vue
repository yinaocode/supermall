<template>
  <div>
      <!-- 面包屑导航区 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>活动管理</el-breadcrumb-item>
  <el-breadcrumb-item>活动列表</el-breadcrumb-item>
</el-breadcrumb>
<!-- 卡片视图 -->
<el-card>
    <!-- 搜索与添加区 -->
     <el-row :gutter="20">
  <el-col :span="7">
 <el-input placeholder="请输入内容" class="input-with-select">
   
    <el-button slot="append" icon="el-icon-search"></el-button>
  </el-input>
  </el-col>
  <el-col :span="4">
      <el-button type="primary"  icon="el-icon-search">添加用户</el-button>
  </el-col>
</el-row>
    <!-- 列表区 -->
        <el-table
      :data="userList"
      border
      stripe
      style="width: 100%">
       <el-table-column  type="index" label="#" ></el-table-column>
      <el-table-column  prop="username" label="姓名" ></el-table-column>
      <el-table-column  prop="email" label="邮箱" ></el-table-column>
      <el-table-column  prop="mobile" label="电话" ></el-table-column>
      <el-table-column  prop="role_name" label="角色" ></el-table-column>
      <el-table-column   label="状态" ></el-table-column>
      <el-table-column   label="操作" ></el-table-column>
     
    </el-table>
</el-card>
  </div>
</template>

<script>
export default {
data(){
    return {
        // 获取用户列表的参数对象
        queryInfo:{
            query:'',
            pagenum:1,
            pagesize:2
        },
        userList:[],
        total:0
    }
},
created(){
this.getUserList()
},
methods:{
async getUserList(){
  const {data:res}  = await  this.$http.get('users',{params:this.queryInfo});
  if(res.meta.status!==200) return this.$message.error("获取用户列表失败");
    this.userList = res.data.users;
    this.total = res.data.total
}
}
}
</script>

<style>

</style>