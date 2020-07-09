<template>
  <el-card>
    <!-- 面包屑 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <!-- 按钮 -->
    <el-row class="addrolebtn">
      <el-col>
        <el-button type="primary">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="rolelist" style="width: 100%">
      <el-table-column type="expand" width="80">
        <template slot-scope="scope">
          <el-row v-for="(item1, i) in scope.row.children" :key="i">
            <el-col :span="4">
              <el-tag @close="deleRight(scope.row, item1.id)" closable>{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2, i) in item1.children" :key="i">
                <el-col :span="4">
                  <el-tag
                    @close="deleRight(scope.row, item2.id)"
                    closable
                    type="success"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    @close="deleRight(scope.row, item3.id)"
                    closable
                    type="warning"
                    v-for="(item3, i) in item2.children"
                    :key="i"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- 无权限的提示 -->
          <span v-if="scope.row.children.length===0">未分配权限</span>
        </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="120"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="160"></el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
            @click="showEditUserDia(scope.row)"
          ></el-button>
          <el-button
            @click="showSetRightDia(scope.row)"
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            circle
          ></el-button>
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
            @click="showDeleUserMsgBox(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改权限的对话框 -->
    <el-dialog title="修改权限" :visible.sync="dialogFormVisibleRight">
      <!-- 树形结构
      data 数据源
      show-checkbox -> 选择框
      node-key 每个节点的唯一标识 通常是data数据源中的key名id 
      default-expanded-keys 默认展开[要展开的节点id]
      default-checked-keys [要选择的节点的id]
      props 配置项 {label, children}
      label 节点的文字标题和children节点的子节点
      :default-expanded-keys="[2, 3]"
      :default-checked-keys="[5]"-->
      <el-tree
        ref="tree"
        :data="treelist"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="arrcheck"
        :props="defaultProps"
      ></el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
        <el-button type="primary" @click="setRoleRight()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      rolelist: [],
      dialogFormVisibleRight: false,
      treelist: [],
      defaultProps: {
          label: 'authName',
          children: 'children'
      },
      arrcheck: [],
      //当前角色id
      currRoleId: -1
    };
  },
  created() {

    this.getRolelist();
  },

  methods: {
    
    //修改权限 - 发送请求
    async setRoleRight() {
        //roles/:roleId/rights
        // roleId 当前要修改权限的角色id
        //rids 树形节点中 所有全选和半选的label的id []

        //获取全选的id的数组arr1 getCheckedKeys()
        let arr1 = this.$refs.tree.getCheckedKeys()
        //获取半选的id的数组arr2 getHalfCheckedKeys()
        let arr2 = this.$refs.tree.getHalfCheckedKeys()
        //合并数组  ES6 展开运算符  ...数组或者对象
        let arr = [...arr1, ...arr2]

        const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {rids:arr.join(',')})

        //更新视图
        this.getRolelist()
        this.dialogFormVisibleRight = false
    },

    //修改权限
    async showSetRightDia(role) {

      //给currRoleId赋值
      this.currRoleId = role.id

      //获取树形结构的权限数据
      const res = await this.$http.get(`rights/tree`)
      this.treelist = res.data.data

      //获取当前角色role的权限id
      let arrtemp = []
      role.children.forEach(item1 => {
          item1.children.forEach(item2 => {
              item2.children.forEach(item3 => {
                  arrtemp.push(item3.id)
              })
          })
      })
      this.arrcheck = arrtemp

      this.dialogFormVisibleRight = true;
    },

    //取消权限
    async deleRight(role, rightId) {
      //roles/:roleId/rights/:rightId
      //roleId: 当前角色的id
      //rightId 要删除的权限id

      //优化处理 局部刷新
      const res = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
      role.children = res.data.data;
    },

    async getRolelist() {
      const res = await this.$http.get("roles");
      this.rolelist = res.data.data;
    }
  }
};
</script>

<style>
.addrolebtn {
  margin-top: 20px;
}
</style>