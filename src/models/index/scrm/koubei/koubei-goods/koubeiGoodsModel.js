import {message} from 'antd';
import { parse } from 'qs';

import {
    queryKoubeiGoodsCourse,
    queryKoubeiGoodsActivity,
    queryKoubeiGoodsCountOfStatus,
    updateCourseStatus,
    updateActivityStatus,
    getKoubeiGoodsDetailCourse,
    getKoubeiGoodsDetailActivity,
    queryCategoryId,
    queryKoubeiGoogsOrg
} from '../../../../../services/scrm/koubei/koubei-goods/koubeiGoodsService';

//口碑-商品 管理
export default {

  namespace: 'koubeiGoodsModel',

  state: {
      pageIndex: 0,
      pageSize: 10,
      total: 0,
      loading: false,
      dataSource: [],
      selectedRowKeys: [],

      showSearch: false,
      query: {},//模糊检索的条件

      statusActive: '1',// tab过滤的选中项

      goodsType: '',    // 'course','activity'

      effective_count: 0,
      pause_count: 0,
      invalid_count: 0,

      shareVisible: false,
      shareOrgList: [],
      goodsShareBaseUrl: 'http://saas.ishanshan.com/omp-org/koubei/h5/goodsShare?',
      goodsShareUrl: '',
      shareGoodsId: '',
      shareMerchantPid: '',
      shareSelectOrg: undefined,
  },

  subscriptions: {
      setup({ dispatch, history }) {
          history.listen(( { pathname, query }) => {
              if(pathname === '/scrm_kb_course_list') {
                  dispatch({
                    type: 'queryList',
                    payload: {
                        goodsType: 'course',
                        pageIndex: 0,
                    }
                  });
                  dispatch({
                    type: 'updateState',
                    payload: {
                        goodsType: 'course',
                    }
                  });
                  dispatch({
                    type: 'queryCountOfStatus',
                    payload: {
                        goodsType: 'course',
                    }
                  });
                  dispatch({
                      type:'queryCategoryId'
                  });

                  dispatch({
                      type:'queryKoubeiOrgs'
                  });
              } else if(pathname === '/scrm_kb_act_list') {
                  dispatch({
                    type: 'queryList',
                    payload: {
                        goodsType: 'activity',
                        pageIndex: 0,
                    }
                  });
                  dispatch({
                    type: 'updateState',
                    payload: {
                        goodsType: 'activity',
                    }
                  });
                  dispatch({
                    type: 'queryCountOfStatus',
                    payload: {
                        goodsType: 'activity',
                    }
                  });
                  dispatch({
                      type:'queryCategoryId'
                  });
                  dispatch({
                      type:'queryKoubeiOrgs'
                  });
              }
          });
      },
  },

  effects: {

        *queryKoubeiOrgs({ payload } , { put , call , select }){
            let {ret} = yield call( queryKoubeiGoogsOrg);
            if(ret && ret.errorCode == 9000) {
                let all_kb_org_id = [];
                function getKbAllOrgId(array){
                    for(let i in array){
                        if(array[i].children){
                            getKbAllOrgId(array[i].children)
                        }else{
                            all_kb_org_id.push(array[i].shop_id);
                        }
                    }
                    return all_kb_org_id;
                }
                window._init_data.koubei_org_list = ret.results;
                window._init_data.koubei_org_list_id = getKbAllOrgId(ret.results);              //全部门店的ID数组
            }
        },

      /*查询通知列表*/
      *queryList({ payload } , { put , call , select }){
            yield put({
                type : 'changeShowLoading',
            });

            let koubeiGoodsModel = yield select(state => state.koubeiGoodsModel);

            payload = payload || {};
            let pageIndex   = payload.pageIndex != undefined ? payload.pageIndex : koubeiGoodsModel.pageIndex;
            let pageSize    = payload.pageSize != undefined ? payload.pageSize    : koubeiGoodsModel.pageSize;
            let query       = payload.query || koubeiGoodsModel.query;
            let goodsType   = payload.goodsType || koubeiGoodsModel.goodsType;
            let statusActive   = payload.statusActive || koubeiGoodsModel.statusActive;

            let queryParams = {
                pageIndex,pageSize,goodsType,searchStatus: statusActive,...query,
            };
            let result = {};
            if(goodsType == 'course') {
                result = yield call( queryKoubeiGoodsCourse, parse(queryParams));
            } else if(goodsType == 'activity') {
                result = yield call( queryKoubeiGoodsActivity, parse(queryParams));
            }

            if( result.ret && result.ret.errorCode == 9000 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        dataSource: result.ret.results,
                        total: result.ret.data.resultCount,
                        loading: false,
                        pageIndex,pageSize,query,goodsType,statusActive,
                        selectedRowKeys: [],
                    }
                });
            } else {
                yield put({
                    type : 'changeShowLoading',
                });
                message.error((result.ret && result.ret.errorMessage) || '没有获取到口碑商品列表');
            }
      },

        /*查询商品的各个状态数量*/
      *queryCountOfStatus({ payload } , { put , call , select }){
          payload = payload || {};
          let koubeiGoodsModel = yield select(state => state.koubeiGoodsModel);
          let goodsType   = payload.goodsType || koubeiGoodsModel.goodsType;
          let {ret} = yield call(queryKoubeiGoodsCountOfStatus, parse({goodsType: goodsType=='course' ? '1' : '2'}));

          if( ret && ret.errorCode == 9000 ){
                yield put({
                    type : 'updateState',
                    payload : {
                        effective_count : ret.data.ysjCount  || 0,
                        pause_count     : ret.data.wsjCount  || 0,
                        invalid_count   : ret.data.elseCount || 0,
                    }
                });
            } else {
                message.error((ret && ret.errorMessage) || '没有获取到口碑商品各个状态数量');
            }
      },

           /*查询商品的各个状态数量*/
      *updateGoodsStatus({ payload } , { put , call , select }){
          let {goodsId,status,goodsType} = payload;
          let results = {};
          if(goodsType == 'course') {
              results= yield call(updateCourseStatus, parse({goodsId,status}));
          } else if(goodsType == 'activity') {
              results= yield call(updateActivityStatus, parse({goodsId,status}));
          }
          let ret = results.ret;
          if( ret && ret.errorCode == 9000 ){
              message.success('商品状态更改成功');
                yield put({
                    type : 'queryList',
                });
              yield put({
                    type : 'queryCountOfStatus',
                });
            } else {
                message.error((ret && ret.errorMessage) || '商品状态更改出错啦!');
            }
      },

         /*显示商品的分享对话框*/
      *showQrcodeShare({ payload } , { put , call , select }){
          let koubeiGoodsModel = yield select(state => state.koubeiGoodsModel);
          let {goodsShareBaseUrl} = koubeiGoodsModel;

          let {goodsId,goodsType} = payload;
          let results = {};
          if(goodsType == 'course') {
              results= yield call(getKoubeiGoodsDetailCourse, parse({goodsId}));
          } else if(goodsType == 'activity') {
              results= yield call(getKoubeiGoodsDetailActivity, parse({goodsId}));
          }
          let ret = results.ret;
          if( ret && ret.errorCode == 9000 ){
              let orgIds = ret.data.orgIds;
              let merchantPid = ret.results[0].merchantPid;
              let allPerOrg = window._init_data.koubei_org_list;
              let shareOrgList = [];
              if(allPerOrg && allPerOrg.length > 0) {
                  for(let i = 0; i < allPerOrg.length; i++) {
                      let children = allPerOrg[i].children;
                      if(children && children.length > 0) {
                          for(let j = 0; j < children.length; j++) {
                              let orgItem = children[j];
                              if(orgIds.findIndex(function(x) {
                                  return x == orgItem.key;
                              }) > -1 ) {
                                  shareOrgList.push(orgItem);
                              }
                          }
                      }
                  }
              }

              yield put({
                type : 'updateState',
                payload: {
                    shareVisible: true,
                    shareOrgList,
                    goodsShareUrl: '',
                    shareGoodsId: goodsId,
                    shareMerchantPid: merchantPid,
                    shareSelectOrg: undefined,
                }
              });
          } else {
              message.error((ret && ret.errorMessage) || '商品详细查询出错啦!');
          }
      },

        *'queryCategoryId'({ payload },{ call, put, select }){
            let { ret } = yield call(queryCategoryId,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                yield put({
                    type : 'koubeiGoodsFormModel/updateState',
                    payload : {
                        categoryId : ret.results
                    }
                })
            }else if(ret && ret.errorMessage){
                message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查网络情况');
            }
        },
},


  reducers: {
	  updateState(state, action) {
          return {...state, ...action.payload};
      },

      /*显隐模糊检索栏*/
      changeShowSearch(state, action) {
          let showSearch = state.showSearch;
          return {...state, showSearch: !showSearch};
      },

      /*显隐模糊检索栏*/
      changeShowLoading(state, action) {
          let loading = state.loading;
          return {...state, loading: !loading};
      },

          /*商品分享的机构变化时*/
      changeShareSelectOrg(state, action) {
          let {goodsShareUrl,shareGoodsId,shareMerchantPid,goodsShareBaseUrl,} = state;
          let orgId = action.payload.orgId;
          goodsShareUrl = goodsShareBaseUrl + 'merchantPid=' + shareMerchantPid + '&shopId='+orgId+'&goodsId='+shareGoodsId;
          return {...state, goodsShareUrl,shareSelectOrg: orgId};
      },
       /*关闭商品分享*/
      onCloseQrcodeShare(state, action) {
          return {...state, goodsShareUrl: '',shareSelectOrg: undefined, shareVisible: false, shareMerchantPid: '', shareGoodsId: ''};
      },
  }
}
