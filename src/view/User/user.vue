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
          <el-input placeholder="请输入内容" 
          v-model="queryInfo.query" 
           clearable
           @clear="getUserList()">
            <el-button slot="append" icon="el-icon-search"
            @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-search"
          @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 列表区 -->
      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template>
            <!-- 修改按钮 -->
            <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" size="mini" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
  title="添加用户"
  :visible.sync="addDialogVisible"
  @close="addDialogClose()"
  width="50%"
  >
  <!-- 内容主体区 -->
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRulesRef" label-width="70px" >
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
   <el-form-item label="密码" prop="password">
    <el-input  type="password" v-model="addForm.password"></el-input>
  </el-form-item>
   <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
   <el-form-item label="手机" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
  </el-form>
   <!-- 内容底部 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addDialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data() {
     // 验证邮箱的规则
      var checkEmail = (rule,value,cb)=>{
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if(regEmail.test(value)){
          return cb()
        }
        return cb(new Error('请输入合法的邮箱'))
     };
         // 验证手机号的规则
       var checkMobile = (rule,value,cb)=>{
 const regMobile = /^(1)[0-9]{9}[0-9]$/
        if(regMobile.test(value)){
          return cb()
        }
        return cb(new Error('请输入合法的手机号'))
      };
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
      addDialogVisible:false,//添加用户对话框的显示与隐藏
   addForm:{
     username:'',
     password:'',
     email:'',
     mobile:''
   },//添加用户表单数据
   addFormRules:{
     username:[{required:true,message:'请输入用户名',trigger:'blur'},
       {min:3,max:10,message:'用户名长度在3~10之间',trigger:'blur'}],
      password:[{required:true,message:'请输入密码',trigger:'blur'},
       {min:6,max:15,message:'用户名长度在6~15之间',trigger:'blur'}],
     email:[{required:true,message:'请输入邮箱',trigger:'blur'},
       {validator:checkEmail,trigger:'blur'}],
      mobile:[{required:true,message:'请输入手机号',trigger:'blur'},
         {validator:checkMobile,trigger:'blur'}],

     
   },//添加用户表单验证
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取用户列表失败");
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    // 监听pagesize改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听页码值改变事件
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getUserList();
    },
    // 用户状态change
  async  userStateChange(state){
   const {data:res} = await  this.$http.put(`users/${state.id}/state/${state.mg_state}`)
      if(res.meta.status!==200){
       state.mg_state = !state.mg_state;
       return this.$message.error('更改用户状态失败')
      }
     return this.$message.success('更改用户状态成功')
    },
    // 监听用户表单关闭事件
    addDialogClose(){
      this.$refs.addFormRulesRef.resetFields()
    }
  },
};
</script>

<style>
</style>