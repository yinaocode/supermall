<template>
  <el-container class="home-container">
    <!-- 头部 -->
  <el-header class="home-header"> 
    <div>
      <img src="../../assets/image/shop.png" alt="">
    <span>超级商城系统</span>  
    </div> 
       <el-button type="info" @click="loginOut">退出</el-button>
</el-header>
<!-- 页面主题 -->
  <el-container>
    <!-- 侧边栏 -->
    <el-aside width="200px">
       <!-- 侧边栏菜单区 -->
       <el-menu   
      background-color="#333744"
      text-color="#fff"
      active-text-color="#ffd04b">
     <!-- 一级菜单 -->
      <el-submenu :index="index" v-for="(item,index) in menusList" :key="index">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item :index="subIndex" v-for="(subItem,subIndex) in item.children" :key="subIndex">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>{{subItem.authName}}</span>
          </template>
        </el-menu-item>
    </el-submenu>
    </el-menu>
    </el-aside>
    <!-- 内容 -->
    <el-main>Main</el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  data(){
    return {
      menusList:[]
    }
  },
  created(){
    this.getMenuList()
  },
methods:{
    loginOut(){
        window.sessionStorage.removeItem('token');
        this.$router.push('/login')
    },
   async getMenuList(){
   const  {data:res} = await this.$http.get('menus')
   if(res.meta.status!==200) return this.$message.error(res.data.msg)
    this.menusList = res.data
    }
}
}
</script>

<style lang='less' scoped>
.home-container{
  height: 100%;
}
.el-header{
  background-color:#373d41;
}
.home-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  div{
    display:flex;
    justify-content: flex-start;
    img{
      width:auto;
      height: 30px;
    }
 span{
    color: #fff;
  font-size: 20px;
  margin-left: 15px;
  }
  }
 
}
.el-aside{
background-color:#333744 ;
}
.el-main{
  background-color: #eaedf1;
}
</style>