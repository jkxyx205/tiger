<template>
  <div class="deploy-list">
    <el-table
      :data="deployList"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="部署编号"
        width="150"
      />
      <el-table-column
        label="部署描述"
      >
        <template slot-scope="{row}">
          <p class="description">{{ row.title }}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="deployStatus"
        label="状态"
        width="120"
        align="center"
      >
        <template slot-scope="{ row }">
          <span :class="'circle-deploy-status-' + row.deployStatus">{{ row.deployStatus | deployStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建日期"
        width="160"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.createDate | parseTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="120"
        align="center"
      >
        <template slot-scope="{ row }">
          <router-link :to="'/service/deploy/detail/'+row.id">
            <el-link type="primary" size="small">
              详情
            </el-link>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    deployList: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/platform/service/deploy.scss';

.description {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
