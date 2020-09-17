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
          <el-button type="primary">添加角色</el-button>
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
                <el-tag
                   closable
                        @close="closeRolesTag(scope.row,item1.id)">{{item1.authName}}</el-tag>
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
                    <el-tag type="success"
                     closable
                        @close="closeRolesTag(scope.row,item2.id)">{{item2.authName}}</el-tag>
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
          <template slot-scope>
            <el-button size="mini" type="primary" icon="el-icon-search">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolesList: [],
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
   async closeRolesTag(userId,rolsId){
        const confimResult  = await this.$confirm('此操作将永久删除该用户权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);
        if(confimResult!=='confirm'){
          return this.$message.info('已取消删除')
        }
    const {data:res} = await this.$http.delete(`roles/${userId.id}/rights/${rolsId}`)
    if(res.meta.status!==200){
      return this.$message.error('删除用户权限失败');
    }
    userId.children = res.data
    this.$message.success('删除用户权限成功');
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