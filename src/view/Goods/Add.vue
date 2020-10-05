<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="stepActive - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab状态栏 -->
      <el-form
        :model="addForm"
        :rules="addFormRule"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="stepActive"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateDataList"
                :props="{
                  expandTrigger: 'hover',
                  children: 'children',
                  label: 'cat_name',
                  value: 'cat_id',
                  checkStrictly: false,
                }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item
              v-for="(item, index) in manyTabData"
              :key="index"
              :label="item.attr_name"
            >
              <!-- 复选框 -->
              <el-checkbox-group v-model="checkList">
                <el-checkbox
                  v-for="(items, indexs) in item.attr_vals"
                  :key="indexs"
                  :label="items"
                  border
                  checked
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="(item, index) in onlyTabData"
              :key="index"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action图片要上传的后台api地址 -->
           
            <el-upload
              action="https://www.liulongbin.top:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
             :headers='headerObj'
             :on-success = 'handSuccess'
            >
              <el-button size="small" type="primary">点击上传</el-button>
             
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
          <!-- 富文本编辑器 -->
            <quill-editor
    v-model="addForm.goods_intorduce"/>
    <el-button type="primary" class="btn-add" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
  title="图片预览"
  :visible.sync="previewDialogVisible"
  width="50%"
 >
 <img :src="previewPath" alt="" class="preview">
  
</el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类数据
      cateDataList: [],
      // 具体的步骤进度数
      stepActive: 0,
      // 添加表单的数据对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类
        goods_cat: [],
        // 图片的数组
        pics:[],
        // 商品的描述
        goods_intorduce:"",
        attrs:[]
      },
      // 添加表单的校验规则
      addFormRule: {
        goods_name: [
          {
            required: true,
            message: "请输入商品名称",
            trigger: "blur",
          },
        ],
        goods_price: [
          {
            required: true,
            message: "请输入商品价格",
            trigger: "blur",
          },
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量",
            trigger: "blur",
          },
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商品数量",
            trigger: "blur",
          },
        ],
        goods_cat: [
          {
            required: true,
            message: "请选择商品分类",
            trigger: "blur",
          },
        ],
      },
      // 动态参数数据
      manyTabData: [],
      // 动态参数选中的值
      checkList: [],
      // 静态属性数据
      onlyTabData: [],
    //   图片上传的请求头
      headerObj:{
          Authorization : window.sessionStorage.getItem('token')
      },
      previewPath:'',
      previewDialogVisible:false
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    catId() {
      return this.addForm.goods_cat[2];
    },
  },
  methods: {
    // 获取所有商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) return this.$message.error("获取商品分类数据失败");
      this.$message.success("获取商品分类数据成功");
      this.cateDataList = res.data;
    },
    // 级联选择器触发的函数
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    // tab栏切换触发的函数
    beforeTabLeave(from, old) {
      if (old === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        return false;
      }
    },
    async tabClicked() {
      // 选中动态参数分类
    if (this.stepActive === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.catId}/attributes`,
          {
            params: {
              sel: "many",
            },
          });
        if (res.meta.status !== 200) return this.$message.error("获取动态参数失败");
        res.data.forEach(item => {
          item.attr_vals =
            item.attr_vals == "" ? [] : item.attr_vals.split(" ");
        });
        this.manyTabData = res.data;
    }
    if(this.stepActive === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.catId}/attributes`,
          {
            params: {
              sel: "only",
            },
          }
        );
        if (res.meta.status !== 200) return this.$message.error("获取动态参数失败");
        
        this.onlyTabData = res.data;
    }
    },
    // 处理图片预览效果
    handlePreview(file){
        this.previewPath = file.response.data.url;
        this.previewDialogVisible = true
    },
    // 处理移除图片的操作
    handleRemove(file){
        let filePath = file.response.data.tmp_path;
       const i = this.addForm.pics.findIndex(x=> x.pic === filePath )
    this.addForm.pics.splice(i,1)
    console.log( this.addForm.pics);
    },
    // 监听图片上传成功的事件
    handSuccess(response){
       let obj = {};
       obj['pic'] = response.data.tmp_path;
       this.addForm.pics.push(obj)
    },
    // 添加商品
    add(){
      this.$refs.addFormRef.validate(async valid=>{
        if(!valid)return this.$message.error('请填写必要的表单项')
         const goodsForm = Object.assign({},this.addForm)
      goodsForm.goods_cat = goodsForm.goods_cat.join(',')
      this.manyTabData.forEach(item=>{
        const newObj = {
          attr_id:item.attr_id,
          attr_value:item.attr_vals.join(' ')
        }
        this.addForm.attrs.push(newObj)
      })
      this.onlyTabData.forEach(item=>{
        const newObj = {
          attr_id:item.attr_id,
          attr_value:item.attr_vals
        }
        this.addForm.attrs.push(newObj)
      })
      goodsForm.attrs =  this.addForm.attrs
      console.log(goodsForm);
     const {data:res} = await this.$http.post('goods',goodsForm)
   if(res.meta.status!==201) return this.$message.error('添加商品失败')
   this.$message.success('添加商品成功')
   this.$router.push('/goods')
      })
     
   }
  },
};
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0;
}
.preview{
    width: 100%;
}
.btn-add{
  margin-top: 15px;
}
</style>