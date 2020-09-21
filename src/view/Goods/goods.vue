<template>
  <div>
       <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
       <el-row>
           <el-col>
               <el-button type="primary">添加分类</el-button>
           </el-col>
       </el-row>
       <!-- 表格区 -->
    <el-table
    :data="cateList"
    style="width: 100%;margin-bottom: 20px;"
    row-key="cat_id"
    border
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">  
    <el-table-column  prop="cat_name" label="商品名称" ></el-table-column>
    <el-table-column label="是否有效">
        <template slot-scope="scope">
             <i v-if="!scope.row.cat_deleted" class="el-icon-success" style="color:lightgreen"></i>
             <i v-else class="el-icon-error" style="color:red"></i>
        </template>
    </el-table-column>
    <el-table-column label="排序">
        <template slot-scope="scope">
            <el-tag size="mini" v-if="scope.row.cat_level==0">一级</el-tag>
            <el-tag type="success" size="mini" v-else-if="scope.row.cat_level==1">二级</el-tag>
            <el-tag type="warning" size="mini" v-else-if="scope.row.cat_level==2">三级</el-tag>
        </template>
    </el-table-column>
       <el-table-column label="操作">
        <template slot-scope="">
          <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
    </el-table-column>
  </el-table>

  
       <!-- 分页区 -->
    </el-card>
  </div>
</template>

<script>
export default {
data(){
    return{
        queryInfo:{
            type:3,
            pagenum:1,
            pagesize:5
        },
        cateList:[],
        total:0,//总数据条数
    }
},created(){
    this.getCateList()
},methods:{
   async getCateList(){
     const {data:res} = await this.$http.get('categories',{params:this.queryInfo})
  if(res.meta.status!==200){
      return this.$message.error('获取数据失败')
  }
  this.cateList = res.data.result;
  this.total  = res.data.total
  }
}
}
</script>

<style>

</style>