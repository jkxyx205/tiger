<template>
  <div class="table-container">
    <el-form ref="queryModel" :inline="true" :model="queryModel" @keyup.enter.native="handleFilter">
      <el-form-item prop="name">
        <el-input v-model="queryModel.name" placeholder="企业名称" style="width: 200px;" class="filter-item" />
      </el-form-item>
      <el-form-item prop="locked">
        <el-select v-model="queryModel.locked" style="width: 140px" class="filter-item" @change="handleFilter">
          <el-option key="-1" label="全部" value="" />
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
      <el-table-column prop="name" label="企业名称" :show-overflow-tooltip="true" />
      <el-table-column label="企业LOGO" width="260px" align="center">
        <template slot-scope="{row}">
          <img v-lazy="row.logo" alt="" style="width: 23px;">
        </template>
      </el-table-column>
      <el-table-column label="管理员" width="180px" align="center">
        <template slot-scope="{row}">
          <el-link type="info" @click="userInfo(row.adminUserId)">
            <span :title="row.adminName">{{ row.adminName }}</span>
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="210px" align="center" sortable="custome" prop="createDate">
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
    <el-dialog
      title="管理员详情"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <div class="admin-info-container">
        <div class="avatar">
          <img v-lazy="user.avatar" alt="" class="avatar">
        </div>
        <div class="label-info-container">
          <div>
            <div class="display-item">
              <label>名字：</label><div>{{ user.nickname }}</div>
            </div>
            <div class="display-item">
              <label>性别：</label><div>{{ user.sex | sex }}</div>
            </div>
            <div class="display-item">
              <label>手机：</label><div>{{ user.mobile }}</div>
            </div>
            <div class="display-item">
              <label>签名：</label><div>{{ user.signature }}</div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import ListQuery from '@/utils/list-query'
import * as Dict from '@/utils/dictionary-getter'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { changeStatus } from '@/api/group'
import { getUserById } from '@/api/user'

export default {
  name: 'Groups',
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
      dialogVisible: false,
      dataSource: {
        status: Dict.getData(Dict.STATUS_TYPE)
      },
      user: {},
      queryModel: {
        locked: '',
        name: '',
        page: 1,
        size: 10,
        sidx: 'createDate',
        sord: 'desc'
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.listQuery = new ListQuery('/api/tiger/platform/groups')
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
    changeStatus(group) {
      this.listLoading = true
      changeStatus(group.id).then(res => {
        group.locked = !group.locked
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
    },
    userInfo(userId) {
      getUserById(userId).then(res => {
        this.user = res.data
        this.dialogVisible = true
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.table-container {
  padding: 30px 20px;
}

.admin-info-container {
  .avatar {
    text-align: center;
    margin-bottom: 24px;
    img {
      height: width;
    }
  }
  .display-item {
    position: relative;
    margin-bottom: 16px;
    line-height: 1.6;
    label {
      position: absolute;
    }
    div {
      margin-left: 40px;
    }
  }
  .label-info-container {
    display: flex;
    padding: 0 16%;
    justify-content: center;
  }
}
</style>
<style>
</style>
