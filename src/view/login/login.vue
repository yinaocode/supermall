<template>
  <div class="login-container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="avater_box">
        <img src="../../assets/image/logo.png" alt />
      </div>
      <!-- </div>登录表单区域 -->
      <el-form label-width="0" ref="loginFromRef" :model="loginFrom" :rules="loginFromRules" class="login-from">
        <!-- 账号 -->
        <el-form-item prop="username">
          <el-input v-model="loginFrom.username" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
         <!-- 密码 -->
        <el-form-item  prop="password">
          <el-input type="password" v-model="loginFrom.password" prefix-icon="el-icon-unlock"></el-input>
        </el-form-item>

        <el-form-item class="btns">
           <el-button type="primary" @click="login">登录</el-button>
           <el-button type="info" @click="reseLoginBtn">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- button区域 -->
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      // 登录表单的数据
      loginFrom:{
        username:'admin',
        password:'123456'
      },
        // 输入表单验证
       loginFromRules:{
          username: [
            { required: true, message: '请输入账号', trigger: 'blur' },
            { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur' }
          ],
          password:[
             { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
          ]
        }
    }
  },
  methods:{
    // 重置表单
    reseLoginBtn(){
      // console.log(this)
      this.$refs.loginFromRef.resetFields()
    },
    login(){
      this.$refs.loginFromRef.validate(async valid=>{
        if(!valid) return false;
     const {data:res} = await  this.$http.post('login',this.loginFrom);
        if(res.meta.status!==200)return this.$message.error('登录失败');
       this.$message({message: '登录成功',type: 'success'})
        window.sessionStorage.setItem('token',res.data.token)
        this.$router.push('/home')
      })
    }
  }
};
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: relative;
  .avater_box {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    border: 1px solid #eee;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login-from{
    width: 100%;
    position: absolute;
     bottom: 0;
     padding:0 20px;
     box-sizing: border-box;
  }
  .el-icon-user,.el-icon-unlock{
    font-size: 20px;
  }
  .btns{
    display: flex;
    justify-content: flex-end;
  }
}
</style>