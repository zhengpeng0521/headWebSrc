import { message  } from 'antd';
import { parse } from 'qs';
import { routerRedux } from 'dva/router';
import {bindTenant} from '../../services/koubei-org-map/koubeiOrgMapService';

//口碑门店绑定 - 租户登陆
export default {

  namespace: 'koubeiOrgMapTenantLoginModel',

  state: {
      loading: false,
      mobile: '',
      password: '',
      tenantId: '',

      tenantList: [],
      tenantSelectVisible: false,
      tenantSelectLoading: false,
  },

  effects: {

      *bindTenant({ payload }, { call, put, select }) {
          let koubeiOrgMapTenantLoginModel = yield select( state => state.koubeiOrgMapTenantLoginModel );

          let mobile = (payload && payload.mobile != undefined && payload.mobile != '') ? payload.mobile : koubeiOrgMapTenantLoginModel.mobile;
          let password = (payload && payload.password != undefined && payload.password != '') ? payload.password : koubeiOrgMapTenantLoginModel.password;
          let tenantId = (payload && payload.tenantId != undefined && payload.tenantId != '') ? payload.tenantId : koubeiOrgMapTenantLoginModel.tenantId;

          yield put({
              type: 'updateState',
              payload: {
                 loading: true,
                 mobile,password,tenantId,
              }
          });

          let params = {mobile,password,};
          if(tenantId != undefined && tenantId != '') {
                params.tenantId = tenantId;
            }

          let {ret} = yield call(bindTenant, parse(params));

          if( ret && ret.errorCode == 9000 ){
            message.success('登陆成功啦!');
            window.initStep = '1';
            yield put({
                type : 'updateState',
                payload : {
                    loading: false,
                }
            });
            yield put(routerRedux.push({
                pathname: '/org_map',
            }));
          } else {
            if( ret && ret.errorCode == 1000 ){
                //出现多租户时
                yield put({
                    type : 'updateState',
                    payload : {
                        tenantList: ret.results,
                        tenantSelectVisible: true,
                        tenantSelectLoading: false,
                    }
                });
            } else {
                yield put({
                    type : 'updateState',
                    payload : {
                        loading: false,
                    }
                });
                message.error((ret && ret.errorMessage) || '账号或密码错误!');
            }
          }
      },
  },

  reducers: {
      updateState(state, action) {
          return { ...state, ...action.payload, };
      },

      closeTenantSelect(state, action) {
          return { ...state, loading: false, tenantList: [], tenantSelectVisible: false, tenantSelectLoading: false, tenantId: '', mobile: '', password: '', };
      },
  },

}
