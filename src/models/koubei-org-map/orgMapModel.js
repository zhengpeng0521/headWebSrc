import { message  } from 'antd';
import { parse } from 'qs';
import { routerRedux } from 'dva/router';
import {initSaasOrgList,initKoubeiShopList,initMapList,updateOrgMap,} from '../../services/koubei-org-map/koubeiOrgMapService';

//口碑门店绑定 - 门店绑定
export default {

  namespace: 'koubeiOrgMapOrgMapModel',

  state: {
      loading: false,
      saasOrgList: [],      // 所有的saas机构列表
      koubeiShopList: [],   //所有的口碑门店列表

      selectOrg: [],        //选中的saas机构
      selectShop: [],       //选中的口碑门店

      mappedList: [],       //初始化已匹配的关联关系 (不可解绑)
      mappingList: [],      //操作中匹配的关联关系 （可解绑）

      orgLoading: false,shopLoading: false,mapLoading: false,
      isSelectAll: true,
  },

  subscriptions: {
      setup({ dispatch, history }) {
          history.listen(( { pathname, query }) => {
              if(pathname === '/org_map') {
                  if(window.initStep != '1') {
                      dispatch(routerRedux.push({
                        pathname: '/tenant_login',
                      }));
                      return;
                  }
                  dispatch({
                    type: 'initSaasOrgList',
                  });

                  dispatch({
                    type: 'initKoubeiShopList',
                  });

                  dispatch({
                    type: 'initMapList',
                  });
              }
          });
      },
  },

  effects: {

      *initSaasOrgList({ payload }, { call, put, select }) {
          yield put({
              type: 'updateState',
              payload: {
                  orgLoading: true,
              }
          });
          let {ret} = yield call(initSaasOrgList);
          if( ret && ret.errorCode == 9000 ){
              let saasOrgList = [];
              let results = ret.results || [];
              results && results.length > 0 && results.map(function(item) {
                    saasOrgList.push({
                        orgId: item.id+'',
                        orgName: item.orgName||'',
                        address: item.address||'',
                    });
              });
              yield put({
                type : 'updateState',
                payload : {
                    saasOrgList,
                    orgLoading: false,
                }
              });
          } else {
              yield put({
                  type: 'updateState',
                  payload: {
                      orgLoading: false,
                  }
              });
              message.error((ret && ret.errorMessage) || '初始化SAAS系统机构出错啦!');
          }
      },

      *initKoubeiShopList({ payload }, { call, put, select }) {
          yield put({
              type: 'updateState',
              payload: {
                  shopLoading: true,
              }
          });
          let {ret} = yield call(initKoubeiShopList);
          if( ret && ret.errorCode == 9000 ){
              let koubeiShopList = [];
              let results = ret.data.shopList || [];
              results && results.length > 0 && results.map(function(item) {
                    koubeiShopList.push({
                        shopId: item.shopId+'',
                        shopName: item.name||'',
                        address: (item.province||'') + (item.city||'') + (item.address||''),
                    });
              });
              yield put({
                type : 'updateState',
                payload : {
                    koubeiShopList,shopLoading: false,
                }
              });
          } else {
              yield put({
                  type: 'updateState',
                  payload: {
                      shopLoading: false,
                  }
              });
              message.error((ret && ret.errorMessage) || '初始化口碑系统门店出错啦!');
          }
      },

      *initMapList({ payload }, { call, put, select }) {
          yield put({
              type: 'updateState',
              payload: {
                  mapLoading: true,
              }
          });
          let {ret} = yield call(initMapList);
          if( ret && ret.errorCode == 9000 ){
              let results = ret.results;
              let mappedList = [];
              results && results.length > 0 && results.map(function(item) {
                let orgId = item.orgId+'';
                let shopId = item.shopId+'';

                mappedList.push({
                    orgId,shopId,
                });
              });
              yield put({
                type : 'updateState',
                payload : {
                    mappedList,
                    mapLoading: false,
                }
              });
          } else {
              yield put({
                  type: 'updateState',
                  payload: {
                      mapLoading: false,
                  }
              });
              message.error((ret && ret.errorMessage) || '初始化现有绑定关系出错啦!');
          }
      },

      *updateOrgMap({ payload }, { call, put, select }) {
          yield put({
              type: 'updateState',
              payload: {
                  loading: true,
              }
          });
          let koubeiOrgMapOrgMapModel = yield select( state => state.koubeiOrgMapOrgMapModel );
          let {mappingList, koubeiShopList,} = koubeiOrgMapOrgMapModel;

          koubeiShopList && koubeiShopList.length > 0 && koubeiShopList.map(function(shopItem) {
              let fag = mappingList.findIndex(function(x) {
                  return x.shopId == shopItem.shopId;
              });
              if(fag == -1) {
                  mappingList.push({
                      shopId: shopItem.shopId,
                      orgId: '',
                  });
              }
          });

          let bindShopStr = JSON.stringify(mappingList);

          let {ret} = yield call(updateOrgMap, parse({bindShopStr}));
          if( ret && ret.errorCode == 9000 ){
              message.success('门店绑定成功');
              yield put({
                  type: 'updateState',
                  payload: {
                      loading: false,
                  }
              });
              window.location = BASE_URL;
          } else {
              yield put({
                  type: 'updateState',
                  payload: {
                      loading: false,
                  }
              });
              message.error((ret && ret.errorMessage) || '没有新增的门店绑定关系!');
          }
      },
  },

  reducers: {
      updateState(state, action) {
          return { ...state, ...action.payload, };
      },

      bindMap(state, action) {
          let {mappingList,} = state;
          let {orgId, shopId} = action.payload;

          let flg = mappingList.find(function(x) {
            return x.shopId == shopId;
          });

          if(flg) {
              flg.orgId = orgId;
          } else {
              mappingList.push({
                  orgId, shopId
              });
          }

          return { ...state, mappingList,};
      },

  },

}
