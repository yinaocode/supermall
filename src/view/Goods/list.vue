<template>
  <div>
      <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-row gutter="20">
            <el-col :span="8">
                <el-input placeholder="请输入内容">
                <el-button slot="append" icon="el-icon-search"></el-button>

                </el-input>
            </el-col>
            <el-col :span="4">
                <el-button type="primary">添加商品</el-button>
            </el-col>
        </el-row>
        <!-- 表格区域 -->
        <el-table :data="goodsList" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="goods_name" label="商品名称"></el-table-column>
            <el-table-column prop="goods_price" label="商品价格（元）" width="90px"></el-table-column>
            <el-table-column prop="goods_weight" label="商品重量"  width="70px"></el-table-column>
            <el-table-column  label="创建时间"  width="120px">
                 <template slot-scope="scope">
                     {{scope.row.add_time | dateFormat}}
                 </template>
            </el-table-column>
            <el-table-column  label="操作"  width="120px">
                <template>
                    <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页区域 -->
         <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total" background>
    </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
data(){
    return{
        // 列表数据
        goodsList:[],
        total:0,
       // 请求参数体
        queryInfo:{
            query:'',
            pagenum:1,
            pagesize:10
        }
    }
},
created(){
this.getGoodsList()
},
methods:{
    // 根据分页获取对应的数据
async getGoodsList(){
   const {data:res} = await this.$http.get('goods',{params:this.queryInfo})
    if(res.meta.status!==200) return this.$message.error('请求数据失败')
    this.$message.success('请求数据成功')
    this.goodsList = res.data.goods;
    this.total = res.data.total
},
// pagesize发生变化
handleSizeChange(newSize){
    this.queryInfo.pagesize = newSize;
    this.getGoodsList()
},
handleCurrentChange(newNum){
 this.queryInfo.pagenum = newNum;
    this.getGoodsList()
}
}
}
</script>

<style lang="less" scoped>

</style>