import { defaultMaterialsList,deleteMaterialsList,addMaterialsList,updateMaterialsList,getMaterialsMessage } from '../../../../services/erp/materials-manage/materialsManageService';
import { parse } from 'qs';
import { message } from 'antd';

export default {

  namespace: 'materialManage',

  state: {
        pageIndex:0,
        pageSize:10,
        searchVisible:false,    //搜索框是否显示
        formLoading:false,      //表单按钮加载
        loading:false,          //表格加载
        formVisible:false,      //编辑表单展示
        searchData:[],
        lists:[],              //列表数据
        listTotal:0,           //列表数据总数
        selectedRowKeys:[],
        addFormVisible:false,
        selectRowIds:[],        //批量删除的列表项id
        editFormVisible : false,
        modalAllContent:[],
       // tenantId : '127',
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/inventory_list') {
            dispatch({
                type: 'defaultMaterialsList',
                payload:{
                    pageSize : 10,
                    pageIndex : 0,
                }
            });
        }
      });
    },
  },

  effects: {

    //初始时教具方式列表
    *'defaultMaterialsList'({ payload },{ call, put, select }) {
         yield put({ type: 'showLoading'});
         let materialManage = yield select(state => state.materialManage);

         let { ret } =yield call(defaultMaterialsList,parse(...payload));
         if( ret && ret.errorCode ===9000) {
             yield put({
                 type: 'updateState',
                 payload: {
                     lists:ret.results,
                     listTotal:ret.data.resultCount,
                 },
             });
         }else{
              ret && ret.errorMessage && message.error(ret.errorMessage);
         }
         yield put({ type: 'closeLoading'});
    },

    //查询时数据列表
    *'queryMaterialsList'({ payload }, { call, put, select }){     /*操作完成列表查询*/
         yield put({ type: 'showLoading'});
         let materialManage = yield select(state => state.materialManage);
         let searchData = materialManage.searchData || {};
         let pageIndex=materialManage.pageIndex;
         let pageSize=materialManage.pageSize;
         let params={ pageIndex,pageSize,...payload };
         let { ret } =yield call(defaultMaterialsList,parse(params));
         if( ret && ret.errorCode ===9000) {
             yield put({
                 type: 'updateState',
                 payload: {
                     lists:ret.results,
                     listTotal:ret.data.resultCount,
                 },
             });
             yield put({
                type:'closeLoading',
            });
         }else{
              ret && ret.errorMessage && message.error(ret.errorMessage);
         }
     },


    //批量删除数据
     *'deleteMaterialsList'({ payload }, { call, put, select }) {          //批量删除
          yield put({ type: 'showLoading' });
         // let params={ tenantId,...payload };

          const { ret,err } = yield call(deleteMaterialsList, parse(payload));
          if (ret && ret.errorCode === 9000) {
            message.success(ret.errorMessage);
            yield put({
                type: 'defaultMaterialsList',
            });
            yield put({
                type:'updateState',
                payload:{
                       selectedRowKeys : [],
                       selectedRows : [],
                }
            });
          } else {
              ret && ret.errorMessage && message.error(ret.errorMessage);
              yield put({
                  type: 'querySuccess',
              });
          }
    },

    //新增接口
     *'addMaterialsList'({ payload }, { call, put, select }){              //新增提交保存
          yield put({ type: 'showLoading' });
          const { ret,err } = yield call(addMaterialsList, parse(payload));
          if (ret && ret.errorCode === 9000) {
              message.success(ret.errorMessage);
                yield put({
                    type: 'updateState',
                    payload: {
                        formLoading : false,
                        addFormVisible : false,
                    },
                });
                yield put({
                    type:'defaultMaterialsList',
                });
         }else {
            ret && ret.errorMessage && message.error(ret.errorMessage);
         }
        yield put({ type: 'closeLoading' });
    },

    //编辑获取信息
    *'getMaterialsMessage'({ payload }, { call, put, select }){              //编辑页面获取所有数据
         var par={...payload};
         const { ret,err } = yield call(getMaterialsMessage, parse(payload));
         if (ret && ret.errorCode === 9000) {
             yield put({
                type: 'updateState',
                payload : {
                    modalAllContent : ret,
                    formLoading : false,
                    editFormVisible : true,
                }
            })
         }else{
            ret && ret.errorMessage && message.error(errorMessage);
         }

    },

    //编辑更新列表
    *'updateMaterialsList'({ payload },{ call, put, select }){
        const { ret,err } = yield call(updateMaterialsList, parse(payload));
        if (ret && ret.errorCode === 9000) {
              message.success(ret.errorMessage);
                yield put({
                    type: 'updateState',
                    payload: {
                        formLoading : false,
                        editFormVisible : false,
                    },
                });
                yield put({
                    type:'defaultMaterialsList',
                });
         }else {
            ret && ret.errorMessage && message.error(ret.errorMessage);
         }
        yield put({ type: 'closeLoading' });
    }

},


    reducers: {
        //表格加载中
        showLoading(state,action) {
          return { ...state, ...action.payload, loading: true };
        },
        //表格加载消失
        closeLoading(state,action){
            return { ...state, ...action.payload, loading: false };
        },

        //查询成功
        querySuccess(state, action) {
          return { ...state, ...action.payload, loading: false };
        },
        //更新成功
        updateState(state, action) {
            return {...state, ...action.payload};
        },
    },
}
