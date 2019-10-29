<template>
  <div class="table-container">
    <el-form ref="queryModel" :inline="true" :model="queryModel" @keyup.enter.native="handleFilter">
      <el-form-item prop="id">
        <el-input v-model="queryModel.id" placeholder="订单编号" style="width: 200px;" class="filter-item" />
      </el-form-item>
      <el-form-item prop="refundStatus">
        <el-select v-model="queryModel.refundStatus" style="width: 140px" class="filter-item" placeholder="状态" @change="handleFilter">
          <el-option v-for="(value, key) in dataSource.status" :key="key" :label="value" :value="key" />
        </el-select>
      </el-form-item>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button v-waves class="filter-item" @click="resetForm('queryModel')">重置</el-button>
    </el-form>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      cell-class-name="tb-cell"
    >
      <el-table-column prop="id" label="退款编号" align="center" width="150" />
      <el-table-column prop="title" label="退款理由" />
      <el-table-column prop="groupName" label="所属公司" width="160px" />
      <el-table-column label="申请时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createDate | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退款时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.paidDate | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120" align="center">
        <template slot-scope="{row}">
          <span :class="'circle-refund-status-' + row.refundStatus">{{ row.refundStatus | refundStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="退款金额(元)" width="100" align="right" />
      <el-table-column label="操作" align="center" width="90px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="'/service/refund/detail/'+scope.row.id">
            <el-link type="primary" size="small">
              详情
            </el-link>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryModel.page" :limit.sync="queryModel.size" @pagination="query" />
  </div>
</template>
<script>
import ListQuery from '@/utils/list-query'
import * as Dict from '@/utils/dictionary-getter'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { changeStatus } from '@/api/user'

export default {
  name: 'Refund',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      dataSource: {
        status: Dict.getData(Dict.REFUND_STATUS)
      },
      queryModel: {
        refundStatus: '',
        id: '',
        page: 1,
        size: 10
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.listQuery = new ListQuery('/api/tiger/platform/refund')
      this.query()
    })
  },
  methods: {
    handleFilter() {
      this.queryModel.page = 1
      this.query()
    },
    query() {
      this.listLoading = true
      this.listQuery.trigger(this.queryModel).then(res => {
        this.total = res.records
        this.list = res.rows
        this.listLoading = false
      })
    },
    changeStatus(user) {
      this.listLoading = true
      changeStatus(user.id).then(res => {
        user.locked = !user.locked
        this.listLoading = false
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/platform/service/refund.scss';

.table-container {
  padding: 30px 20px;
}
</style>
<style>
.tb-cell .cell {
  white-space: nowrap;
}
</style>
