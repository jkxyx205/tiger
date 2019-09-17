<template>
  <div class="contact-list-container">
    <ul>
      <li v-for="log in logs" :key="log.id" class="contact-item">
        <div class="user-info">
          <img v-lazy="log.avatar" class="user-avatar">
          <div class="user-name">{{ log.name }}</div>
        </div>
        <div class="content-info">
          <p>{{ log.description }}</p>
          <div class="content-file">
            <ul>
              <li v-for="file in log.attachments" :key="file.id">
                <a :href="baseUrl + '/documents/download/' + file.id"><i class="el-icon-document" /><span class="file-name">{{ file.fullName }}</span></a>
              </li>
            </ul>
          </div>
          <div class="content-date"><span>{{ log.createDate | formatTime() }}</span></div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'Log',
  props: {
    logs: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      baseUrl: process.env.VUE_APP_FILE_UPLOAD
    }
  }
}
</script>

<style lang="scss" scoped>
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
    line-height: 1.5;
    white-space: pre-line;
    .content-file {
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
    .content-date {
      margin-top: 8px;
      color: #909399;
      font-size: 13px;
    }
  }
}
</style>
