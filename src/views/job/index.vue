<template>
  <div class="table-container">
    <el-form ref="queryModel" :inline="true" :model="queryModel" @keyup.enter.native="handleFilter">
      <el-form-item prop="id">
        <el-input v-model="queryModel.id" placeholder="工单编号" style="width: 200px;" class="filter-item" />
      </el-form-item>
      <!-- <el-form-item prop="nickname">
        <el-input v-model="queryModel.nickname" placeholder="昵称" style="width: 200px;" class="filter-item" />
      </el-form-item> -->
      <el-form-item prop="jobStatus">
        <el-select v-model="queryModel.jobStatus" style="width: 140px" class="filter-item" placeholder="工单状态" @change="handleFilter">
          <el-option v-for="(value, key) in dataSource.status" :key="key" :label="value" :value="key" />
        </el-select>
      </el-form-item>
      <el-form-item prop="jobType">
        <el-select v-model="queryModel.jobType" style="width: 140px" class="filter-item" placeholder="工单类型" @change="handleFilter">
          <el-option v-for="(value, key) in dataSource.type" :key="key" :label="value" :value="key" />
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
      <el-table-column prop="id" label="工单编号" align="center" width="200" />
      <el-table-column prop="title" label="问题描述" />
      <el-table-column label="工服类型" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.jobType | type() }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100px" align="center">
        <template slot-scope="{row}">
          <span :class="'circle-job-status-' + row.jobStatus">{{ row.jobStatus | status() }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="updateDate" label="更新时间" width="210px" align="center" sortable="custome">
        <template slot-scope="{row}">
          <span>{{ row.updateDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="90px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- <el-button size="mini" type="success">查看详情</el-button> -->
          <router-link :to="'/service/job/detail/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">
              详情
            </el-button>
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

export default {
  name: 'JobList',
  components: { Pagination },
  directives: { waves },
  filters: {
    status(value) {
      return Dict.getLabel(Dict.JOB_STATUS_TYPE, value)
    },
    type(value) {
      return Dict.getLabel(Dict.JOB_TYPE, value)
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      dataSource: {
        status: Dict.getData(Dict.JOB_STATUS_TYPE),
        type: Dict.getData(Dict.JOB_TYPE)
      },
      queryModel: {
        jobStatus: '',
        jobType: '',
        id: '',
        page: 1,
        size: 10,
        sidx: 'updateDate',
        sord: 'desc'
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.listQuery = new ListQuery('/api/tiger/platform/jobs')
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
@import "@/styles/platform/service/job.scss";
.table-container {
  padding: 30px 20px;
}
</style>
<style>
.tb-cell .cell {
  white-space: nowrap;
}
</style>
