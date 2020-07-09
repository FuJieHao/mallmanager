<template>
  <el-card>
    <!-- 面包屑 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>-->
    <my-bread level1="权限管理" level2="权限列表"></my-bread>
    <br>
    <br>
    <!-- 表格 -->
    <el-table
    height="450px"
     :data="rightlist" border style="width: 100%">
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="100"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column label="层级">
          <template slot-scope="scope">
              <span v-if="scope.row.level==='0'">一级</span>
              <span v-if="scope.row.level==='1'">二级</span>
              <span v-if="scope.row.level==='2'">三级</span>
          </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      rightlist: []
    };
  },
  created() {
    this.getRightlist();
  },

  methods: {
    async getRightlist() {
      const res = await this.$http.get("rights/list");
      this.rightlist = res.data.data;
    }
  }
};
</script>

<style>
</style>