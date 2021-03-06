<template>
  <div class="table-container">
    <el-form ref="queryModel" :inline="true" :model="queryModel" @keyup.enter.native="handleFilter">
      <el-form-item prop="id">
        <el-input v-model="queryModel.id" placeholder="部署单编号" style="width: 200px;" class="filter-item" />
      </el-form-item>
      <el-form-item prop="deployStatus">
        <el-select v-model="queryModel.deployStatus" style="width: 140px" class="filter-item" placeholder="状态" @change="handleFilter">
          <el-option v-for="(value, key) in dataSource.status" :key="key" :label="value" :value="key" />
        </el-select>
      </el-form-item>
      <el-form-item prop="groupId">
        <el-select v-model="queryModel.groupId" style="width: 140px" class="filter-item" placeholder="所属公司" @change="handleFilter">
          <el-option v-for="group in dataSource.groups" :key="group.id" :label="group.name" :value="group.id" />
        </el-select>
      </el-form-item>
      <el-form-item prop="keywords">
        <el-input v-model="queryModel.keywords" placeholder="关键字" style="width: 200px;" class="filter-item" />
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
      <el-table-column prop="id" label="部署单编号" align="center" width="150" />
      <el-table-column prop="title" label="部署内容" :show-overflow-tooltip="true" />
      <el-table-column prop="groupName" label="所属公司" :width="groupColumnWidth" :show-overflow-tooltip="true" />
      <el-table-column prop="updateDate" label="更新时间" width="160px" align="center" sortable="custome">
        <template slot-scope="{row}">
          <span>{{ row.updateDate | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120" align="center">
        <template slot-scope="{row}">
          <span :class="'circle-deploy-status-' + row.deployStatus">{{ row.deployStatus | deployStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="90px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <router-link :to="'/service/deploy/detail/'+scope.row.id">
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
import { list } from '@/api/group'
import Bowser from 'bowser'

export default {
  name: 'Deploy',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      groupColumnWidth: 160,
      dataSource: {
        status: Dict.getData(Dict.DEPLOY_STATUS),
        groups: []
      },
      queryModel: {
        deployStatus: '',
        id: '',
        groupId: '',
        keywords: '',
        page: 1,
        size: 10,
        sidx: 'updateDate',
        sord: 'desc'
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.listQuery = new ListQuery('/api/tiger/platform/deploy')
      this.query()

      list().then(res => {
        this.dataSource.groups = res.data.rows
      })

      const browser = Bowser.getParser(window.navigator.userAgent)
      if (browser.getBrowser().name === 'Safari') {
        this.groupColumnWidth = 'auto'
      }
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
@import '@/styles/platform/service/deploy.scss';

.table-container {
  padding: 30px 20px;
}
</style>
