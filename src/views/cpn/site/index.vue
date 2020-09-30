<template>
  <div class="table-container">
    <!-- <el-form ref="queryModel" :inline="true" :model="queryModel" @keyup.enter.native="handleFilter">
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
    </el-form> -->
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
      <el-table-column prop="id" label="站点ID" width="100px" />
      <el-table-column prop="title" label="站点名称" :show-overflow-tooltip="true" width="200px" />
      <el-table-column prop="userName" label="创建人" :show-overflow-tooltip="true" />
      <el-table-column prop="groupName" label="所属公司" :show-overflow-tooltip="true" />
      <el-table-column label="创建时间" width="200px" align="center" prop="createDate">
        <template slot-scope="{row}">
          <span>{{ row.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="200px" align="center" prop="createDate">
        <template slot-scope="{row}">
          <span>{{ row.updateDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="过期时间" width="200px" align="center" prop="createDate">
        <template slot-scope="{row}">
          <span>{{ row.expiredDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status">
        <template slot-scope="{row}">
          <span :class="'circle-site-status-' + row.status">{{ row.status|status }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150px">
        <template slot-scope="{row}">
          <el-button size="mini" type="primary" @click="dialogOpen(row.id)">设置过期时间</el-button>
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
        <div class="label-info-container">
          <div>
            <el-date-picker
              v-model="form.expiredDate"
              type="date"
              placeholder="选择过期日期"
              value-format="yyyy-MM-dd 23:59:59"
            />
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ok">设 置</el-button>
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import * as siteAPI from '@/api/cpn/site'
import * as Dict from '@/utils/dictionary-getter'

export default {
  name: 'Site',
  components: { Pagination },
  directives: { waves },
  filters: {
    status(value) {
      return Dict.getLabel(Dict.SITE_STATUS, value)
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      dialogVisible: false,
      form: {
        expiredDate: ''
      },
      queryModel: {
        page: 1,
        size: 10
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
      this.query()
    },
    query() {
      this.listLoading = true
      siteAPI.findAll(this.queryModel).then(res => {
        this.listLoading = false
        this.total = res.data.totalElements
        this.list = res.data.content
      })
    },
    dialogOpen(id) {
      this.dialogVisible = true
      this.handleId = id
    },
    ok() {
      if (!this.form.expiredDate) {
        return
      }
      const expiredDate = (new Date(this.form.expiredDate).getTime())
      siteAPI.setExpiredDate(this.handleId, expiredDate).then(res => {
        this.dialogVisible = false
        this.$message.success('设置成功')
        this.form.expiredDate = ''
        this.query()
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/platform/service/site.scss";
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
