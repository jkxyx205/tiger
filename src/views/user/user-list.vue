<template>
  <div class="table-container">
    <el-form ref="queryModel" :inline="true" :model="queryModel" @keyup.enter.native="handleFilter">
      <el-form-item prop="mobile">
        <el-input v-model="queryModel.mobile" placeholder="帐号" style="width: 200px;" class="filter-item" />
      </el-form-item>
      <el-form-item prop="nickname">
        <el-input v-model="queryModel.nickname" placeholder="名字" style="width: 200px;" class="filter-item" />
      </el-form-item>
      <el-form-item prop="locked">
        <el-select v-model="queryModel.locked" style="width: 140px" class="filter-item" placeholder="状态" @change="handleFilter">
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
      @sort-change="sort"
    >
      <el-table-column prop="mobile" label="帐号" align="center" width="120" />
      <el-table-column prop="nickname" label="名字" width="150px" align="center" :show-overflow-tooltip="true" />
      <el-table-column label="头像" width="60px" align="center">
        <template slot-scope="{row}">
          <img v-lazy="row.avatar" alt="" style="width: 23px;">
        </template>
      </el-table-column>
      <el-table-column label="性别" width="60px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sex | sex() }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="signature" label="签名" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          <span :title="row.signature">{{ row.signature }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册时间" width="210px" align="center" sortable="custome" prop="createDate">
        <template slot-scope="{row}">
          <span>{{ row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110px" align="center">
        <template slot-scope="{row}">
          <span :style="row.locked ? 'color: #F56C6C' : 'color:#67C23A'">{{ row.locked & 1 | status() }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="90px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button v-if="!row.locked" size="mini" type="danger" @click="changeStatus(row)">禁用</el-button>
          <el-button v-else size="mini" type="success" @click="changeStatus(row)">启用</el-button>
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
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { changeStatus } from '@/api/user'

export default {
  name: 'Users',
  components: { Pagination },
  directives: { waves },
  filters: {
    sex(value) {
      return Dict.getLabel(Dict.SEX_TYPE, value)
    },
    status(value) {
      return Dict.getLabel(Dict.STATUS_TYPE, value)
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      dataSource: {
        status: Dict.getData(Dict.STATUS_TYPE)
      },
      queryModel: {
        locked: '',
        nickname: '',
        mobile: '',
        page: 1,
        size: 10,
        sidx: 'createDate',
        sord: 'desc'
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.listQuery = new ListQuery('/api/tiger/platform/users/list')
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
    sort({ column, prop, order }) {
      this.queryModel.sidx = prop
      this.queryModel.sord = (order === 'ascending' ? 'asc' : 'desc')
      this.handleFilter()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
.table-container {
  padding: 30px 20px;
}
</style>
<style>
</style>
