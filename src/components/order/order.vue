<template>
  <el-card>
    <!-- 面包屑 -->
    <my-bread level1="订单管理" level2="订单列表"></my-bread>
    <!-- 表格 -->
    <el-table style="width: 100%" :data="list">
      <el-table-column type="index" label="#" width="40"></el-table-column>
      <el-table-column prop="order_number" label="订单编号" width="180"></el-table-column>
      <el-table-column prop="order_price" label="订单价格"></el-table-column>
      <el-table-column prop="order_pay" label="是否付款" width="80">
          <template slot-scope="scope">
              <el-tag v-if="scope.row.order_pay==='0'">已付款</el-tag>
              <el-tag type="danger" v-if="scope.row.order_pay==='1'">未付款</el-tag>
          </template>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货" width="100"></el-table-column>
      <el-table-column label="下单时间" width="90">
          <template slot-scope="scope">
              {{scope.row.create_time | fmtdate}}
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
            @click="showEditdia(scope.row)"
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
    <el-dialog title="修改订单地址" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="省市区" label-width="120px">
            <el-cascader
            :props="defaultProp"
            clearable
            :options="catlist"
            v-model="selectedOptions">
            </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" label-width="120px">
            <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="showEditdia()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>


<script>
import catlist from "./city_data.js"
// .vue 引入 .js库(swiper.js/zepto.js/iscroll.js/wow.js(整屏滚动))

export default {
    data () {
        return {
            list: [],
            catlist: [],
            defaultProp: {
                expandTrigger: "hover",
                label: "name",
                value: "name",
                children: "city"
            },
            selectedOptions:[],
            form: {
                address:""
            },
            dialogFormVisible: false,
            pagenum: 1,
            pagesize: 10,
            total: -1
        }
    },
    created () {
        this.getData()
    },
    methods: {

      handleSizeChange(val) {
        this.pagesize = val;
        this.pagenum = 1;
        this.getData();
      },

      handleCurrentChange(val) {
        this.pagenum = val;
        this.getData();
      },
      async getData() {
          const res = await this.$http.get(`orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
          this.list = res.data.data.goods
          this.total = res.data.data.total
      },
      showEditdia() {
          this.catlist = catlist
          console.log(this.catlist)
          this.dialogFormVisible = true
      }

    },
}
</script>

<style>
    
</style>