<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 头部警告区域 -->

      <el-alert
        title="注意:只允许为第三级的分类设置相关参数！"
        :closable="false"
        show-icon
        type="warning"
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            v-model="selectCateKeys"
            :options="catList"
            :props="{
              expandTrigger: 'hover',
              label: 'cat_name',
              value: 'cat_id',
              children: 'children',
            }"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 添加动态参数的面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isbtnDisabled"
          @click="adddialogVisible=true"  >添加参数</el-button>
            <!-- 动态参数表格 -->
            <el-table
            :data='manyTabData' border stripe="">
            <!-- 展开行 -->
             <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column  label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column  label="操作">
              <template slot-scope="">
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">搜索</el-button>
              </template>
            </el-table-column>
            </el-table>
        </el-tab-pane>
        <!-- 添加静态属性的面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isbtnDisabled"
           @click="adddialogVisible=true" >添加属性</el-button>
  <!-- 静态属性表格 -->
            <el-table
            :data='onlyTabData' border stripe="">
            <!-- 展开行 -->
             <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column  label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column  label="操作">
              <template slot-scope="">
                <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini">搜索</el-button>
              </template>
            </el-table-column>
            </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数弹出框 -->
    <el-dialog
  :title="'添加'+titleText"
  :visible.sync="adddialogVisible"
  width="50%"
  @close="handleClose">
  <el-form :model="addForm" :rules="addFormRules" ref="ruleFormRef" label-width="100px" >
  <el-form-item :label="titleText" prop="attr_name">
    <el-input v-model="addForm.attr_name"></el-input>
  </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="adddialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类数据
      catList: [],
      selectCateKeys: [],
      // 被激活的页签
      activeName: "many",
      // 动态参数数据
      manyTabData:[],
      // 静态属性数据
      onlyTabData:[],
      // 控制添加对话框的显示与隐藏
      adddialogVisible:false,
      addForm:{
        attr_name:''
      },
      addFormRules:{
        attr_name:[{
          required:true,message:"请输入参数名称",trigger:'blur'
        }]
      }
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    // 是否禁用button按钮
    isbtnDisabled() {
      if (this.selectCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    // 是否选中三级分类
    cateId() {
      if (this.selectCateKeys.length === 3) {
        return this.selectCateKeys[2];
      }
      return null;
    },
    // 动态显示对话框的提示信息
    titleText(){
      if(this.activeName=='many'){
        return '动态参数'
      }else{
        return '静态属性'
      }
    }
  },
  methods: {
    // 获取所有的商品分类
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200)
        return this.$message.error("获取商品分类失败！");
      this.catList = res.data;
    },
    // 级联选择框选择变化，会触发这个函数
    handleChange() {
     this.getParamsDate()
    },
    // 获取参数的列表数据
   async getParamsDate(){
       if (this.selectCateKeys.length !== 3) {
         this.selectCateKeys = [];
         return
      }
    const {data:res} = await  this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}})
    if(res.meta.status!==200) return this.$message.error('获取参数列表失败')
    if(this.activeName=='many'){
      this.manyTabData = res.data
    }else{
      this.onlyTabData = res.data
    }
    },
    // tab页签点击事件
    handleClick() {
       this.getParamsDate()
    },
    // 监听对话框的关闭事件
    handleClose(){
      this.$refs.ruleFormRef.resetFields()
    },
    // 点击按钮，添加参数
    addParams(){
      this.$refs.ruleFormRef.validate(async valid=>{
        if(!valid) return
      const {data:res} = await  this.$http.post('categories/'+this.cateId+'/attributes',{
          attr_name:this.addForm.attr_name,
          attr_sel:this.activeName
        })
        if(res.meta.status!==201) return this.$message.error('添加参数失败')
       this.$message.success('添加参数成功')
       this.getParamsDate();
       this.adddialogVisible = false
      })
    }
  },
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin-top: 15px;
}
</style>