<template>
  <div>
    <el-card style="margin: 20px 0px">
      <CategorySelect @getCategoryId="getCategoryId" :show="scene != 0" />
    </el-card>
    <el-card>
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加Spu</el-button
        >
        <el-table style="width: 100%" border :data="records">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 这里的按钮将来用hintButton替换 -->
              <hint-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加Sku"
                @click="addSku(row)"
              ></hint-button>
              <hint-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改Spu"
                @click="updateSpu(row)"
              ></hint-button>
              <hint-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu全部sku列表"
                @click="handler(row)"
              ></hint-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="daleteSpu(row)"
              >
                <!-- 冒泡确认框需要有slot属性 且是在冒泡确认框按确认的那一刻，触发事件
                      确认按钮的事件是@onConfirm
                 -->
                <hint-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除Spu"
                  slot="reference"
                ></hint-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          style="text-align: center"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          :current-page="5"
          :pager-count="7"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout=" prev, pager, next, jumper, -> ,sizes ,total"
          :total="total"
        >
        </el-pagination>
      </div>
      <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="spu" />
      <SkuForm v-show="scene == 2" ref="sku" @changeScenes="changeScenes" />
    </el-card>
    <el-dialog
      :title="spu.spuName + '的sku列表'"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <el-table :data="skuList" style="width: 100%" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column  label="默认图片" width="width">
          <template slot-scope="{row,$index}">
            <img :src="row.skuDefaultImg" alt="" width="100">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";
export default {
  name: "Spu",
  data() {
    return {
      //区分是几级id
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1, //当前第几页
      limit: 3, //每一页需要展示多少条数据
      records: [], //存储spu列表的数据
      total: 0, //分页器一共需要展示的数据
      scene: 0, // 0代表spu数据列表 1代表添加|修改spu  2添加sku
      // 控制sku对话框的显示与隐藏
      dialogTableVisible: false,
      spu: {},
      skuList: [],
      loading:true //sku对话框加载动画
    };
  },
  methods: {
    //三级联动的自定义事件，作用：子组件的id传给父组件
    getCategoryId({ categoryId, level }) {
      //categoryId:获取一二三级分类的id   level:为了区分是几级id
      if (level == 1) {
        this.category1Id = categoryId;
        //清除二三级id
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        this.getSpuList();
      }
    },
    //获取Spu数据
    async getSpuList(pages = 1) {
      //点击分页器跳转到第几页
      this.page = pages;
      const { page, limit, category3Id } = this;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    //分页器某一条展示数据条数发生变化的回调
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    //切换添加spu页面
    addSpu() {
      this.scene = 1;
      //发送两个请求 一个是获取品牌，一个是获取销售属性
      this.$refs.spu.addSpuData(this.category3Id);
    },
    //修改某一个Spu
    updateSpu(row) {
      this.scene = 1;
      //给子组件打ref可以获取子组件的信息，包括方法回调。这样就可以让子组件发请求了
      this.$refs.spu.initSpuData(row);
    },
    //自定义事件回调spuform
    changeScene({ scene, flag }) {
      this.scene = scene;
      if (flag == "修改") {
        //如果是修改spu信息 则停留在当前页
        this.getSpuList(this.page);
      } else {
        //如果是添加spu信息 则回到第一页
        this.getSpuList();
      }
    },
    //删除按钮的回调
    async daleteSpu(row) {
      //调用接口删除数据
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "删除成功" });
        //  重新获取列表数据
        // 判断的原因是，如果当前页的数据删完了，不应该在停留在当前页，回到上一页
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    //添加sku
    addSku(row) {
      // 切换场景
      this.scene = 2;
      // 父组件调用子组件的方法 让子组件发请求
      this.$refs.sku.getData(this.category1Id, this.category2Id, row);
    },
    // 改变 scene
    changeScenes(scene) {
      this.scene = scene;
    },
    // 查看Sku按钮
    async handler(spu) {
      this.dialogTableVisible = true;
      // 保存spu信息
      this.spu = spu;
      // 获取sku列表的数据进行展示
      let result = await this.$API.sku.reqSkuList(spu.id);
      if (result.code == 200) {
        this.skuList = result.data;
        this.loading =false
      }
    },
    // 关闭对话框之前要做的事
    close(done){
      // 让loading效果显示
      this.loading = true;
      // 把sku列表的数据清空
      this.skuList = [];
      // done用于关闭sku对话框
      done()
    }
  },
  components: {
    SpuForm,
    SkuForm,
  },
};
</script>

<style></style>
