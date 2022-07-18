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
          // 折线图
          type: "line",
          data: [10, 22, 80, 6, 64, 9,78,12,61],
          itemStyle: {
            // 让折线图拐点消失
            opacity: 0,
          },
          // 线条的颜色
          lineStyle: {
            color: "purple",
          },
          // 填充颜色的设置
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "purple", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
          smooth: true,
        },
      ],
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
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
