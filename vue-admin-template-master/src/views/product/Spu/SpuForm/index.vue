<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="(tm, index) in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          placeholder="SPU描述"
          type="textarea"
          rows="4"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 
          file-list：图片展示
          on-preview:预览图片
          on-remove:删除图片
          -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="spuImageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectSaleAttr.length}未选择`"
          v-model="attrIdAndAttrName"
        >
          <el-option
            :label="unselect.name"
            :value="`${unselect.id}:${unselect.name}`"
            v-for="(unselect, index) in unSelectSaleAttr"
            :key="unselect.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrIdAndAttrName"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <!--这里是销售属性值的地方  -->
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- 这里相当于当年的span和input切换 -->
              <!-- @keyup.enter.native="handleInputConfirm"
                 -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                @blur="handleInputConfirm(row)"
                ref="saveTagInput"
                size="small"
              >
              </el-input>
              <!--@click="showInput"  -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="AddOrUpdateSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      spu: {
        //三级分类的id
        category3Id: 0,
        //描述
        description: "",
        //spu名称
        spuName: "",
        //平台的id
        tmId: 0,
        //spu图标
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        //平台属性和属性值收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      },
      tradeMarkList: [], //存储品牌信息
      spuImageList: [], //存储spu图片
      BaseSaleList: [], //销售属性数据（3个）
      attrIdAndAttrName: "", //收集未选择的销售属性的id
    };
  },
  computed: {
    //计算出还未选择的销售属性
    unSelectSaleAttr() {
      //BaseSaleList 是三个销售属性
      //spuSaleAttrList 是已经选择的销售属性
      let result = this.BaseSaleList.filter((item) => {
        //every数组的方法会返回一个布尔值，如果元素满足条件，则返回true，否则返回false
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName; //如果这个销售属性已经选择了，那么就不显示item是三个属性，item1是已经选择的销售属性
        });
      });
      return result;
    },
  },

  methods: {
    //删除图片需要收集数据  如何知道删的是谁
    //删除和添加图片都是要收集数据
    handleRemove(file, fileList) {
      //file是删除的图片 fileList是删除后剩下的图片
      //已有的照片有name和url两个字段，因为要显示图片必须要有name和url
      //对于服务器而言，不需要这两个字段，提交的时候可以删除
      //收集照片墙的数据
      this.spuImageList = fileList;
    },
    //照片墙预览
    handlePictureCardPreview(file) {
      //file.url是图片的url 赋值给dialogImageUrl
      this.dialogImageUrl = file.url;
      //对话框显示
      this.dialogVisible = true;
    },
    //发请求
    async initSpuData(spu) {
      //获取spu信息
      let spuResult = await this.$API.spu.reqSpuInfo(spu.id);
      if (spuResult.code == 200) {
        this.spu = spuResult.data;
      }
      //获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      // console.log(tradeMarkResult);
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //获取spu图标
      let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageResult.code == 200) {
        //这里需要把图片的url替换成服务器的地址 是element-ui要求的
        let ImgArr = spuImageResult.data;
        ImgArr.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = ImgArr;
      }
      //获取销售属性
      let BaseSaleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (BaseSaleResult.code == 200) {
        this.BaseSaleList = BaseSaleResult.data;
      }
    },
    //上传图片成功后的回调
    handleSuccess(res, file, fileList) {
      //收集图片的数据
      //res:服务器返回的数据  file上传的那张图片 fileList上传后的所有图片
      this.spuImageList = fileList;
    },
    //完成添加属性需要收集 baseSaleAttrId  saleAttrName:颜色字段  spuSaleAttrValueList：具体哪个颜色
    addSaleAttr() {
      //已经收集需要添加的销售属性信息
      const [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      let newAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      //把新的销售属性添加到spuSaleAttrList中
      this.spu.spuSaleAttrList.push(newAttr);
      //清空销售属性的id和名称
      this.attrIdAndAttrName = "";
    },
    //销售属性值的添加按钮
    addSaleAttrValue(row) {
      //控制添加按钮与input的显示与隐藏
      this.$set(row, "inputVisible", true);
      //input值的收集
      this.$set(row, "inputValue", "");
    },
    //input失焦回调
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row;
      if (inputValue.trim() == "") {
        this.$message("属性值不能为空");
        return;
      }
      let result = row.spuSaleAttrValueList.every(
        (item) => item.saleAttrValueName != inputValue
      );
      if (!result) {
        this.$message("属性值已存在");
        return;
      }
      let newSaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: inputValue,
      };
      row.spuSaleAttrValueList.push(newSaleAttrValue);
      //input切换为添加按钮
      row.inputVisible = false;
      //保存销售属性值
    },
    //保存按钮的回调
   async AddOrUpdateSpu() {
      //图片需要携带imageName、imageUrl字段
      //把服务器返回的数据整理到spu这个字段上
      //map会返回一个新的数组，直接赋值给spu
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          //不管有没有imageName 都要带上
          imageName: item.name,
          //对于新增的图片，url是本地的，所以要携带的是response里面的data data里面是服务器的url
          //如果是旧图片，直接带url就可以
          imageUrl: (item.response && item.response.data) || item.url,
        };
      });
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      // console.log(result);
      if(result.code==200){
        this.$message({type:'success',message:"保存成功"})
        this.$emit('changeScene',{scene:0,flag:this.spu.id?'修改':'添加'})
      }
      // 清除数据
      Object.assign(this._data,this.$options.data());
    },
   async addSpuData(category3Id){
     //点击添加Spu，把三级联动的3id传过来
     this.spu.category3Id = category3Id
      //获取品牌信息
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      // console.log(tradeMarkResult);
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }
      //获取销售属性
      let BaseSaleResult = await this.$API.spu.reqBaseSaleAttrList();
      if (BaseSaleResult.code == 200) {
        this.BaseSaleList = BaseSaleResult.data;
      }
    },
    //添加spu的取消按钮
    cancel(){
      this.$emit('changeScene',{scene:0,flag:''})
      // Object.assign 是es6新增的方法 用于合并对象
      // this._data是组件实例身上的响应式数据
      // this.$options可以获取配置对象   加上.data可以拿到data配置对象
      // data函数执行，返回的数据是空的
      Object.assign(this._data,this.$options.data());
    }
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>