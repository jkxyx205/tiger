<template>
  <div class="job-detail-container">
    <div class="job-master-container border">
      <div class="job-master-container-header">
        <div class="data-item">
          <label>部署单编号:</label><span>{{ deploy.id }}</span>
        </div>
        <div class="data-item">
          <label>状态:</label><span :class="'circle-deploy-status-' + deploy.deployStatus">{{ deploy.deployStatus | deployStatus }}</span>
        </div>
        <div v-if="over" class="pull-right operator-bar">
          <el-button v-if="deploy.deployStatus === 0" size="small" type="danger" @click="cancel()">作废</el-button>
          <el-button v-if="deploy.deployStatus === 2" size="small" @click="makeFinished()">部署完成</el-button>
        </div>
      </div>
      <div class="job-master-container-body" style="line-height: 1.6; padding: 20px;">
        <div class="textarea-wrap">
          <label>部署内容:</label><span>{{ deploy.description }}</span>
        </div>
        <div class="attachment-list">
          <ul>
            <li v-for="attachment in deploy.attachments" :key="attachment.id">
              <!-- <a :href="baseUrl + '/documents/download/' + file.id"><i class="el-icon-document" /><span class="file-name">{{ file.fullName }}</span></a> -->
              <a href="javascript:;" @click="preview(attachment)"><i class="el-icon-document" /><span class="file-name">{{ attachment.fullName }}</span></a>
            </li>
          </ul>
        </div>
      </div>
      <div class="job-master-container-footer">
        <div class="data-item">
          <label>所属公司:</label><span>{{ deploy.groupName }}</span>
        </div>
        <div class="data-item">
          <label>管理员:</label><span>{{ deploy.adminName }}</span>
        </div>
        <div class="pull-right">
          <div class="data-item">
            <label>创建时间:</label><span>{{ deploy.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="work-flow-container">
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="操作日志" name="log">
          <log :logs="deploy.logList" />
        </el-tab-pane>
        <el-tab-pane label="工单单据" name="job">
          <job-summary v-if="deploy.job" :job="deploy.job" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <template v-if="over">
      <feedback :id="deploy.id" :log-target="4" @update="feedbackUpdated" />
    </template>
    <preview ref="preview" />
  </div>
</template>

<script>
import { findDetailById, changeStatus } from '@/api/platform/service/deploy'
import Log from '@/components/Log'
import { list } from '@/api/log'
import Feedback from '@/components/Feedback'
import JobSummary from '@/views/job/components/JobSummary'
import Preview from '@/components/Preview'

const CANCEL_STATUS = '1'
const MAKE_FINISHED_STATUS = '4'

export default {
  name: 'DeployDetail',
  components: {
    Log, Feedback, JobSummary, Preview
  },
  data() {
    return {
      baseUrl: process.env.VUE_APP_FILE_UPLOAD,
      id: this.$route.params.id,
      deploy: {},
      activeName: 'log'
    }
  },
  computed: {
    over() {
      // return this.deploy.deployStatus === 0 || this.deploy.deployStatus === 1 || this.deploy.deployStatus === 2
      return true // 任何时候都能反馈
    }
  },
  created() {
    findDetailById(this.id).then(res => {
      this.deploy = res.data
    })
  },
  mounted() {
    setInterval(this._refreshLog, 1000 * 60)
  },
  methods: {
    makeFinished() {
      this._changeStatus(MAKE_FINISHED_STATUS)
    },
    cancel() {
      this._changeStatus(CANCEL_STATUS)
    },
    feedbackUpdated(data) {
      this.deploy.logList.push(data)
    },
    preview(file) {
      this.$refs.preview.show(file)
    },
    _refreshLog() {
      list(this.deploy.id).then(res => {
        this.deploy.logList = res.data
      })
    },
    _changeStatus(status) {
      changeStatus(this.deploy.id, status).then(res => {
        this.deploy.deployStatus = res.data
        this._refreshLog()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/platform/service/deploy.scss";

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
    line-height: 80px;
    border-top: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &-footer {
    background: #f5f7fa;
    line-height: 40px;
  }
}

.attachment-list {
  margin-top: 8px;
  ul {
    margin-top: 8px;
    li {
      display: inline-block;
      margin-right: 24px;
      border-bottom: 1px solid #909399;
    }
    .file-name {
      margin-left: 4px;
    }
  }
}
</style>
