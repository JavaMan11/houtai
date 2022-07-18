<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="add">添加成员</el-button>
    <el-table :data="userInfo" style="width: 100%; margin: 20px 0px" border>
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="username" label="姓名" width="width">
        <template slot-scope="{ row, $index }">
          <el-input
            v-model="row.username"
            placeholder="请输入属性值名称"
            v-if="row.flag3"
            size="mini"
            @blur="toLook3(row)"
            :ref="$index"
          ></el-input>
          <span v-else @click="toEdit2(row, $index)" style="display: block">{{
            row.username
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sex" label="性别" width="width"> </el-table-column>
      <el-table-column prop="wages" label="工资" width="width">
        <template slot-scope="{ row, $index }">
          <el-input
            v-model="row.wages"
            placeholder="请输入属性值名称"
            v-if="row.flag2"
            @blur="toLook2(row)"
            @keyup.native.enter="toLook(row)"
            size="mini"
            :ref="$index"
          ></el-input>
          <span v-else @click="toEdit2(row, $index)" style="display: block">{{
            row.wages
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="occupation" label="职位" width="width">
        <template slot-scope="{ row, $index }">
          <el-input
            v-model="row.occupation"
            placeholder="请输入属性值名称"
            v-if="row.flag"
            @blur="toLook(row, $index)"
            @keyup.native.enter="toLook(row, $index)"
            size="mini"
            :ref="$index"
          ></el-input>
          <span v-else @click="toEdit(row, $index)" style="display: block">{{
            row.occupation
          }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="editname(row)"
            >修改</el-button
          >
          <!-- 气泡确认框 -->
              <el-popconfirm
                :title="`你确定辞退${row.username}吗?`"
                @onConfirm="del($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                >辞退</el-button>
              </el-popconfirm>
           
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      userInfo: [],
    };
  },
  mounted() {
    this.get();
  },
  methods: {
    //连接数据库，获取数据库员工信息
    get() {
      axios
        .get("http://127.0.0.1/weibo1")
        .then((res) => {
          // console.log(res.data);
          this.userInfo = res.data;
        })
        .catch((err) => {
          console.log("获取数据失败" + err);
        });
    },
    //修改按钮  点击 给每一个职业都添加一个flag 用于切换修改和查看模式
    editname(row) {
      this.userInfo.forEach((item) => {
        this.$set(item, "flag", false);
        this.$set(item, "flag2", false);
      });
    },
    //点击职位进入修改模式
    toEdit(row, index) {
      row.flag = true;
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
      // this.$set()
    },
    //失去焦点进入查看模式
    toLook(row,index) {
      // console.log(row);
      if (row.occupation.trim() == "") {
        this.$message("请你输入一个正常的属性值");
        return;
      }
      let result = this.userInfo.some((item) => {
        if (row !== item) {
          //只能存在一个董事长
          if (row.occupation == "董事长" && item.occupation == "董事长") {
            
            return true;
          }
        }
      });
      // console.log(result);
      
      if (result) {
        this.$message("董事长只能有一个");
        return;
      }
      this.userInfo[index] = row
      // console.log(index);
      //失去焦点把修改之后的内容存进数据库
     
      
      row.flag = false;
    },
    toEdit2(row, index) {
      row.flag2 = true;
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
      // this.$set()
    },
    //失去焦点进入查看模式
    toLook2(row) {
      if (row.occupation.trim() == "") {
        this.$message("请你输入一个正常的属性值");
        return;
      }
      let result = this.userInfo.some((item) => {
        if (row !== item) {
          return "董事长" == item.occupation;
        }
      });
      console.log(result);
      row.flag2 = false;
    },
    toLook3(row){
      row.flag3 = false
    },
    //删除按钮
    del(index){
      this.userInfo.splice(index,1);
    },
    add(){
      this.userInfo.push({
        username: "",
        wages: "",
        occupation: "",
        flag: false,
        flag2: false,
        flag3:true
      });
      
    }
}
  }
</script>
