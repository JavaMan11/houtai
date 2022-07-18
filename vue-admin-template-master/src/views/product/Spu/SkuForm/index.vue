<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称"> {{ spu.spuName }} </el-form-item>
      <el-form-item label="SKU名称">
        <el-input v-model="skuInfo.skuName" placeholder="SKU名称" />
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          v-model="skuInfo.price"
          placeholder="价格(元)"
          type="number"
        />
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input v-model="skuInfo.weight" placeholder="重量(千克)" />
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input v-model="skuInfo.skuDesc" type="textarea" rows="4" />
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item
            v-for="(attr, index) in attrInfoList"
            :key="attr.id"
            :label="attr.attrName"
          >
            <el-select v-model="attr.attrIdAndValueId" placeholder="请选择">
              <el-option
                v-for="(attrValue, index) in attr.attrValueList"
                :key="attrValue.id"
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form ref="form" :inline="true" label-width="80px">
          <el-form-item
            v-for="(saleAttr, index) in spuSaleAttrList"
            :key="saleAttr.id"
            :label="saleAttr.saleAttrName"
          >
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option
                v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          border
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <!-- 想收集点击了复选框的图片信息，要绑定element ui 已经有的回调 -->
          <el-table-column
            prop="prop"
            label="label"
            width="80"
            type="selection"
          />
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row, $index }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width" />
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                v-if="row.isDefault == 0"
                @click="changeDefault(row)"
                >设置默认</el-button
              >
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 存储图片
      spuImageList: [],
      // 存储销售属性
      spuSaleAttrList: [],
      // 存储平台属性
      attrInfoList: [],
      // 收集sku数据的字段
      skuInfo: {
        // 第一大类数据是 父组件给的
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        // 第二大类：需要通过v-model收集
        price: 0,
        skuName: "",
        weight: "",
        skuDesc: "",
        // 第三大类：需要通过自己书写代码
        // 默认图片
        skuDefaultImg: "",
        // 收集图片
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        // 平台属性
        skuAttrValueList: [
          // {
          //   // 平台属性id
          //   attrId: 0,
          //   // 平台属性值id
          //   valueId: 0
          // }
        ],
        // 销售属性
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ],
      },
      spu: {},
      // 复选框收集图片的数据 需要注意的是，收集到的数据并没有isDefault 需要整理之后再发送给服务器
      imageList: [],
    };
  },
  methods: {
    async getData(category1Id, category2Id, spu) {
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      this.spu = spu;
      //  获取图片
      const result = await this.$API.sku.reqSpuImageList(spu.id);
      if (result.code == 200) {
        let list = result.data;
        list.forEach((item) => {
          item.isDefault = 0;
        });
        this.spuImageList = list;
      }
      //  获取销售属性
      const result1 = await this.$API.sku.reqSaleAttrList(spu.id);
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data;
      }
      // 获取平台属性的数据
      const result2 = await this.$API.sku.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (result2.code == 200) {
        this.attrInfoList = result2.data;
      }
    },
    //table表格复选框按钮事件
    handleSelectionChange(params) {
      this.imageList = params;
    },
    // 点击默认按钮的回调
    changeDefault(row) {
      // 排他操作   0代表展示设置默认  1代表展示默认
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      // 把默认图片收集起来
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    cancel() {
      this.$emit("changeScenes", 0);
      Object.assign(this._data, this.$options.data());
    },
    // 保存按钮的回调
  async  save() {
      const { skuInfo, attrInfoList ,spuSaleAttrList,imageList} = this;
      // 整理平台属性的方式1
      // let arr = []
      // attrInfoList.forEach(item=>{
      //   if(item.attrIdAndValueId){
      //    const [attrId,valueId]= item.attrIdAndValueId.split(":")
      //    let obj = {attrId,valueId};
      //    arr.push(obj)
      //   }
      // })
      // skuInfo.skuAttrValueList = arr
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      // 整理销售属性
      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev,item)=>{
        if(item.attrIdAndValueId){
          const [saleAttrId,saleAttrValueId] = item.attrIdAndValueId.split(":");
          prev.push({saleAttrId,saleAttrValueId})
        }
        return prev
      },[])
      // 整理图片的数据
      skuInfo.skuImageList = imageList.map(item=>{
        return {
          imgName:item.imgName,
          imgUrl:item.imgUrl,
          isDefault:item.isDefault,
          spuImgId:item.id
        }
      })
     let result =  await this.$API.sku.reqAddSku(skuInfo)
     if(result.code==200){
      this.$message({type:"success",message:"添加SKU成功"})
      this.$emit('changeScenes',0)
     }
    },
    
      
  },
};
</script>

<style></style>
