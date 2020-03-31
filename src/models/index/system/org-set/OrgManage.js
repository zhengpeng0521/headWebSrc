import {
    ShowOrgManageTable,                     /*获取列表数据*/
    UpdateOrganStatus,                      /*修改机构状态(删除，停用，启用)*/
    OpenAddOrgModalGetCheckBox,             /*表格点击新增编辑校区获取表单中复选框的选项*/
    GetOrgDetail,                           /*点击编辑获取校区回填数据*/
    AddNewOrg,                              /*新增校区提交*/
    EditExistOrg,                           /*编辑校区提交*/
} from '../../../../services/system/org-set/OrgManage';
import { parse } from 'qs';
import { message } from 'antd';

/*角色管理*/
export default {

    namespace: 'orgManage',

    state: {

        /*搜索栏*/
        orgManageSearchVisible : false,             //搜索栏是否显示
        orgManageSearchContentUseing : {},          //营业中搜索栏数据
        orgManageSearchContentDisabled : {},        //已停业搜索栏数据

        /*table*/
        orgManageTableType : 1,                     //table类型('1'营业中/'2'已停业)
        orgManagePageIndexUseing : 0,               //营业中table页码
        orgManagePageSizeUseing : 10,               //营业中表格每页显示数量
        orgManagePageIndexDisabled : 0,             //已停业table页码
        orgManagePageSizeDisabled : 10,             //已停业表格每页显示数量
        orgManageTableType : '1',                   //表格类型(营业中/已停业)
        orgManageTableLoading : false,              //表格加载状态
        orgManageTableTotal : '',                   //表格数据总数
        orgManageTableContent : [],                 //表格数据所有内容
        orgManageTableSelectedRowKeys : [],         //表格多选选中的数组
        orgManageTableSelectedRow : [],             //表格多选中的对象数组

        /*新增编辑校区*/
        addOrEditOrgModalType : '',                 //新增编辑校区类型('add'/'edit')
        addOrEditOrgModalVisible : false,           //新增编辑校区modal是否显示
        addOrEditOrgModalButtonLoading : false,     //新增编辑校区modal按钮是否在加载状态
        addOrEditOrgModalSelectData : {},           //新增编辑校区三个checkbox的选项
        addOrEditOrgModalData : {},                 //编辑校区时回填数据
        wetherAddNewPic : false,                    //是否新增了图片(用于判断图片删除操作)
        addOrEditOrgModaDisplayImg : [],            //用于显示回填的图片数组(包括uid,url,name,thumbUrl)
        addOrEditOrgModalPicArray : [],             //批量上传图片
		
		selectProvincesCityArea		: '',			//当前的省市区
		selectdetailAddress 		: '',			//当前的详细地址

    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/sys_org_list') {
                    dispatch({
                        type : 'ShowOrgManageTable',
                        payload:{
                            pageIndex : 0,
                            pageSize : 10,
                            status : 1
                        }
                    });
                }
            });
        },
    },

    effects: {

        /*获取列表数据*/
        *'ShowOrgManageTable'({ payload },{ put , call , select }){
            yield put({ type : 'showTableLoading' });
            const { ret } = yield call(ShowOrgManageTable,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                yield put({
                    type : 'updateState',
                    payload:{
                        orgManageTableContent : ret.results,
                        orgManageTableTotal : (ret.data).resultCount,
                        orgManageTableSelectedRowKeys : [],         //表格多选选中的数组
                        orgManageTableSelectedRow : [],             //表格多选中的对象数组
                    }
                });
                if(payload.status == '1'){
                    yield put({
                        type:'updateState',
                        payload:{
                            orgManagePageIndexUseing : ret.data.pageIndex,            //营业中table页码
                            orgManagePageSizeUseing : ret.data.pageSize,              //营业中表格每页显示数量
                        }
                    });
                }else if(payload.status == '2'){
                    yield put({
                        type:'updateState',
                        payload:{
                            orgManagePageIndexDisabled : ret.data.pageIndex,            //已停业table页码
                            orgManagePageSizeDisabled : ret.data.pageSize,              //已停业表格每页显示数量
                        }
                    });
                }
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
            yield put({ type : 'closeTableLoading' });
        },

        /*删除停用启用新增编辑之后的请求列表*/
        *'AfterOperationSearchManageTable'({ payload },{ put , call , select }){
            let orgManage = yield select(state => state.orgManage);
            let orgManageSearchContentUseing = orgManage.orgManageSearchContentUseing;
            let orgManageSearchContentDisabled = orgManage.orgManageSearchContentDisabled;
            let status = orgManage.orgManageTableType;
            let pageIndex;
            let pageSize;
            let params = {};
            if(status == '1'){
                pageIndex = orgManage.orgManagePageIndexUseing;
                pageSize = orgManage.orgManagePageSizeUseing;
                params = { pageIndex , pageSize , status , ...orgManageSearchContentUseing }
            }else if(status == '2'){
                pageIndex = orgManage.orgManagePageIndexDisabled;
                pageSize = orgManage.orgManagePageSizeDisabled;
                params = { pageIndex , pageSize , status , ...orgManageSearchContentDisabled }
            }
            let { ret } = yield call(ShowOrgManageTable,parse(params));
            if( ret && ret.errorCode === 9000 ){
                /*如果删除或停用时对当前页全部项目操作，则操作成功后请求前一页的数据(当前页已无数据)*/
                if((ret.results).length == 0 && pageIndex > 0){
                    params.pageIndex = pageIndex-1;     //发送前一页数据请求的页码
                    let { ret } = yield call(ShowOrgManageTable,parse(params));
                    if( ret && ret.errorCode === 9000 ){
                        yield put({
                            type : 'updateState',
                            payload:{
                                orgManageTableContent : ret.results,
                                orgManageTableTotal : (ret.data).resultCount,
                                addOrEditOrgModalVisible : false,
                                addOrEditOrgModalButtonLoading : false,
                                orgManageTableSelectedRowKeys : [],
                                orgManageTableSelectedRow : [],
                                addOrEditOrgModalData : {},
                                addOrEditOrgModalPicArray : [],
                            }
                        });
                        if(status == '1'){
                            yield put({
                                type : 'updateState',
                                payload:{
                                    orgManagePageIndexUseing : params.pageIndex
                                }
                            });
                        }else if(status == '2'){
                            yield put({
                                type : 'updateState',
                                payload:{
                                    orgManagePageIndexDisabled : params.pageIndex
                                }
                            });
                        }
                    }else{
                        ret && ret.errorMessage && message.error(ret.errorMessage);
                    }
                }else{
                    yield put({
                        type : 'updateState',
                        payload:{
                            orgManageTableContent : ret.results,
                            orgManageTableTotal : (ret.data).resultCount,
                            addOrEditOrgModalVisible : false,
                            addOrEditOrgModalButtonLoading : false,
                            orgManageTableSelectedRowKeys : [],
                            orgManageTableSelectedRow : [],
                            addOrEditOrgModalData : {},
                            addOrEditOrgModalPicArray : [],
                        }
                    });
                    if(status == '1'){
                        yield put({
                            type : 'updateState',
                            payload:{
                                orgManagePageIndexUseing : params.pageIndex
                            }
                        });
                    }else if(status == '2'){
                        yield put({
                            type : 'updateState',
                            payload:{
                                orgManagePageIndexDisabled : params.pageIndex
                            }
                        });
                    }
                }
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
        },

        /*修改机构状态(删除，停用，启用)*/
        *'UpdateOrganStatus'({ payload },{ put , call , select }){
            yield put({ type : 'showTableLoading' });
            const { ret } = yield call(UpdateOrganStatus,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                message.success(ret.errorMessage);
                yield put({
                    type : 'updateState',
                    payload : {

                    }
                })
                yield put({
                    type : 'AfterOperationSearchManageTable',
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
            yield put({ type : 'closeTableLoading' });
        },

        /*表格点击新增校区获取机构类型(机构类型获取后再获取适合年龄和配套设施，在modals里处理)*/
        *'OpenAddOrgModalGetCheckBox'({ payload },{ put , call , select }){
            yield put({ type : 'showTableLoading' });
            const { ret } = yield call(OpenAddOrgModalGetCheckBox);
            if( ret && ret.errorCode === 9000 ){
				window.wActivityTimer = setInterval(function(){
					serviceRequest(
						BASE_URL + '/organController/getTenant', {}
					)
				}, 600000 )
                yield put({
                    type : 'updateState',
                    payload:{
                        addOrEditOrgModalSelectData : ret.dict,         //新增编辑校区三个checkbox的选项
                    }
                })
                if(payload.type == 'add'){
                    yield put({
                        type : 'updateState',
                        payload:{
                            addOrEditOrgModalType : 'add',
                            addOrEditOrgModalVisible : true,
                            wetherAddNewPic : false,
                        }
                    });
                }else if(payload.type == 'edit'){
                    yield put({
                        type : 'GetOrgDetail',
                        payload:{
                            organId : payload.organId
                        }
                    });
                }
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
            yield put({ type : 'closeTableLoading' });
        },

        /*编辑获取机构详情*/
        *'GetOrgDetail'({ payload },{ put , call , select }){
            const { ret } = yield call(GetOrgDetail,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                let images = [];
                let displayImg = [];
                let img = [];
                if(ret.images != '' && ret.images != null && ret.images != undefined){
                    images = (ret.images).split(',');
                    for(let i in images){
                        displayImg.push({
                            uid : -i-1,
                            url : images[i],
                            name : images[i],
                            thumbUrl : images[i],
                        });
                    }
                }
								
				//设置经纬度
				_mapNewLng = ret&&ret.log;
	 			_mapNewLat = ret&&ret.lat;
				if(_mapNewLng > 0 && _mapNewLat > 0) {
				   	_mapMoveAfter = true;
				} else {
					_mapMoveAfter = false;
				}
								
                yield put({
                    type : 'updateState',
                    payload:{
                        addOrEditOrgModalType : 'edit',
                        addOrEditOrgModalVisible : true,
                        addOrEditOrgModalData : ret,                 //编辑校区时回填数据
                        wetherAddNewPic : false,
                        addOrEditOrgModalPicArray : displayImg,          //批量上传图片
                        addOrEditOrgModaDisplayImg : displayImg,     //用于显示回填的图片数组(包括uid,url,name,thumbUrl)
						selectProvincesCityArea : ret.privince + ret.city + ret.area,
						selectdetailAddress  : ret&&ret.addr,		
                    }
                });
            }else if( ret && ret.errorMessage ){
                ret && ret.errorMessage && message.error(ret.errorMessage);
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
        },

        /*新增校区提交*/
        *'AddNewOrg'({ payload },{ put , call , select }){
            yield put({ type : 'showTableLoading' });
            const { ret } = yield call(AddNewOrg,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                message.success(ret.errorMessage);
                yield put({
                    type : 'AfterOperationSearchManageTable',
                });
            }else if(ret && ret.errorMessage){
                ret && ret.errorMessage && message.error(ret.errorMessage);
                yield put({
                    type:'updateState',
                    payload:{
                        addOrEditOrgModalButtonLoading : false
                    }
                })
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
            yield put({ type : 'closeTableLoading' });
        },

        /*编辑校区提交*/
        *'EditExistOrg'({ payload },{ put , call , select }){
            yield put({ type : 'showTableLoading' });
            const { ret } = yield call(EditExistOrg,parse(payload));
            if( ret && ret.errorCode === 9000 ){
                message.success(ret.errorMessage);
                yield put({
                    type : 'AfterOperationSearchManageTable',
                });
            }else if(ret && ret.errorMessage){
                ret && ret.errorMessage && message.error(ret.errorMessage);
                yield put({
                    type:'updateState',
                    payload:{
                        addOrEditOrgModalButtonLoading : false
                    }
                })
            }else{
                message.error('您的网络状况不佳，请检查您的网络');
            }
            yield put({ type : 'closeTableLoading' });
        },
    },


    reducers: {
        updateState(state, action) {
            return {...state, ...action.payload};
        },
        //左边角色列表加载中
        showTableLoading(state,action) {
            return { ...state, ...action.payload, orgManageTableLoading: true };
        },
        //左边角色列表加载消失
        closeTableLoading(state,action){
            return { ...state, ...action.payload, orgManageTableLoading: false };
        },
    },
};
