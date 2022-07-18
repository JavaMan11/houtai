<template>
  <!-- 容器 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
import echarts from "echarts";
export default {
  // 初始化echarts实例
  mounted() {
    let lineCharts = echarts.init(this.$refs.charts);
    lineCharts.setOption({
      // x y轴
      xAxis: { show: false, type: "category" },
      yAxis: { show: false },
      // 图表类型
      series: [
        {
          // 柱状图
          type: "bar",
          data: [10, 22, 80, 6, 64, 9,78,12,61],
          color:'skyblue'
        },
      ],
      // 布局调试
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
      tooltip:{}
    });
  },
};
</script>

<style>
.charts {
  width: 100%;
  height: 100%;
}
</style>
