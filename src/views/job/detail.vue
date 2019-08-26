<template>
  <div class="job-detail-container">
    <div class="job-master-container border">
      <div class="job-master-container-header">
        <div class="data-item">
          <label>单号:</label><span>{{ job.id }}</span>
        </div>
        <div class="data-item">
          <label>类型:</label><span>{{ job.jobType | type }}</span>
        </div>
        <div class="data-item">
          <label>状态:</label><span :class="'circle-job-status-' + job.jobStatus">{{ job.jobStatus | status }}</span>
        </div>
        <div v-if="over" class="pull-right operator-bar">
          <el-button v-if="job.jobStatus !== 3 && job.jobStatus !== 4 && job.jobType === 2" size="small" @click="makeOrderDialog()">创建订单</el-button>
          <el-button v-if="job.jobStatus !== 3 && job.jobStatus !== 4 && job.jobType === 2" size="small" @click="makeDeployDialog()">创建部署单</el-button>
          <el-button v-if="job.jobStatus === 0 || job.jobStatus === 1" size="small" @click="makeFinished()">处理完成</el-button>
          <el-button v-if="job.jobStatus === 2" size="small" @click="reDo()">重新处理</el-button>
        </div>
      </div>
      <div class="job-master-container-body">
        <div class="data-item">
          <label>问题描述:</label><span>{{ job.description }}</span>
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
        <div class="pull-right">
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
        <template v-if="job.jobType === 2">
          <el-tab-pane label="订单单据" name="order">订单单据</el-tab-pane>
          <el-tab-pane label="部署单据" name="deploy">部署单据</el-tab-pane>
        </template>
      </el-tabs>
    </div>
    <div v-if="over" class="feedback">
      <div class="feedback-header border">
        <span>我要反馈</span>
      </div>
      <div class="feedback-content">
        <el-form ref="feedback" :model="feedback" :rules="rules" class="demo-ruleForm">
          <el-form-item label="反馈内容" prop="description">
            <el-input v-model="feedback.description" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入反馈内容" />
          </el-form-item>
          <el-form-item>
            <el-upload
              ref="upload"
              class="upload-demo"
              :multiple="true"
              action="http://etmode.com:8500/documents/upload"
              :limit="5"
              :on-exceed="exceed"
              :on-success="success"
              :before-upload="beforeUpload"
            >
              <el-button size="small" type="default">📎附件上传</el-button>
              <span slot="tip" class="el-upload__tip" style="margin-left: 8px;">最多上传5个附件，每个附件大小不超过8M</span>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button :loading="saving" type="primary" :disabled="feedback.description.trim().length === 0" @click="submitForm('feedback')">发送</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <create-order ref="createOrder" :job="job" @create-success="refreshLog" />
    <create-deploy ref="createDeploy" :job="job" />
  </div>
</template>

<script>
import { findDetailById, feedback, changeStatus, listLogs } from '@/api/platform/service/job'
import * as Dict from '@/utils/dictionary-getter'
import { mapGetters } from 'vuex'
import Log from '@/components/Log'
import CreateOrder from './components/CreateOrder'
import CreateDeploy from './components/CreateDeploy'

const PROCESSING_STATUS = '1'
const MAKE_FINISHED_STATUS = '2'
const UPLOAD_MAX_SIZE = 8 // M

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
    Log, CreateOrder, CreateDeploy
  },
  data() {
    return {
      saving: false,
      id: this.$route.params.id,
      job: {},
      activeName: 'log',
      fileList: [],
      feedback: {
        description: '',
        attachments: ''
      },
      rules: {
        description: [
          { required: true, message: '请输入反馈内容', trigger: 'blur' },
          { min: 1, max: 500, message: '长度在 1 到 500 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ]),
    over() {
      return this.job.jobStatus === 0 || this.job.jobStatus === 1 || this.job.jobStatus === 2
    }
  },
  created() {
    findDetailById(this.id).then(res => {
      this.job = res.data
    })
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saving = true
          this.feedback.attachments = this._normalize2JSONAttachment()
          feedback(this.job.id, this.feedback, this.userId).then(res => {
            this.job.logList.push(res.data)
            this._resetForm()
            this.saving = false
            this.$message.success('反馈发送成功')
          })
        } else {
          return false
        }
      })
    },
    makeFinished() {
      this._changeStatus(MAKE_FINISHED_STATUS)
    },
    reDo() {
      this._changeStatus(PROCESSING_STATUS)
    },
    success(response, file, fileList) {
      this.fileList = fileList
    },
    makeOrderDialog() {
      this.$refs.createOrder.openDialog()
    },
    makeDeployDialog() {
      this.$refs.createDeploy.openDialog()
    },
    beforeUpload(file) {
      if (file.size > UPLOAD_MAX_SIZE * 1024 * 1024) {
        this.$message.error(`文件最大不能超过${UPLOAD_MAX_SIZE}M`)
        return false
      }
      return true
    },
    exceed(files, fileList) {
      this.$message.warning(`当前限制选择5个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    refreshLog() {
      this._refreshLog()
    },
    _refreshLog() {
      listLogs(this.job.id).then(res => {
        this.job.logList = res.data
      })
    },
    _changeStatus(status) {
      changeStatus(this.job.id, status).then(res => {
        this.job.jobStatus = res.data
        this._refreshLog()
      })
    },
    _resetForm() {
      this.feedback.description = ''
      this.feedback.attachments = ''
      this.$refs.upload.clearFiles()
      this.fileList = []
    },
    _normalize2JSONAttachment() {
      const attachments = []
      if (this.fileList.length > 0) {
        this.fileList.forEach(item => {
          const fileInfo = item.response.data[0]
          attachments.push({
            id: fileInfo.id,
            name: fileInfo.fullName
          })
        })
      }
      return JSON.stringify(attachments)
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

.feedback {
  &-header {
    padding: 0 24px;
    background: #f5f7fa;
    line-height: 40px;
  }

  &-content {
    padding: 24px 48px;
  }
}

.el-tabs--border-card {
  box-shadow: none;
}
</style>
