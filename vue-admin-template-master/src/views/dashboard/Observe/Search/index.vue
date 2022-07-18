<template>
  <el-card>
    <div slot="header">
      <div class="flex-header">
        <span>线上热门搜搜</span>
        <i class="el-icon-more"></i>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="12">
          <LineCharts></LineCharts>
        </el-col>
        <el-col :span="12">
          <LineCharts></LineCharts>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import LineCharts from './LineCharts'
export default {
  components:{
    LineCharts
  }
};
</script>

<style scoped>
.flex-header {
  display: flex;
  justify-content: space-between;
}
</style>
