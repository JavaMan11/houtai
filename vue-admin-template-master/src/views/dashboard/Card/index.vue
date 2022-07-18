<template>
  <el-row :gutter="10">
    <el-col :span="6">
      <el-card>
        <Detail title="总销售额" count="￥126560">
            <template slot="charts">
                <span>周同比&nbsp;&nbsp;56.67%
                    <svg t="1656130298795" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4577" width="16" height="16"><path d="M960 704L512 256l-448 448z" fill="#d81e06" p-id="4578"></path></svg>
                </span>
                &nbsp;&nbsp;
                <span>日同比&nbsp;&nbsp;19.96%&nbsp;<svg t="1656130406863" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6792" width="16" height="16"><path d="M64 320l448 448 448-448z" fill="#1afa29" p-id="6793"></path></svg></span>
            </template>
            <template slot="footer">
                <span>日销售额 ￥12423</span>
            </template>
        </Detail>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <Detail title="访问量" count="88460">
            <template slot="charts">
                <lineChart></lineChart>
            </template>
            <template slot="footer">
                <span>日访问量 1234</span>
            </template>
        </Detail>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <Detail title="支付笔数" count="88460">
            <template slot="charts">
                <barChart></barChart>
            </template>
            <template slot="footer">
                <span>转化率 65%</span>
            </template>
        </Detail>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <Detail title="运营活动效果" count="78%">
            <template slot="charts">
                <progressCharts></progressCharts>
            </template>
            <template slot="footer">
                <span>周同比&nbsp;&nbsp;56.67%
                    <svg t="1656130298795" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4577" width="16" height="16"><path d="M960 704L512 256l-448 448z" fill="#d81e06" p-id="4578"></path></svg>
                </span>
                &nbsp;&nbsp;
                <span>日同比&nbsp;&nbsp;19.96%&nbsp;<svg t="1656130406863" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6792" width="16" height="16"><path d="M64 320l448 448 448-448z" fill="#1afa29" p-id="6793"></path></svg></span>
            </template>
        </Detail>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import Detail from "./Detail";
import lineChart from './lineChart'
import barChart from './barChart'
import progressCharts from './progressCharts'
export default {
  name: "Card",
  components: {
    Detail,
    lineChart,
    barChart,
    progressCharts
  },
};
</script>

<style></style>
