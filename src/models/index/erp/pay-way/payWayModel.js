import { defaultPayWayList,deletePayWay,newAddPayWay,getAllMessage,getPayWaySelect,updatePayWay } from '../../../../services/erp/pay-way/payWay';
import { parse } from 'qs';
import { message } from 'antd';

export default {

  namespace: 'payWay',

  state: {
        pageIndex:0,
        pageSize:10,

        searchVisible:false,    //搜索框是否显示
        formLoading:false,      //表单按钮加载

        loading:false,          //表格加载
        formVisible:false,      //编辑表单展示

        formData:{},
        searchData:[],

        lists:[],              //列表数据
        listTotal:0,           //列表数据总数
        selectedRowKeys:[],
        selectedRows : [],

        addFormVisible:false,
        editFormVisible:false,

        selectRowIds:[],        //批量删除的列表项id
        selectContent:[],       //新增支付方式下拉框

        modalAllContent:[],     //编辑列表数据
        modalValue:"",              //下拉框的key值


        selectModalVisible:false, //校区选择框是否可见
        selectOrgs : [],          //机构选择- 选择的机构列表

       itemId : '',             //编辑时当前项的ID
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (location.pathname === '/mode_of_payment') {
            dispatch({
                type: 'defaultPayWayList',
                payload:{
                    pageIndex:0,
                    pageSize:10,
                }
            });
        }
      });
    },
  },

  effects: {
    *'defaultPayWayList'({ payload },{ call, put, select }) {     //初始时支付方式列表
         yield put({ type: 'showLoading'});
         let { ret } =yield call(defaultPayWayList,parse(payload));
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

    *'deletePayWay'({ payload }, { call, put, select }) {          //批量删除
      yield put({ type: 'showLoading' });
      const { ret,err } = yield call(deletePayWay, parse(payload));

      if (ret && ret.errorCode === 9000) {
        message.success(ret.errorMessage);
        yield put({
              type: 'defaultPayWayList',
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

    *'onOpenSelectOrgModal'({ payload },{ select , put , call }){     //打开校区选择框

    },

    *'onSelectOrgModalClose'({ payload },{ select , put , call }){    //关闭校区选择框
        let { selectModalVisible } = payload;
        yield put({
            type : 'updateState',
            payload : {
                selectModalVisible : !selectModalVisible
            }
        })
    },


    *'afterSelectOrgModalSubmit'({ payload },{ select , put , call }){  //点击提交更新校区
        let { selectOrgs } = payload;
        yield put({
            type : 'updateState',
            payload : {
                selectOrgs
            }
        })
    },

    *'newAddPayWay'({ payload }, { call, put, select }){              //新增提交保存
          yield put({ type: 'showLoading' });
          const { ret,err } = yield call(newAddPayWay, parse(payload));
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
                    type:'afterOperation',
                });
         }else {
            ret && ret.errorMessage && message.error(ret.errorMessage);
         }
        yield put({ type: 'closeLoading' });
    },

   *'editUpdatePayWay'({ payload }, { call, put, select }){              //编辑提交请求
          yield put({ type: 'showLoading' });
          const { ret,err } = yield call(updatePayWay, parse(payload));    //进行更新请求操作
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
                    type:'afterOperation',
                });
         }else {
            ret && ret.errorMessage && message.error(ret.errorMessage);
         }
        yield put({ type: 'closeLoading' });
    },


    *'payWaySelect'({ payload }, { call, put, select }){       //新增支付方式下拉框
        const { ret,err } = yield call(getPayWaySelect, parse(payload));
         if (ret && ret.errorCode === 9000) {
            yield put({
                type: 'updateState',
                payload : {
                    selectContent : ret.List,                  //获取下拉框的内容
                    formLoading : false,
                    addFormVisible:true,
                }
            });
         }else{
            ret && ret.errorMessage && message.error(errorMessage);
         }
     },

    *'editPayWaySelect'({ payload }, { call, put, select }){       //编辑支付方式下拉框
        const { ret,err } = yield call(getPayWaySelect, parse(payload));
         if (ret && ret.errorCode === 9000) {
            yield put({
                type: 'updateState',
                payload : {
                    selectContent : ret.List,                  //获取下拉框的内容
                    formLoading : false,
                    editFormVisible:true,
                }
            });
         }else{
            ret && ret.errorMessage && message.error(errorMessage);
         }
     },

     *'editpayWayConent'({ payload }, { call, put, select }){   //进入编辑页面获取数据以及下拉框数据
         const { ret,err } = yield call(getPayWaySelect);
         if (ret && ret.errorCode === 9000) {
             yield put ({
                 type:'getAllMessage',                          //获取编辑前的数据,
                 payload:{
                     ...payload,
                 }
             });
             yield put({
                type:'editPayWaySelect',                             //获取下拉框数据，
             });
             yield put({
                type:'updateState',                               //全部获取后编辑框显示
                payload:{
                    formLoading : false,
                    editFormVisible : true,
                }
            });
         }else{
            ret && ret.errorMessage && message.error(errorMessage);
         }
     },

    *'getAllMessage'({ payload }, { call, put, select }){              //编辑页面获取所有数据
        const { ret,err } = yield call(getAllMessage, parse(payload));
         if (ret && ret.errorCode === 9000) {
             yield put({
                type: 'updateState',
                payload : {
                    modalAllContent : ret.results,
                    formLoading : false,
                    editFormVisible : true,
                }
            })
         }else{
            ret && ret.errorMessage && message.error(errorMessage);
         }

    },


    *'afterOperation'({ payload }, { call, put, select }){     /*操作完成列表查询*/
         yield put({ type: 'showLoading'});
         let payWay = yield select(state => state.payWay);
         let searchData = payWay.searchData || {};
         let pageIndex=payWay.pageIndex;
         let pageSize=payWay.pageSize;
         let params={ pageIndex,pageSize,...payload };
         let { ret } =yield call(defaultPayWayList,parse(params));
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
     },

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
