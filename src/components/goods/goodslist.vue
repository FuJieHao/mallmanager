<template>
  <el-card class="box-card">
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 搜索框 -->
    <el-row class="searchArea">
      <el-col :span="24">
        <el-input v-model="searchValue" class="searchInput" clearable placeholder="请输入内容">
          <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-button 
        @click="$router.push({name: 'goodsadd'})" 
        type="success" 
        plain>添加商品</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table height="450px" border stripe v-loading="loading" :data="goodslist">
      <!-- 序号 -->
      <el-table-column type="index" label="#" width="60"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="200"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)" width="120"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="120"></el-table-column>
      <el-table-column label="创建日期" width="120">
        <template slot-scope="scope">{{scope.row.add_time | fmtdate}}</template>
      </el-table-column>
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

    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      pagesize: 4,
      pagenum: 1,
      total: -1,
      goodslist:[],
      searchValue: '',
      loading: true
    };
  },

  created() { 
      this.loadData()
    },
  methods: {
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.loadData();
    },

    handleCurrentChange(val) {
      this.pagenum = val;
      this.loadData();
    },
    handleSearch() {},
    async loadData() {
      this.loading = true;
      const { data: resData } = await this.$http.get(
        `goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      
      if (resData.meta.status === 200){
          this.goodslist = resData.data.goods
          this.total = resData.data.total;
          this.$message.success(resData.meta.msg);
          this.loading = false; 
      } else {
        this.$message.warning(resData.meta.msg);
      }
    }
  }
};
</script>

<style>
/* .box-card {
  height: 100%;
} */
.searchArea {
  margin-top: 20px;
}
.searchInput {
  width: 300px;
}
</style>