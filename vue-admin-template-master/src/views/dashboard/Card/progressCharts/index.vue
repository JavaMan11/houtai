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
      xAxis: { show: false,min:0,max:100 },
      yAxis: { show: false , type: "category"},
      // 图表类型
      series: [
        {
          // 柱状图
          type: "bar",
          data: [78],
          color:'greenyellow',
          // 柱形的宽度
          barWidth:10,
          // 背景颜色
          showBackground:true,
          backgroundStyle:{},
          // 文本
          label:{
          show:true,
          // 改变文本内容
          formatter:'|',
          // 标签的位置调试
          position:'right'
        }
        },
        
        
      ],
      // 布局调试
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
