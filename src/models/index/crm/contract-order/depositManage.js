import {
    GetPaymentMethod,   //获取收款方式
    GetStuSummary,      //校区选择onChange获取所属学员
    GetTableList,       //订金管理列表查询
    CreateOrUpdateModalSubmit,  //新建订金modal提交
    Refund,             //退款
    Remove              //删除
}from '../../../../services/crm/contract-order/depositManage';
import { parse } from 'qs';
import { message } from 'antd';

//订金管理
export default {

  	namespace: 'depositManage',

  	state: {
        //table
        newColumns : [],                //列表控制显示行
        pageIndex : 0,                  //列表页码
        pageSize : 20,                  //列表每页条数
        resultCount : 0,                //列表总共有多少
        loading : false,                //列表加载状态
        dataSource : [],                //列表数据
        selectedRowKeys : [],           //复选框选中项的key
        selectedRows : [],              //复选框选中项数组

        //快捷搜索
        fastSearchContent : {},         //快捷搜索内容

        //高级搜索
        paymentMethod : [],             //收款方式
        superSearchVisible : false,     //高级搜索是否显示
        superSearchContent : {},        //高级搜索内容

        //新建订金
        createOrUpdateModalVisible : false,         //modal是否显示
        createOrUpdateModalLoading : false,         //modal加载状态
        createOrUpdateModalButtonLoading : false,   //modal按钮加载状态
        createOrUpdateModalStu : [],                //modal所属学员

	},

  	subscriptions: {
		setup({ dispatch, history }) {
			history.listen(( { pathname, query }) => {
				if( pathname == '/crm_sorder_deposit' ) {
                    //获取收款方式
                    dispatch({
                        type:'GetPaymentMethod',
                        payload:{
                            pageIndex : 0,
                            pageSize : 99999
                        }
                    })
                    //订金管理列表查询
                    dispatch({
                        type:'GetTableList',
                        payload:{
                            pageIndex : 0,                  //列表页码
                            pageSize : 20,                  //列表每页条数
                        }
                    })
				}
          	});
      	},
  	},

  	effects: {
        //获取收款方式
        *'GetPaymentMethod'({ payload },{call , put , select}){
            let { ret } = yield call(GetPaymentMethod,parse(payload));
            if(ret && ret.errorCode == '9000'){
                let paymentMethod = [];
                for(let i in ret.results){
                    //pos机需要忽略
                    if(ret.results[i].paymentKey != 'pos'){
                        paymentMethod.push({
                            label : ret.results[i].name,
                            key : ret.results[i].id,
                        })
                    }
                }
                yield put({
                    type:'updateState',
                    payload:{
                        paymentMethod
                    }
                })
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('获取收款方式失败')
            }
        },

        //校区选择onChange获取所属学员
        *'GetStuSummary'({ payload },{call , put , select}){
            yield put({ type:'showCreateOrUpdateModalLoading' });
            let { ret } = yield call(GetStuSummary,parse(payload));
            if(ret && ret.errorCode == '9000'){
                yield put({
                    type:'updateState',
                    payload:{
                        createOrUpdateModalStu : ret.results
                    }
                })
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('获取收款方式失败')
            }
            yield put({ type:'closeCreateOrUpdateModalLoading' });
        },

        //订金管理列表查询
        *'GetTableList'({ payload },{call , put , select}){
            yield put({ type:'showTableLoading' });
            let fastSearchContent = {};
            let superSearchContent = {};
            if(payload && payload.fastSearchContent){
                fastSearchContent = payload.fastSearchContent;
                delete payload.fastSearchContent;
            }
            if(payload && payload.superSearchContent){
                superSearchContent = payload.superSearchContent;
                delete payload.superSearchContent;
            }
            let params = { ...payload , ...fastSearchContent , ...superSearchContent }
            let { ret } = yield call(GetTableList,parse(params));
            if(ret && ret.errorCode == '9000'){
                if(ret && ret.results.length == 0 && payload.pageIndex > 0){
                    params.pageIndex -= 1;
                    let { ret } = yield call(GetTableList,parse(params));
                    if(ret && ret.errorCode == '9000'){
                        yield put({
                            type:'updateState',
                            payload:{
                                pageIndex : ret.data.pageIndex,
                                pageSize : ret.data.pageSize,
                                resultCount : ret.data.resultCount,
                                dataSource : ret.results,
                                selectedRowKeys : [],           //复选框选中项的key
                                selectedRows : [],              //复选框选中项数组
                            }
                        })
                    }else{
                        ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('获取订金列表失败')
                    }
                }else{
                    yield put({
                        type:'updateState',
                        payload:{
                            pageIndex : ret.data.pageIndex,
                            pageSize : ret.data.pageSize,
                            resultCount : ret.data.resultCount,
                            dataSource : ret.results,
                            selectedRowKeys : [],           //复选框选中项的key
                            selectedRows : [],              //复选框选中项数组
                        }
                    })
                }
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('获取订金列表失败')
            }
            yield put({ type:'closeTableLoading' });
        },

        //新建订金modal提交
        *'CreateOrUpdateModalSubmit'({ payload },{call , put , select}){
            yield put({ type:'showCreateOrUpdateModalLoading' });
            yield put({ type:'showCreateOrUpdateModalButtonLoading' });
            let { ret } = yield call(CreateOrUpdateModalSubmit,parse(payload));
            if(ret && ret.errorCode == '9000'){
                message.success('新建成功');
                let depositManage = yield select(state => state.depositManage);
                let pageIndex = depositManage.pageIndex;
                let pageSize = depositManage.pageSize;
                let fastSearchContent = depositManage.fastSearchContent;
                let superSearchContent = depositManage.superSearchContent;
                yield put({ type:'clearModalData' })
                yield put({
                    type:'GetTableList',
                    payload:{
                        pageIndex,
                        pageSize,
                        fastSearchContent,
                        superSearchContent
                    }
                })
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('新建失败')
            }
            yield put({ type:'closeCreateOrUpdateModalLoading' });
            yield put({ type:'closeCreateOrUpdateModalButtonLoading' });
        },

        //退款
        *'Refund'({ payload },{call , put , select}){
            yield put({ type:'showTableLoading' });
            let { ret } = yield call(Refund,parse(payload));
            if(ret && ret.errorCode == '9000'){
                message.success('退款成功');
                let depositManage = yield select(state => state.depositManage);
                let pageIndex = depositManage.pageIndex;
                let pageSize = depositManage.pageSize;
                let fastSearchContent = depositManage.fastSearchContent;
                let superSearchContent = depositManage.superSearchContent;
                yield put({
                    type:'GetTableList',
                    payload:{
                        pageIndex,
                        pageSize,
                        fastSearchContent,
                        superSearchContent
                    }
                })
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('退款失败')
            }
            yield put({ type:'closeTableLoading' });
        },

        //删除
        *'Remove'({ payload },{call , put , select}){
            yield put({ type:'showTableLoading' });
            let { ret } = yield call(Remove,parse(payload));
            if(ret && ret.errorCode == '9000'){
                message.success('删除成功');
                let depositManage = yield select(state => state.depositManage);
                let pageIndex = depositManage.pageIndex;
                let pageSize = depositManage.pageSize;
                let fastSearchContent = depositManage.fastSearchContent;
                let superSearchContent = depositManage.superSearchContent;
                yield put({
                    type:'GetTableList',
                    payload:{
                        pageIndex,
                        pageSize,
                        fastSearchContent,
                        superSearchContent
                    }
                })
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('删除失败')
            }
            yield put({ type:'closeTableLoading' });
        },
  	},

  	reducers: {
		updateState( state, action ){
			return { ...state, ...action.payload };
		},
        showTableLoading( state, action ){
			return { ...state, loading : true };
		},
        closeTableLoading( state, action ){
			return { ...state, loading : false };
		},
        showCreateOrUpdateModalLoading( state, action ){
			return { ...state, createOrUpdateModalLoading : true };
		},
        closeCreateOrUpdateModalLoading( state, action ){
			return { ...state, createOrUpdateModalLoading : false };
		},
        showCreateOrUpdateModalButtonLoading( state, action ){
			return { ...state, createOrUpdateModalButtonLoading : true };
		},
        closeCreateOrUpdateModalButtonLoading( state, action ){
			return { ...state, createOrUpdateModalButtonLoading : false };
		},
        clearModalData( state, action ){
            let obj = {
                createOrUpdateModalVisible : false,         //modal是否显示
                createOrUpdateModalLoading : false,         //modal加载状态
                createOrUpdateModalButtonLoading : false,   //modal按钮加载状态
                createOrUpdateModalStu : [],                //modal所属学员
                selectedRowKeys : [],                       //复选框选中项的key
                selectedRows : [],                          //复选框选中项数组
            }
			return { ...state, ...obj };
		},
  	},
}
