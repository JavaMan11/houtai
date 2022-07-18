<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable" />
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <!-- disabled是禁用按钮用的 当没有3Id的时候禁用，反之不禁用-->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- 表格:展示平台属性 -->
        <el-table style="width: 100%" border :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0px 20px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrList"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          style="width: 100%; margin: 20px 0px"
          border
          :data="attrInfo.attrValueList"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 让input 和 span 来回切换 -->
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                size="mini"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 气泡确认框 -->
              <el-popconfirm
                :title="`你确定删除${row.valueName}吗?`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="saveAttr" :disabled="attrInfo.attrValueList<1">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
//按需引入lodash中的深拷贝
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //接受平台属性的字段
      attrList: [],
      //这个属性控制表格的显示与隐藏
      isShowTable: true,
      //收集新增|修改的属性
      attrInfo: {
        attrName: "", //属性名
        attrValueList: [],
        categoryId: 0, //三级分类的ID
        categoryLevel: 3,
      },
    };
  },
  methods: {
    //自定义事件的回调
    getCategoryId({ categoryId, level }) {
      //根据level区分一二三级的分类，以及进行父组件的储存
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        //发请求获取平台的属性数据
        this.getAttrList();
      }
    },
    //获取平台属性的数据
    async getAttrList() {
      //当用户确定三级分类的时候，发起请求
      const { category1Id, category2Id, category3Id } = this;
      let result = await this.$API.attr.reqAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      if (result.code == 200) {
        this.attrList = result.data || [];
      }
    },
    //添加属性值的回调
    addAttrList() {
      this.attrInfo.attrValueList.push({
        //当在已有的属性进行修改的时候，把id带上，不然是undefined
        attrId: this.attrInfo.id,
        valueName: "",
        flag: true, //给每一个属性值打一个标记flag,用于切换查看模式与编辑模式。好处，每一个属性值的切换互不影响
      });
      this.$nextTick(function () {
        //添加一项一定是在最后的，所以获取length-1就是最后一项
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    //添加属性的回调
    addAttr() {
      //添加|修改数据的显示与隐藏
      this.isShowTable = false;
      //清除数据
      this.attrInfo = {
        attrName: "", //属性名
        attrValueList: [],
        categoryId: this.category3Id, //三级分类的ID
        categoryLevel: 3,
      };
    },
    //修改属性的回调
    updateAttr(row) {
      this.isShowTable = false;
      //点取消也会被修改，所以这里使用了深拷贝让数据互不影响
      //这里只能使用深拷贝，数据结构不复杂的情况可以使用浅拷贝[...row]
      this.attrInfo = cloneDeep(row);
      this.attrInfo.attrValueList.forEach((item) => {
        //这样写也能添加一个flag 但是这个flag不是响应式数据
        // item.flag = false
        this.$set(item, "flag", false); //item:对象 flag:响应式属性 false:响应式属性值
      });
    },
    //失去焦点事件---切换为查看模式（展示span）
    toLook(row) {
      // row.valueName==''?alert('属性值不能为空'):row.flag=false
      //不能为空 不能有特殊字符
      if (row.valueName.trim() == "") {
        this.$message("请你输入一个正常的属性值");
        return;
      }
      //重复的无法添加
      //用some方法遍历这个数组  如果重复会返回一个true
      let Repat = this.attrInfo.attrValueList.some((item) => {
        // row:是最新添加的一项 将row从数组的判断中去除，和其他几项判断
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      if (Repat) {
        this.$message("属性值重复");
        return;
      }
      row.flag = false;
    },
    //获取焦点---切换为编辑模式（展示input）
    toEdit(row, index) {
      row.flag = true;
      this.$nextTick(() => {
        //打ref的时候记得在前面加一个:   index是一个变量
        this.$refs[index].focus();
      });
    },
    //气泡确认框的确定按钮的回调
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    //保存按钮:进行添加或者修改
    async saveAttr() {
      //注意：用户添加空的属性值不应该传给服务器   flag也不需要传给服务器
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          //过滤不是空的属性值
          if (item.valueName != "") {
            //删除flag
            delete item.flag;
            return true;
          }
        }
      );
      try {
        await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
         this.$message({
          message: '保存成功',
          type: 'success'
        });
        //保存成功后切换结构
        this.isShowTable = true
        //保存成功后重新获取数据
        this.getAttrList()
      } catch (error) {
        alert(error.message)
      }
    },
  },
};
</script>

<style>
</style>