<template>
  <div class="table-container">
    <el-form ref="queryModel" :inline="true" :model="queryModel" @keyup.enter.native="handleFilter">
      <el-form-item prop="mobile">
        <el-input v-model="queryModel.mobile" placeholder="用户" style="width: 200px;" class="filter-item" />
      </el-form-item>
      <!-- <el-form-item prop="locked">
        <el-select v-model="queryModel.locked" style="width: 140px" class="filter-item" @change="handleFilter">
          <el-option key="-1" label="全部" value="" />
          <el-option v-for="(value, key) in dataSource.status" :key="key" :label="value" :value="key" />
        </el-select>
      </el-form-item> -->
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
      <el-table-column prop="message" label="日志信息" :show-overflow-tooltip="true" />
      <el-table-column prop="mobile" label="用户" width="260px" align="center" />
      <el-table-column prop="logType" label="日志类型" width="160px" />
      <el-table-column label="操作时间" width="210px" align="center" sortable="custome" prop="createDate">
        <template slot-scope="{row}">
          <span>{{ row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryModel.page" :limit.sync="queryModel.size" @pagination="query" />
  </div>
</template>
<script>
import * as Dict from '@/utils/dictionary-getter'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { findAll } from '@/api/platform/service/log'

export default {
  name: 'SysLog',
  components: { Pagination },
  directives: { waves },
  filters: {
    // status(value) {
    //   return Dict.getLabel(Dict.STATUS_TYPE, value)
    // }
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
      user: {},
      queryModel: {
        locked: '',
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
      findAll(this.queryModel).then(res => {
        this.total = res.data.records
        this.list = res.data.rows
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
