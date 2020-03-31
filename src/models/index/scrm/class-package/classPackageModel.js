import {
    getClassPackageList,            //得到课时包列表
    deleteClassPackage,             //删除课时包
    getCourseOptList,               //得到课程下拉列表
    getClassPackageInfo,            //修改得到课时包信息
    confirmAddClassPackage,         //确认新增课时包
} from '../../../../services/scrm/class-package/classPackageService';
import parse from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
    namespace : 'classPackageModel',

    state : {

        searchVisible                : false,          //筛选是否可见
        name                         : '',             //课时包名称
        status                       : '',             //课时包状态
        orgId                        : '',             //校区id
		orgKind                      : 1,              //校区类型
        orgIdList                    : [],             //校区下拉列表

        selectedRowKeys              : [],
        selectedRows                 : [],
        selectedRecordIds            : [],

        dataSource                   : [],
        loading                      : false,
        resultCount                  : 0,
        pageSize                     : 20,
        pageIndex                    : 0,

        signleClassPackageInfo       : {},              //单个课时包信息
        classPackageId               : '',              //课时包id
        selectedOrgId                : '',              //已选校区
        createClassPackageVisible    : false,           //新增修改框是否可见

        classHourInfo                : '[{}]',          //课时分配的信息
        courseOptList                : [],
        selectedCourseIds            : [],              //已选择的课程
        createOrgId                  : '',              //创建新的课时套餐默认选中的校区

		newColumns                   : [],

		classPackageBtnLoading       : false,
        /*新增编辑员工时校区选择modal*/
        selectCampusModalVisible : false,           //选择校区modal是否显示
        selectCampus : [],

        checkOrgsModalVisible : false,
        checkOrgsModalData : [],                    //查看所属机构机构数据
        cType : '1'
    },

    subscriptions : {
        setup({ dispatch, history }){
            history.listen( ({ pathname, query }) => {
                if( pathname === '/hq_org_periodpackge' ){
                    dispatch({
                        type : 'getclassPackageParams',
                        payload : {
                            pageIndex : 0,
                            pageSize  : 20,
                            name      : undefined,
                            status    : undefined,
                            orgId     : undefined,
                        }
                    });
                }
            })
        }
    },

    effects : {
        //得到传参
        *getclassPackageParams({ payload },{ call, put, select }){
            let classPackageModel = yield select( state => state.classPackageModel );
            let params = {
                pageSize  : !!payload && payload.pageSize,
                pageIndex : !!payload && payload.pageIndex,
                name      : !!payload && payload.name,
                status    : !!payload && payload.status,
                orgId     : !!payload && payload.orgId
            };
            yield put({
                type : 'getClassPackageList',
                payload : {
                    params
                }
            })
        },

        //得到课时包列表
        *getClassPackageList({ payload },{ call, put, select }){
            yield put({
                type : 'updateState',
                payload : {
                    loading : true,
                }
            })
            let { params } = payload;
            let { ret } = yield call( getClassPackageList, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        dataSource        : ret.results,
                        resultCount       : ret.data.resultCount,
                        selectedRows      : [],
                        selectedRowKeys   : [],
                        selectedRecordIds : [],
                        ...params
                    }
                })
            } else{
                message.error( (ret && ret.errorMessage) || '列表加载失败' )
            }
            yield put({
                type : 'updateState',
                payload : {
                    loading : false,
                }
            })
        },

        //搜索
        *searchFunction({ payload },{ call, put, select }){
            let { values } = payload;
            let classPackageModel = yield select( state => state.classPackageModel );
            let params = {
                pageSize  : classPackageModel.pageSize,
                pageIndex : 0,
                ...values
            }
            yield put({
                type : 'getClassPackageList',
                payload : {
                    params
                }
            })
        },

        //清除条件
        *clearFunction({ payload },{ call, put, select }){
            let classPackageModel = yield select( state => state.classPackageModel );
            let { name, orgId, status } = payload;
            let params = {
                name      : name,
                orgId     : orgId,
                status    : status,
                pageSize  : classPackageModel.pageSize,
                pageIndex : classPackageModel.pageIndex,
            };
            yield put({
                type : 'getClassPackageList',
                payload : {
                    params
                }
            })
        },

        //选择校区
        *selectOrgId({ payload },{ call, put, select }){
            let { orgId } = payload;
			let orgKind = undefined;
			let orgIdList = window._init_data.orgIdList;
			!!orgIdList && orgIdList.map( function( item, index ){
				if( orgId == item.orgId ){
					orgKind = item.orgKind;
				}
			})
			yield put({
				type : 'updateState',
				payload : {
					orgKind
				}
			})
            let { ret } = yield call( getCourseOptList, ({ pageIndex : '0' , pageSize : '9999' , orgIds : payload.orgIds }));
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        courseOptList : ret.results,
                    }
                })
            }
        },

        //修改课时包
        *updateClassPackage({ payload },{ call, put, select }){
            let { id, orgId } = payload;
            let classPackageModel = yield select( state => state.classPackageModel );
            let createClassPackageVisible = classPackageModel.createClassPackageVisible;
            let params = {
                id    : id,
                orgId : orgId,
            };
            let { ret } = yield call( getClassPackageInfo, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                let signleClassPackageInfo = {
                    amount    : ret.amount,
                    cType     : ret.cType,
                    id        : ret.id,
                    orgId     : ret.orgIds,
                    name      : ret.name,
                    intro     : ret.intro,
                    amount    : ret.amount,
                    price     : ret.price,
                    type      : ret.type,
                    status    : ret.status,
                    realPrice : ret.realPrice,
                };
                //调用接口得到可选的课程
                let courseOptList = yield call( getCourseOptList, ({ pageIndex : '0' , pageSize : '9999' , orgIds : ret.orgIds}));
                if( courseOptList && courseOptList.ret && courseOptList.ret.errorCode == '9000' ){
                    yield put({
                        type : 'updateState',
                        payload : {
                            courseOptList : courseOptList.ret.results,
                            selectCampus : ret.orgIds == null ? null : ret.orgIds.split(','),
                            checkOrgsModalData : ret.orgIds == null ? null : ret.orgIds.split(','),
                        }
                    })
                };
                yield put({
                    type : 'updateState',
                    payload : {
                        signleClassPackageInfo    : signleClassPackageInfo,
                        classHourInfo             : ret.scope,
                        createClassPackageVisible : !createClassPackageVisible,
                        classPackageId            : id,
                        cType : ret.cType,
                        selectCampus : ret.orgIds == null ? null : ret.orgIds.split(','),
                        checkOrgsModalData : ret.orgIds == null ? null : ret.orgIds.split(','),
                    }
                })
            }
        },

        //确认新增产品
        *confirmAddClassPackage({ payload },{ call, put, select }){
			yield put({
				type : 'updateState',
				payload : {
					classPackageBtnLoading : true
				}
			})
            let classPackageModel = yield select( state => state.classPackageModel );
            let classPackageId = classPackageModel.classPackageId;
            let { values, createClassPackageVisible } = payload;

            //重新传入后台组装数据
            let newValues = {
                amount    : values.amount,
                cType     : values.cType,
                intro     : values.intro,
                name      : values.name,
                orgIds     : values.orgIds,
                price     : values.price,
                scope     : values.scope,
                status    : values.status,
                type      : values.type,
                realPrice : values.realPrice,
            };

            let params = {};
            if( !!classPackageId ){
                params = {
                    id : classPackageId,
                    ...newValues,
                }
            } else{
                params = {
                    ...newValues,
                };
            };
            let { ret } = yield call( confirmAddClassPackage, ({ ...params }));
            if( ret && ret.errorCode == '9000' ){
                message.success('保存成功');
                let values = {
                    name      : classPackageModel.name,
                    orgId     : classPackageModel.orgId,
                    status    : classPackageModel.status,
                    pageSize  : classPackageModel.pageSize,
                    pageIndex : classPackageModel.pageIndex,
                }
                yield put({
                    type : 'getClassPackageList',
                    payload : {
                        params : values,
                    }
                })
                yield put({
                    type : 'updateState',
                    payload : {
                        classPackageId : '',
                        classHourInfo  : '[{}]',
                        signleClassPackageInfo : {},
                    }
                })
            }else{
				message.error( ret && ret.errorMessage || '新增课时包失败' )
			}
			yield put({
				type : 'updateState',
				payload : {
					classPackageBtnLoading : false
				}
			})
        },

        //删除产品
        *deleteClassPackage({ payload },{ call, put, select }){
            let { selectedRecordIds } = payload;
            let ids = selectedRecordIds.join(',');
            let classPackageModel = yield select( state => state.classPackageModel );
            let { ret } = yield call( deleteClassPackage, ({ ids : ids }));
            if( ret && ret.errorCode == '9000' ){
                message.success('删除成功');
                let params = {
                    pageSize  : classPackageModel.pageSize,
                    pageIndex : classPackageModel.pageIndex,
                    name      : classPackageModel.name,
                    status    : classPackageModel.status,
                    orgId     : classPackageModel.orgId
                }
                yield put({
                    type : 'getClassPackageList',
                    payload : {
                        params
                    }
                });
            }else{
				message.error( ret && ret.errorMessage || '删除失败' )
			}
        },

        //分页
        *pagination({ payload },{ call, put, select }){
            let { pageSize, pageIndex } = payload;
            let classPackageModel = yield select( state => state.classPackageModel );
            let params = {
                pageSize  : pageSize,
                pageIndex : pageIndex - 1,
                name      : classPackageModel.name,
                status    : classPackageModel.status,
                orgId     : classPackageModel.orgId
            }
            yield put({
                type : 'getClassPackageList',
                payload : {
                    params
                }
            })
        }
    },

    reducers : {
        updateState( state, action ){
            return { ...state, ...action.payload };
        }
    }
}
