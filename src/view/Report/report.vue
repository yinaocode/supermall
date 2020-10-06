<template>
  <div>
      <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
     <!-- 卡片视图 -->
    <el-card>
<div id="main" style="width: 1000px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
data(){
    return{
 option:{
            title: {
                text: '用户来源'
            },
             tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
            legend: {
               
            },
            xAxis: {
            },
            yAxis: {},
            series: []
        }
    }
},
created(){

},
async mounted(){
var myChart = echarts.init(document.getElementById('main'));
const {data:res} = await this.$http.get('reports/type/1')
if(res.meta.status!==200) return this.$message.error('获取报表数据失败')
 const echarData = Object.assign({},this.option,res.data)
 console.log(echarData)
         myChart.setOption(echarData);
},
methods:{

}
}
</script>

<style>

</style>