<template>
  <el-card class="box-card" style="margin: 10px 0px">
    <div slot="header" class="clearfix">
      <!-- v-model="activeName" @tab-click="handleClick" -->
      <el-tabs class="tab" v-model="activeName">
        <el-tab-pane label="销售额" name="sale"></el-tab-pane>
        <el-tab-pane label="访问量" name="visite"></el-tab-pane>
      </el-tabs>
      <!-- 头部右侧内容 -->
      <div class="right">
        <span @click="setDate">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <!--v-model="value1"  -->
        <el-date-picker
          v-model="date"
          class="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="mini"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </div>
    </div>
    <div>
      <el-row :gutter="10">
        <el-col :span="18">
          <div class="charts" ref="charts"></div>
        </el-col>
        <el-col :span="6" class="right">
          <h3>门店{{ title }}排名</h3>
          <ul>
            <li>
              <span class="rindex">1</span>
              <span>小虎子</span>
              <span class="rvalue">333,551</span>
            </li>
            <li>
              <span class="rindex">1</span>
              <span>奥利奥</span>
              <span class="rvalue">333,551</span>
            </li>
            <li>
              <span class="rindex">3</span>
              <span>奶茶店</span>
              <span class="rvalue">333,551</span>
            </li>
            <li>
              <span>4</span>
              <span>麦当劳</span>
              <span class="rvalue">333,551</span>
            </li>
            <li>
              <span>5</span>
              <span>华莱士</span>
              <span class="rvalue">333,551</span>
            </li>
            <li>
              <span>6</span>
              <span>肯德基</span>
              <span class="rvalue">333,551</span>
            </li>
            <li>
              <span>7</span>
              <span>大金猪</span>
              <span class="rvalue">333,551</span>
            </li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-card>
</template>

<script>
import echarts from "echarts";
import dayjs from 'dayjs'
export default {
  data() {
    return {
      activeName: "sale",
      mycharts: null,
    //   收集日期表的时间
    date:""
    };
  },
  computed: {
    // v-model收集数据的变化，再计算出来
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
  },
  mounted() {
    this.mycharts = echarts.init(this.$refs.charts);
    this.mycharts.setOption({
      title: {
        text: "销售额趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月",
          ],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [10, 52, 200, 334, 390, 330, 220, 15, 48, 80, 255, 41, 88],
          color: "skyblue",
        },
      ],
    });
  },
  watch: {
    title() {
      // 监听图表标题的变化，并修改
      this.mycharts.setOption({
        title: {
          text: this.title + "趋势",
        },
      });
    },
  },
  methods: {
    // 今日
    setDate(){
        const day = dayjs().format('YYYY-MM-DD')
        this.date = [day,day]

    },
    setWeek(){
        const week = dayjs().day(1).format('YYYY-MM-DD')
        const week2 = dayjs().day(7).format('YYYY-MM-DD')
        this.date = [week,week2]
        
    },
    setMonth(){
        const month = dayjs().startOf('month').format('YYYY-MM-DD')
        const month2 = dayjs().endOf('month').format('YYYY-MM-DD')
        this.date = [month,month2]
    },
    setYear(){
        const year = dayjs().startOf('year').format('YYYY-MM-DD')
        const year2 = dayjs().endOf('year').format('YYYY-MM-DD')
        this.date = [year,year2]
    }
  },
};
</script>

<style scoped>
.clearfix {
  position: relative;
  display: flex;
  justify-content: space-between;
}
.tab {
  width: 100%;
}
.right {
  right: 0;
  position: absolute;
}
.date {
  width: 250px;
  margin: 0px 20px;
}
.right span {
  margin: 0px 10px;
}
.charts {
  width: 100%;
  height: 300px;
}
ul {
  width: 100%;
  height: 300px;
  list-style: none;
  padding: 0;
}
ul li {
  height: 8%;
  margin: 10px 0px;
}
.rindex {
  float: left;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: black;
  color: white;
  text-align: center;
}
.rvalue {
  float: right;
}
</style>
