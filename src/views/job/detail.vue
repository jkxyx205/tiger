<template>
  <div class="job-detail-container">
    <div class="job-master-container border">
      <div class="job-master-container-header">
        <div class="data-item">
          <label>工单编号:</label><span>{{ job.id }}</span>
        </div>
        <div class="data-item">
          <label>类型:</label><span>{{ job.jobType | type }}</span>
        </div>
        <div class="data-item">
          <label>状态:</label><span :class="'circle-job-status-' + job.jobStatus">{{ job.jobStatus | status }}</span>
        </div>
        <div v-if="over" class="pull-right operator-bar">
          <el-button v-if="job.jobStatus === 0" size="small" @click="makeProcess()">分配</el-button>
          <el-button v-if="job.jobStatus !== 3 && job.jobStatus !== 4 && job.jobType === 0" size="small" @click="makeOrderDialog()">创建订单</el-button>
          <el-button v-if="job.jobStatus !== 3 && job.jobStatus !== 4 && job.jobType === 0" size="small" @click="makeDeployDialog()">创建部署单</el-button>
          <el-button v-if="job.jobStatus === 0 || job.jobStatus === 1" size="small" @click="makeFinished()">处理完成</el-button>
          <el-button v-if="job.jobStatus === 2" size="small" @click="reDo()">重新处理</el-button>
        </div>
      </div>
      <div class="job-master-container-body">
        <div class="data-item">
          <label>问题描述:</label><span>{{ job.title }}</span>
        </div>
        <div v-if="job.tags && job.tags.length > 0" class="tags-container">
          <label><i class="el-icon-paperclip" /></label>
          <span v-for="(tag, index) in job.tags" :key="index">{{ tag }}</span>
        </div>
      </div>
      <div class="job-master-container-footer">
        <div class="data-item">
          <label>联系人:</label><span>{{ job.contactName }}</span>
        </div>
        <div class="data-item">
          <label>联系电话:</label><span>{{ job.contactNumber }}</span>
        </div>
        <div class="data-item">
          <label>所属公司:</label><span>{{ job.groupName }}</span>
        </div>
        <div class="pull-right" style="margin-right: -24px;">
          <div class="data-item">
            <label>提交人:</label><span>{{ job.creatorName }}</span>
          </div>
          <div class="data-item">
            <label>创建时间:</label><span>{{ job.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="work-flow-container">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="沟通纪录" name="log">
          <log :logs="job.logList" />
        </el-tab-pane>
        <template v-if="job.jobType === 0">
          <el-tab-pane label="订单单据" name="order">
            <order-list :order-list="job.orderList" />
          </el-tab-pane>
          <el-tab-pane label="部署单据" name="deploy">
            <deploy-list :deploy-list="job.deployList" />
          </el-tab-pane>
        </template>
      </el-tabs>
    </div>
    <template v-if="over">
      <feedback :id="job.id" :log-target="1" @update="feedbackUpdated" />
    </template>
    <create-order ref="createOrder" :job="job" @create-success="orderCreated()" />
    <create-deploy ref="createDeploy" :job="job" @create-success="deployCreated()" />
  </div>
</template>

<script>
import { findDetailById, changeStatus } from '@/api/platform/service/job'
import { getJobOrderList } from '@/api/platform/service/order'
import { getJobDeployList } from '@/api/platform/service/deploy'
import * as Dict from '@/utils/dictionary-getter'
import Log from '@/components/Log'
import { list } from '@/api/log'
import OrderList from './components/OrderList'
import DeployList from './components/DeployList'
import CreateOrder from './components/CreateOrder'
import CreateDeploy from './components/CreateDeploy'
import Feedback from '@/components/Feedback'

const PROCESSING_STATUS = '1'
const MAKE_FINISHED_STATUS = '2'

export default {
  name: 'JobDetail',
  filters: {
    status(value) {
      return Dict.getLabel(Dict.JOB_STATUS_TYPE, value)
    },
    type(value) {
      return Dict.getLabel(Dict.JOB_TYPE, value)
    }
  },
  components: {
    Log, CreateOrder, CreateDeploy, OrderList, Feedback, DeployList
  },
  data() {
    return {
      id: this.$route.params.id,
      job: {},
      activeName: 'log'
    }
  },
  computed: {
    over() {
      return this.job.jobStatus === 0 || this.job.jobStatus === 1 || this.job.jobStatus === 2
    }
  },
  created() {
    findDetailById(this.id).then(res => {
      this.job = res.data
    })
  },
  mounted() {
    setInterval(this._refreshLog, 1000 * 60)
  },
  methods: {
    makeFinished() {
      this._changeStatus(MAKE_FINISHED_STATUS)
    },
    makeProcess() {
      this._changeStatus(PROCESSING_STATUS)
    },
    reDo() {
      this._changeStatus(PROCESSING_STATUS)
    },
    makeOrderDialog() {
      this.$refs.createOrder.openDialog()
    },
    makeDeployDialog() {
      this.$refs.createDeploy.openDialog()
    },
    orderCreated() {
      this._refreshLog()
      this._refreshOrder()
    },
    deployCreated() {
      this._refreshLog()
      this._refreshDeploy()
    },
    feedbackUpdated(data) {
      this.job.logList.push(data)
    },
    _refreshLog() {
      list(this.job.id).then(res => {
        this.job.logList = res.data
      })
    },
    _refreshOrder() {
      getJobOrderList(this.job.id).then(res => {
        this.job.orderList = res.data
      })
    },
    _refreshDeploy() {
      getJobDeployList(this.job.id).then(res => {
        this.job.deployList = res.data
      })
    },
    _changeStatus(status) {
      changeStatus(this.job.id, status).then(res => {
        this.job.jobStatus = res.data
        this._refreshLog()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/platform/service/job.scss";

.job-detail-container {
  padding: 30px 20px;
  & > div {
    margin-bottom: 24px;
  }
  font-size: 14px;
}

.job-master-container {
  background: #f5f7fa;

  & > div {
    padding: 0 24px;
  }

  &-header {
    background: #f1f4f9;
    line-height: 48px;
  }

  &-body {
    padding-top: 16px!important;
    padding-bottom: 16px!important;
    line-height: 3;
    border-top: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    overflow: hidden;
    text-overflow: ellipsis;

  }

  .tags-container  {
    color: #909399;
    label, span {
      margin-right: 8px;
    }
  }

  &-footer {
    background: #f5f7fa;
    line-height: 40px;
  }
}
</style>
