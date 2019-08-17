<template>
  <div class="message-container">
    <el-form label-position="left" label-width="80px">
      <el-form-item label="发送地址">
        <el-input v-model="sendUrl" />
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
      <el-tab-pane v-for="item in tabMapOptions" :key="item.key" :label="item.label" :name="item.key">
        <plain v-show="activeName=='0'" :url="sendUrl" />
        <article-message v-show="activeName=='1'" />
        <site-message v-show="activeName=='2'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Plain from './components/Plain'
import ArticleMessage from './components/ArticleMessage'
import SiteMessage from './components/SiteMessage'

export default {
  name: 'Message',
  components: {
    Plain,
    ArticleMessage,
    SiteMessage
  },
  data() {
    return {
      tabMapOptions: [
        { label: '文本', key: '0' },
        { label: '网站留言板', key: '1' },
        { label: '文章评论', key: '2' }
      ],
      sendUrl: 'http://localhost:8769/ws/messages',
      activeName: '0'
    }
  }
}
</script>

<style lang="scss" scoped>
.message-container {
  margin: 10px 20px 0;
  overflow: hidden;
}
</style>
