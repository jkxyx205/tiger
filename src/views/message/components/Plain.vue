<template>
  <div>
    <el-form ref="form" label-position="left" label-width="80px" :rules="rules" :model="form">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="正文" prop="content">
        <div>
          <tinymce v-model="form.content" :height="300" />
        </div>
      </el-form-item>
      <el-form-item label="消息源" prop="groupId">
        <el-select v-model="form.groupId" placeholder="请选择消息源">
          <el-option v-for="group in datasource.groups" :key="group.id" :label="group.name" :value="group.id" />
        </el-select>
      </el-form-item>
      <el-form-item v-show="form.groupId > 0" label="组件" prop="componentId">
        <el-select v-model="form.componentId" placeholder="请选择组件">
          <el-option v-for="component in datasource.components" :key="component.id" :label="component.name" :value="component.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="收息用户" prop="destinations">
        <el-select v-model="form.destinations" multiple placeholder="请选择接消息收用户">
          <el-option v-for="destination in datasource.destinations" :key="destination.id" :label="destination.name" :value="destination.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-upload2" @click="submitForm('form')">发送</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { Message } from 'element-ui'
import { sendMessage } from '@/api/message'

export default {
  components: {
    Tinymce
  },
  props: {
    url: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        title: '恭喜你注册，Hi',
        groupId: 0,
        componentId: 1,
        businessId: 0,
        instanceId: 0,
        content: `<p>你好，先生／女士！</p>
<p>欢迎你注册<strong>点研智能平台</strong>，我们一起努力创造美好的<span style="background-color: #ff0000;">未来</span>！！！！</p>`,
        destinations: []
      },
      datasource: {
        groups: [
          {
            id: 0,
            name: '系统消息'
          },
          {
            id: 156585531842015,
            name: '苏州点研智能'
          }
        ],
        components: [
          {
            id: 1,
            name: '企业建站'
          }
        ],
        destinations: [
          {
            id: '156585531841902-156585531842120',
            name: 'good'
          },
          {
            id: '156585531841901-156585531842121',
            name: 'bad'
          }
        ]
      },
      rules: {
        title: [
          { required: true, message: '请输入消息标题', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入消息内容', trigger: 'blur' }
        ],
        componentId: [
          { required: true, message: '请选择组件', trigger: 'blur' }
        ],
        destinations: [
          { required: true, message: '请选择接收消息的用户', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          sendMessage(this.url, this.form).then(res => {
            Message({
              message: '消息发送成功',
              type: 'success',
              duration: 5 * 1000
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
