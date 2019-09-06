<template>
  <div class="feedback">
    <div class="feedback-header border">
      <span>我要反馈</span>
    </div>
    <div class="feedback-content">
      <el-form ref="feedback" :model="feedback" :rules="rules" class="demo-ruleForm">
        <el-form-item label="反馈内容" prop="description">
          <el-input v-model="feedback.description" type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="请输入反馈内容" />
        </el-form-item>
        <el-form-item>
          <file-upload ref="fileUpload" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="saving" type="primary" :disabled="feedback.description.trim().length === 0" @click="submitForm('feedback')">发送</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import FileUpload from '@/components/FileUpload'
import { feedback } from '@/api/log'

export default {
  name: 'Feedback',
  components: { FileUpload },
  props: {
    id: {
      type: Number,
      default: undefined
    }
  },
  data() {
    return {
      saving: false,
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
    ])
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saving = true
          this.feedback.attachments = this.$refs.fileUpload.getAttachments()
          feedback(this.id, this.feedback, this.userId).then(res => {
            this._resetForm()
            this.saving = false
            this.$message.success('反馈发送成功')
            this.$emit('update', res.data)
          })
        } else {
          return false
        }
      })
    },
    _resetForm() {
      this.feedback.description = ''
      this.feedback.attachments = ''
      this.$refs.fileUpload.clearFiles()
      this.fileList = []
    }
  }
}
</script>
<style lang="scss" scoped>
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
