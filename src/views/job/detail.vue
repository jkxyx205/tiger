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
        <div class="pull-right operator-bar">
          <el-button size="small">确认完成</el-button>
        </div>
      </div>
      <div class="job-master-container-body">
        <div class="data-item">
          <label>问题描述:</label><span>{{ job.title }}</span>
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
          <label>所属公司:</label><span>{{ job.groupId }}</span>
        </div>
        <div class="pull-right">
          <div class="data-item">
            <label>提交人:</label><span>{{ job.createBy }}</span>
          </div>
          <div class="data-item">
            <label>创建时间:</label><span>{{ job.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="work-flow-container">
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="沟通纪录" name="log">
          <div class="tab-log-container contact-list-container">
            <ul>
              <li v-for="log in job.logList" :key="log.id" class="contact-item">
                <div class="user-info">
                  <img v-lazy="log.avatar" class="user-avatar">
                  <div class="user-name">{{ log.name }}</div>
                </div>
                <div class="content-info">
                  <p>{{ log.title }}</p>
                  <div class="content-date"><span>{{ log.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span></div>
                </div>
              </li>
            </ul>
          </div>
        </el-tab-pane>
        <el-tab-pane label="订单单据" name="order">订单单据</el-tab-pane>
        <el-tab-pane label="部署单据" name="deploy">部署单据</el-tab-pane>
      </el-tabs>
    </div>
    <div class="feedback">
      <div class="feedback-header border">
        <span>我要反馈</span>
      </div>
      <div class="feedback-content">
        <el-form ref="feedback" :model="feedback" :rules="rules" class="demo-ruleForm">
          <el-form-item label="反馈内容" prop="title">
            <el-input v-model="feedback.title" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入反馈内容" />
          </el-form-item>
          <el-form-item>
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-change="handleChange"
              :file-list="fileList"
            >
              <el-button size="small" type="default">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">发送</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { findDetailById } from '@/api/platform/service/job'
import * as Dict from '@/utils/dictionary-getter'
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
  data() {
    return {
      id: this.$route.params.id,
      job: {},
      activeName: 'log',
      feedback: {
        title: ''
      },
      fileList: [{
        name: 'food.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }, {
        name: 'food2.jpeg',
        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      }],
      rules: {
        title: [
          { required: true, message: '请输入反馈内容', trigger: 'blur' },
          { min: 10, max: 500, message: '长度在 10 到 500 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    findDetailById(this.id).then(res => {
      this.job = res.data
    })
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    submitForm(form) {
      console.log('')
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-3)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/platform/service/job.scss";
.data-item {
  display: inline-block;
  margin-right: 24px;
  white-space: nowrap;
  label {
    margin-right: 8px;
  }
}
.job-detail-container {
  padding: 30px 20px;
  & > div {
    margin-bottom: 24px;
  }
  color: #909399;
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
    line-height: 60px;
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

.contact-list-container {
  $info-width: 120px;
  $avatar-width: 30px;
  padding: 20px;
  .contact-item {
    position: relative;
    &:not(:last-child) {
      margin-bottom: 16px;
    }
  }
  .user-info {
    position: absolute;
    top: -4px;
    padding-left:$avatar-width + 4px;
    width: $info-width;
    line-height: $avatar-width;
    .user-avatar {
      position: absolute;
      left: 0;
      display: block;
      width: $avatar-width;
      height: $avatar-width;
      vertical-align: middle;
      padding: 2px;
      border-radius: 50%;
      box-shadow: 0 0 15px 0 rgba(81,111,234,.2);
    }
    .user-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .content-info {
    margin-left: $info-width + 8px;
    line-height: 1.6;

    .content-date {
      margin-top: 8px;
      color: #909399;
      font-size: 13px;
    }
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
