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
    <el-aside :width="isCollapse ? '64px' :'200px'">
      <div class="toggle-button" @click="toggleCollapse">|||</div>
       <!-- 侧边栏菜单区 -->
       <el-menu   
      background-color="#333744"
      :unique-opened = 'true'
      :collapse="isCollapse"
      :router='true'
      :default-active ="activePaths"
      :collapse-transition = "false"
      text-color="#fff"
      active-text-color="#409eff">
     <!-- 一级菜单 -->
      <el-submenu :index="item.id+''" v-for="item in menusList" :key="item.id">
        <template slot="title">
          <i :class='iconObj[item.id]' ></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item :index="'/'+subItem.path+''" v-for="subItem in item.children" 
        :key="subItem.id" @click="saveNavState('/'+subItem.path)">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{subItem.authName}}</span>
          </template>
        </el-menu-item>
    </el-submenu>
    </el-menu>
    </el-aside>
    <!-- 内容 -->
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  data(){
    return {
      menusList:[],
      iconObj:{
        '125':'el-icon-user-solid',
        '103':'el-icon-key',
        '101':'el-icon-s-goods',
        '102':'el-icon-s-order',
        '145':'el-icon-date',
      },
      isCollapse:false,//
      activePaths:''//激活的链接
    }
  },
  created(){
    this.getMenuList();
    this.activePaths = window.sessionStorage.getItem("saveNavState")
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
    },
    // 点击按钮折叠和展开菜单
    toggleCollapse(){
      this.isCollapse = !this.isCollapse
    },
    // 保存激活的链接
    saveNavState(index){
      window.sessionStorage.setItem('saveNavState',index)
      this.activePaths = index
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
.el-menu{
  border:none;
}
}
.el-main{
  background-color: #eaedf1;
}
.toggle-button{
  background-color: #4a5064;
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>