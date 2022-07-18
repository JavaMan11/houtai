import request from "@/utils/request"

//获取Spu列表数据
export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: 'get', params: { category3Id } });

//获取spu信息
///admin/product/getSpuById/{spuId}
export const reqSpuInfo = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: "get" })

//获取品牌的信息
export const reqTradeMarkList = () => request({ url: `/admin/product/baseTrademark/getTrademarkList`, method: "get" })

//获取spu图标
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: "get" })

//获取品牌销售属性-----全平台的品牌最多只有三个销售属性
export const reqBaseSaleAttrList = () => request({ url: `/admin/product/baseSaleAttrList`, method: "get" })

//修改||保存SPU-----因为保存有两种情况，修改和保存
export const reqAddOrUpdateSpu = (spuInfo) => {
    //如果有id则发起修改接口
    if (spuInfo.id) {
        return request({ url: '/admin/product/updateSpuInfo', method: 'post', data: spuInfo });
    } else {
        //如果没有id则发起保存接口
        return request({ url: '/admin/product/saveSpuInfo', method: 'post', data: spuInfo });
    }
}

//删除按钮接口
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: 'delete' });