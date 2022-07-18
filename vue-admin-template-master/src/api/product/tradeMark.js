import request from '@/utils/request'

//获取品牌管理数据的模块
///admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'GET' })

//添加或修改品牌
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    //如果携带id是修改接口
    if (tradeMark.id) {
        return request({ url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMark })
    } else {
        //添加品牌
        return request({ url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark })
    }
}
//删除品牌
export const reqDeleteTradeMark = (id) => request({ url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})
