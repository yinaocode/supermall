<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列d表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status == '1'" type="success"
              >已付款</el-tag
            >
            <el-tag v-if="scope.row.pay_status == '0'" type="danger"
              >未付款</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showBox"
            ></el-button>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-location"
               @click="showLocalBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 30]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <!-- 对话框区域 -->
      <el-dialog
        title="修改地址"
        :visible.sync="addRessdialogVisible"
        width="50%"
      >
        <el-form
          :model="addressForm"
          :rules="addressFormRules"
          ref="addressFormRef"
          label-width="100px"
        >
          <el-form-item label="省市区" prop="address1">
            <el-input v-model="addressForm.adress1"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.adress2"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRessdialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRessdialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 展示物流进度的对话框 -->
      <el-dialog
        title="物流进度"
        :visible.sync="localdialogVisible"
        width="50%"
      >
        <el-timeline>
   
    <el-timeline-item v-for="(item,index) in localList" :key='index' :timestamp="item.time" placement="top">
      <el-card>
        <h4>{{item.ftime}}</h4>
        <p>{{item.context}}</p>
      </el-card>
    </el-timeline-item>
  </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orderList: [],
      total: 0,
      queryInfo: {
        queryInfo: "",
        pagenum: 1,
        pagesize: 10,
      },
      addRessdialogVisible: false,
      localdialogVisible:false,
      addressForm: {
        address1: [],
        address2: "",
      },
      addressFormRules: {
        address1: [
          {
            required: true,
            message: "请选择省市区",
            trigger: "blur",
          },
        ],
        address2: [
          {
            required: true,
            message: "请输入详细地址",
            trigger: "blur",
          },
        ],
      },
      localList:[]

    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取订单列表失败");
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getOrderList();
    },
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum;
      this.getOrderList();
    },
    // 展示修改地址对话框
    showBox() {
      this.addRessdialogVisible = true;
    },
  async  showLocalBox(){
    const {data:res} = await    this.$http.get('/kuaidi/804909574412544580')
        if(res.meta.status!==200) return this.$message.error('获取物流信息失败')
       this.localList = res.data;
       this.localdiVisible = true;
    }
  },
};
</script>

<style>
</style>