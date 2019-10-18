<template>
  <div class="job-master-container" style="padding: 20px 0; background-color: #fff;">
    <div class="job-master-container-header" style="background: #fff;">
      <div class="data-item">
        <label>工单编号:</label><span>{{ job.id }}</span>
      </div>
      <div class="data-item">
        <label>类型:</label><span>{{ job.jobType | jobType }}</span>
      </div>
      <div class="data-item">
        <label>状态:</label><span :class="'circle-job-status-' + job.jobStatus">{{ job.jobStatus | jobStatus }}</span>
      </div>
      <div class="pull-right operator-bar">
        <router-link :to="'/service/job/detail/'+job.id">
          <el-link type="primary" size="small">
            详情
          </el-link>
        </router-link>
      </div>
    </div>
    <div class="job-master-container-body" style="background: #fff;">
      <div class="data-item" style="white-space: normal; line-height: 1.5;">
        <label>问题描述:</label><span>{{ job.description }}</span>
      </div>
    </div>
    <div class="job-master-container-footer" style="background: #fff;">
      <div class="data-item">
        <label>联系人:</label><span>{{ job.contactName }}</span>
      </div>
      <div class="data-item">
        <label>联系电话:</label><span>{{ job.contactNumber }}</span>
      </div>
      <!-- <div class="data-item">
        <label>所属公司:</label><span>{{ order.groupName }}</span>
      </div> -->
      <div class="pull-right" style="margin-right: -24px;">
        <!-- <div class="data-item">
          <label>提交人:</label><span>{{ order.payerName }}</span>
        </div> -->
        <div class="data-item">
          <label>创建时间:</label><span>{{ job.createDate | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    job: {
      type: Object,
      required: true,
      default: () => {}
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/platform/service/job.scss';
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
    & > div {
      padding-top: 32px;
      padding-bottom: 32px;
    }
    border-top: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
  }

  &-footer {
    background: #f5f7fa;
    line-height: 40px;
  }
}
</style>
