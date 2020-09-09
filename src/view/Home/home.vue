<template>
  <div>
     <el-button type="info" @click="loginOut">退出</el-button>
  </div>
</template>

<script>
export default {
methods:{
    loginOut(){
        window.sessionStorage.removeItem('token');
        this.$router.push('/login')
    }
}
}
</script>

<style>

</style>