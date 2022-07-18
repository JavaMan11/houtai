<template>
  <div>
    <!-- 按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0px"
      @click="showDialog"
      >添加</el-button
    >
    <!-- 表格 -->
    <!-- data:表格组件将来需要展示的数据-----
       boder:是给表格添加边框
       column下的属性
       label:标题
       align:标题的对齐方式
   -->
    <el-table style="width: 100%" border :data="list">
      <el-table-column
        type="index"
        label="序号"
        width="80px"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
      ></el-table-column>
      <el-table-column prop="logoUrl" label="品牌logo" width="width">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <!-- 当前页、数据的总条数、 
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    current-page：当前第几页
    total：总数据的条数
    page-size：一页展示的数据
    page-sizes：可以设置一页展示的数据
    layout:可以实现页面的布局
    pager-count:按钮的数量   如果是9，连续页面是7 
  -->
    <el-pagination
      style="margin-top: 20px; textalign: center"
      :current-page="page"
      :total="total"
      :pager-count="7"
      :page-size="limit"
      :page-sizes="[3, 5, 10]"
      @size-change="handleSizeChange"
      @current-change="getPageList"
      layout="prev, pager, next, jumper, ->,sizes,total"
    >
      <!-- layout里面摆放东西的顺序就是页面呈现的顺序，->让东西靠右 -->
    </el-pagination>
    <!-- 点击添加按钮弹出对话框 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form style="width: 80%" :model="tmForm" :rules="rules" ref="ruleForm">
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌名称" label-width="100px" prop="logoUrl">
          <!--这里不能使用v-model收集数据
          因为不是表单元素
          action：设置上传图片的地址
          :on-success：可以检测到图片上传成功，当图片上传成功会执行一次
          :before-upload：可以在上传图片之前执行一次
           -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUpdateTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {
      //代表分页器第几页
      page: 1,
      //当前页展示数据的条数
      limit: 3,
      //总共数据的条数
      total: 0,
      //列表展示的数据
      list: [],
      //控制对话框显示与隐藏
      dialogFormVisible: false,

      //收集品牌信息:对象的属性不能乱写，得根据文档
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      //表单验证规则
      rules: {
        //品牌名称的验证规则
        tmName: [
          //required就是表单前面的五角星   message:提示信息  trigger：用户行为的设置(事件的设置：blur、change)
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          //品牌的长度2-10
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "change",
          },
        ],
        //品牌logo的验证规则
        logoUrl: [
          { required: true, message: "请选择品牌的图片", trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    //获取品牌列表的数据
    async getPageList(pager = 1) {
      this.page = pager;
      //获取品牌列表的接口
      const { page, limit } = this;
      let result = await this.$API.trademark.reqTradeMarkList(page, limit);
      if (result.code == 200) {
        //分别是展示数据总条数与列表展示的数据
        this.total = result.data.total;
        this.list = result.data.records;
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getPageList();
    },
    //点击添加按钮
    showDialog() {
      this.dialogFormVisible = true;
      this.tmForm = { tmName: "", logoUrl: "" };
    },
    //点击修改按钮
    updateTradeMark(row) {
      this.dialogFormVisible = true;
      //{...}浅拷贝的作用是让两端数据互不影响，row是服务器返回的列表数据
      this.tmForm = { ...row };
    },
    //图片上传成功
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data;
    },
    //图片上传之前(判断图片格式和大小对不对)
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //对话框的确认按钮
    addUpdateTradeMark() {
      //当全部验证字段通过再书写逻辑
      this.$refs.ruleForm.validate(async (success) => {
        if (success) {
          //点击确认关闭对话框
          this.dialogFormVisible = false;
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (result.code == 200) {
            //弹出信息
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改成功" : "添加成功",
            });
            this.getPageList(this.tmForm.id ? this.page : 1);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //删除品牌的操作
    deleteTradeMark(row) {
      //弹框
      this.$confirm(`你确定删除${row.tmName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          //点击确定按钮发请求
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            //再次获取品牌信息
            this.getPageList(this.list.length>1?this.page:this.page-1);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
