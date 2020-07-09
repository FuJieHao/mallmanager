<template>
  <el-card>
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品分类"></my-bread>
    <!-- 搜索框 -->
    <el-row class="add_btn">
      <el-col :span="24" class="searchArea">
        <el-button type="success" @click="addGoodsCate()">添加分类</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table height="450px" border stripe :data="goodscate">
      <!-- 
          treeKey -> nodekey -> 节点唯一标识 id
          parentKey -> 父节点id
          levelKey -> 当前节点的级别
          childKey -> 子节点
       -->
      <el-tree-grid 
      prop="cat_name" 
      label="分类名称"
      treeKey="cat_id"
      parentKey="cat_pid"
      levelKey="cat_level"
      childKey="children">

      </el-tree-grid>

      <el-table-column label="级别">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_level===0">一级</span>
          <span v-else-if="scope.row.cat_level===1">二级</span>
          <span v-else-if="scope.row.cat_level===2">三级</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有效">
        <template slot-scope="scope">
          <span v-if="scope.row.cat_deleted===false">有效</span>
          <span v-else-if="scope.row.cat_deleted===true">无效</span>
        </template>
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
      :page-sizes="[8, 10, 12, 14]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 对话框 -->
    <el-dialog title="修改权限" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="分类名称" label-width="120px">
            <el-input v-model="form.cat_name" aria-autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类" label-width="120px">
          <!-- 级联选择器 -->
          <el-cascader
            v-model="selectedOptions"
            clearable
            :options="caslist"
            :props="defaultProp"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>

//引入element-tree-grid
var ElTreeGrid = require('element-tree-grid')

export default {
  //组件名 <el-tree-grid>
  components: { ElTreeGrid },

  data() {
    return {
      selectedOptions: [],
      defaultProp: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      dialogFormVisibleAdd:false,
      pagesize: 8,
      pagenum: 1,
      total: -1,
      goodscate: [],
      form: {
        cat_pid: -1,
        cat_name: "",
        cat_level: -1
      },
      caslist: []
    };
  },

  created() {
    this.getGoodsCate();
  },

  methods: {

    async addCate() {
        if (this.selectedOptions.length === 0) {
            this.form.cat_pid = 0
            this.form.cat_level = 0
        } else if (this.selectedOptions.length === 1) {
            this.form.cat_pid = this.selectedOptions[0]
            this.form.cat_level = 1
        } else if (this.selectedOptions.length === 2) {
            this.form.cat_pid = this.selectedOptions[1]
            this.form.cat_level = 2
        }
        const res = await this.$http.post(`categories`, this.form)
        this.getGoodsCate()
        this.dialogFormVisibleAdd = false
        this.form = {}
    },

    async addGoodsCate() {
        //获取二级分类的数据
        const res = await this.$http.get(`categories?type=2`)
        this.caslist = res.data.data
        this.dialogFormVisibleAdd = true;
    },

    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getGoodsCate();
    },

    handleCurrentChange(val) {
      this.pagenum = val;
      this.getGoodsCate();
    },
    async getGoodsCate() {
      const res = await this.$http.get(
        `categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      this.total = res.data.data.total;
      this.goodscate = res.data.data.result;
    }
  }
};
</script>

<style>
.add_btn {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>