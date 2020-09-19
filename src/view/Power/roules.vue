<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <!-- 添加角色按钮区 -->
          <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom',index==0?'bdtop':'']"
              v-for="(item1,index) in scope.row.children"
              :key="index"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="closeRolesTag(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[index2==0?'':'bdtop']"
                  v-for="(item2,index2) in item1.children"
                  :key="index2"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="closeRolesTag(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <template>
                      <el-tag
                        v-for="(item3,index3) in item2.children"
                        :key="index3"
                        closable
                        type="warning"
                        @close="closeRolesTag(scope.row,item3.id)"
                      >{{item3.authName}}</el-tag>
                    </template>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-search" @click="editRoules(scope.row.id)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRoules(scope.row.id)"
            >删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色权限对话框 -->
    <el-dialog title="添加角色" :visible.sync="addDialogVisible" @close="addDialogClose()" width="50%">
      <!-- 内容主体区 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRulesRef" label-width="70px">
        <el-form-item label-width="100px" label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label-width="100px" label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 内容底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoules">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色信息 -->
<el-dialog
  title="修改角色"
  :visible.sync="editDialogVisible"
  @close="editDialogClose()"
  width="50%"
  >
  <!-- 内容主体区 -->
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRulesRef" label-width="70px" >
  <el-form-item label-width="100px"  label="角色名称" prop="roleName">
    <el-input v-model="editForm.roleName"></el-input>
  </el-form-item>
 <el-form-item label-width="100px"  label="角色描述" prop="roleDesc">
    <el-input v-model="editForm.roleDesc"></el-input>
  </el-form-item>
  
  </el-form>
   <!-- 内容底部 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserInfo()">确 定</el-button>
  </span>
</el-dialog>
<!-- 分配权限对话框 -->
<el-dialog
  title="分配权限"
  :visible.sync="setRightDialogVisible"
  width="50%"
  @close="setRightDialogClose"
  >
  <!-- 树形控件 -->
  <el-tree :data="rightsList" :props="treeProps"
  show-checkbox
  node-key='id'
  default-expand-all
  :default-checked-keys='defKeys'
  ref='treeRef'></el-tree>

  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleId:'',
      // 所有角色列表数据
      rolesList: [],
      rightsList:[],
      addDialogVisible: false,//添加角色
      editDialogVisible:false,//修改角色
      setRightDialogVisible:false,//分配权限
      addForm: {
        roleName: "",
        roleDesc: "",
      },
      addFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "角色名称长度在2~10之间",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "角色名称长度在1~50之间",
            trigger: "blur",
          },
        ],
      },
       editForm: {
        roleName: "",
        roleDesc: "",
      },
      editFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "角色名称长度在2~10之间",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "角色名称长度在1~50之间",
            trigger: "blur",
          },
        ]
      },
      // 树形控件
      treeProps:{
        children: 'children',
          label: 'authName'
      },
      // 默认选中的树形组件
      defKeys:[]
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("获取角色列表失败");
      this.rolesList = res.data;
    },
    async closeRolesTag(userId, rolsId) {
      const confimResult = await this.$confirm(
        "此操作将永久删除该用户权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confimResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${userId.id}/rights/${rolsId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除用户权限失败");
      }
      userId.children = res.data;
      this.$message.success("删除用户权限成功");
    },
    async addRoules() {
      this.$refs.addFormRulesRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addForm);
        if (res.meta.status !== 201) return this.$message.error("添加角色失败");
        this.$message.success("添加角色成功");
        this.addDialogVisible = false;
        this.getRolesList();
      });
    },
    addDialogClose() {
      this.$refs.addFormRulesRef.resetFields();
    },
    async deleteRoules(id) {
      const confirmDelete = await this.$confirm(
        "此操作将永久删除该用户权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmDelete !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const {data:res} = await this.$http.delete('roles/'+id)
      if(res.meta.status!==200) return this.$message.error('删除角色失败')
      this.$message.success('删除角色成功')
      this.getRolesList();

    },
    editDialogClose(){
      this.$refs.editFormRulesRef.resetFields()
    },
   async editRoules(id){
     const {data:res} = await this.$http.get('roles/'+id)
    if(res.meta.status!==200)return this.$message.error('查询角色信息失败！')
    this.editForm = res.data;
    this.editDialogVisible = true;
  },
   editUserInfo(){
    this.$refs.editFormRulesRef.validate(async valid =>{
      if(!valid) return
      const {data:res} = await this.$http.put('roles/'+this.editForm.roleId,{
        roleName:this.editForm.roleName,
        roleDesc:this.editForm.roleDesc,
      });
      if(res.meta.status!==200) return this.$message.error('编辑角色信息失败')
      this.$message.success('编辑角色信息成功')
      this.editDialogVisible = false;
      this.getRolesList()
    })
    },
    // 展示分配权限的对话框
   async showSetRightDialog(role){
     this.roleId = role.id;
     this.getleafKeys(role,this.defKeys)
    const {data:res} = await  this.$http.get('rights/tree')
      if(res.meta.status!==200) return this.$mesasge.error('获取权限数据失败')
    this.rightsList = res.data;
      this.setRightDialogVisible = true;
  },
  setRightDialogClose(){
    this.defKeys = [];
  },
    // 获取所有三级权限id，保存到数组中，进项默认选中设置
    getleafKeys(node,arr){
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(element => {
        this.getleafKeys(element,arr)
      });
    },
  // 分配权限
 async allotRights(){
    const keys = [
      ...this.$refs.treeRef.getCheckedKeys(),
     ...this.$refs.treeRef.getHalfCheckedKeys(),
    ]
    const idStr = keys.join(',')
   const {data:res} = await this.$http.post('roles/'+this.roleId+'/rights',{rids:idStr})
  if(res.meta.status!==200) return this.$message.error('分配权限失败')
    this.$message.success('分配权限成功')
    this.getRolesList();
    this.setRightDialogVisible = false;
 }
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
</style>