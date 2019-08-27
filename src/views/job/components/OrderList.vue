<template>
  <div class="order-list">
    <el-table
      :data="orderList"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="订单编号"
        width="150"
      />
      <el-table-column
        label="服务描述"
      >
        <template slot-scope="{row}">
          <p class="description">{{ row.description }}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="price"
        label="价格(元)"
        width="120"
        align="center"
      />
      <el-table-column
        prop="orderStatus"
        label="状态"
        width="120"
        align="center"
      >
        <template slot-scope="{ row }">
          <span>{{ row.orderStatus | orderStatus }}</span>
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
          <router-link :to="'/service/order/detail/'+row.id">
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
    orderList: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style lang="scss" scoped>
.description {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
