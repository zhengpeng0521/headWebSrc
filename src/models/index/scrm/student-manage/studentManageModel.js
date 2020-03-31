import {
    getDicSelects,
    getSalesList,

} from '../../../../services/index/common/searchSelectListService';
import {
    getStudentList,
    getSellerIdList,
    getStudentInfo,
    confirmCreateForm,
    confirmTranslate,           //确认转移学员

    deleteStudent               //删除学员

} from '../../../../services/scrm/student-manage/studentManageService';

import {
    getFollowUpRecordList,    //跟进记录

} from '../../../../services/erp/student-detail/studentDetailService';
import parse from 'qs';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
export default {
	namespace : 'scrmStudentManageModel',

	state : {

        stuId                         : '',            //学员id
        uids                          : '',

        filterVisible                 : false,         //筛选框是否可见

        //搜索条件
        name                          : '',            //学员姓名
        seller                        : '',            //负责人
        intention                     : '',            //学员类型
        saleStatus                    : '',            //跟进状态
        orgId                         : '',            //所在校区
        channel                       : '',            //来源id
        creator                       : '',            //创建人
        mobile                        : '',            //联系电话
        pageIndex                     : 0,
        pageSize                      : 10,

		dataSource                    : [],            //学员列表
        loading                       : false,         //表格加载
        resultCount                   : '',            //数据总量
        selectedRowKeys               : [],
        selectedRows                  : [],
        selectedRecordIds             : [],            //选中的列表项
        selectedOrgIds                : [],

        createStudentModalVisible     : false,         //新增学员框
        createSellerList              : [],            //新增框内负责人下拉列表
        createOrgId                   : '',            //新增时的orgId
        createOrgName                 : '',            //新增时校区名字

        translateModalVisible         : false,         //转移学员框
        selectedOrgId                 : '',            //转移时的校区

        sellerList                    : [],            //负责人下拉列表
        studentTypeList               : [],            //学员类型下拉列表
        sourceList                    : [],            //来源下拉列表
        saleStatusList                : [],            //跟进状态下拉列表

        studentInfo                   : {},            //修改获得的学员信息


        checkStudentVisible           : false,         //学员查重框
        checkStudentList              : [],            //学员列表
        checkName                     : '',

        menuList                      : {},
        showsaleStatusecord            : false,       //全部跟进记录Modal显示
        saleStatusrecordarr           : [],           //全部跟进记录数组
        saleStatusrecordarrCount      :'',            //全部跟进记录数组总数
        saleStatusrecordarrselctstuId :'',            //点击全部记录时选定的学生Id

        condition                : 'none',         //是否加载全部数据

        wetherClearSearchContent : false,               //切换路由时判断要清空搜索栏数据
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query } ) => {


                if(pathname == '/crm_stu_list') {
                    dispatch({
                        type : 'getStudentListParams',
                        payload : {
                            condition: 'none',
                            uids: '',
                        }
                    });

                    dispatch({
                        type: 'mainLayoutModel/updateState',
                        payload:{
                        SubordinateType :'学员',
                    }
                    });
                    dispatch({
                        type : 'getSelectList',
                        payload : {
                            condition: 'none',
                        }
                    })
                }else if (pathname == '/crm_stu_alllist') {

                    dispatch({
                        type : 'getStudentListParams',
                        payload : {
                            condition: 'all',
                        }
                    });

                    dispatch({
                        type: 'mainLayoutModel/updateState',
                        payload:{
                            SubordinateType :'学员',
                        }
                    });
                    dispatch({
                        type : 'getSelectList',
                        payload : {
                            condition: 'all',
                        }
                    })
                }
            });
        },
    },

	effects : {

        //得到下拉列表
        *getSelectList({ payload },{ call, put, select }){
            //获取学员类型下拉列表
            let studentTypeList = yield call( getDicSelects, ({ dictkey : 'studentType' }) );
            if( studentTypeList.ret && studentTypeList.ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        studentTypeList : studentTypeList.ret.list
                    }
                })
            } else {
                message.error('获得学员类型下拉列表失败');
            };

            //获取跟进状态下拉列表
            let saleStatusList = yield call( getDicSelects, ({ dictkey : 'studentFollowState' }) );
            if( saleStatusList.ret && saleStatusList.ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        saleStatusList : saleStatusList.ret.list
                    }
                })
            } else {
                message.error('获得跟进状态下拉列表失败')
            };

            //获取来源下拉列表
            let sourceList = yield call( getDicSelects, ({ dictkey : 'studentSource' }) );
            if( sourceList.ret && sourceList.ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        sourceList : sourceList.ret.list
                    }
                })
            } else {
                message.error('获得来源下拉列表失败')
            };
        },

        //得到学员管理列表所需参数
        *getStudentListParams({ payload },{ call, put, select }){
            yield put({
                type:'updateState',
                payload:{
                    wetherClearSearchContent : true
                }
            });
            let condition = payload && payload.condition;
            let uids = payload && payload.uids;
            let scrmStudentManageModel = yield select( state => state.scrmStudentManageModel );
            let params = {};
            params = {
                uids : uids == undefined ? scrmStudentManageModel.uids : uids,
                pageIndex : 0,
                pageSize : 10,
                condition : (condition==undefined) ? scrmStudentManageModel.condition : condition,
            }
            /*params = {
                uids      : uids == undefined ? scrmStudentManageModel.uids : uids,
                pageSize  : scrmStudentManageModel.pageSize,
                pageIndex : scrmStudentManageModel.pageIndex,
                name      : scrmStudentManageModel.name,
                seller    : scrmStudentManageModel.seller,
                intention : scrmStudentManageModel.intention,
                orgId     : scrmStudentManageModel.orgId,
                mobile    : scrmStudentManageModel.mobile,
                saleStatus: scrmStudentManageModel.salesStatus,
                channel   : scrmStudentManageModel.channel,
                creator   : scrmStudentManageModel.creator,
                condition  : (condition==undefined) ? scrmStudentManageModel.condition : condition,
            };*/
            yield put({
                type : 'getStudentList',
                payload : {
                    params
                }
            })
        },

        //进入学员管理页面获得学员列表
		*getStudentList({ payload },{ call, put, select }){
            yield put({
                type : 'updateState',
                payload : {
                    loading : true,
                }
            })
            let { params } = payload;

            let scrmStudentManageModel = yield select( state => state.scrmStudentManageModel );
            let condition = params && params.condition;
            params.condition = (condition==undefined) ? scrmStudentManageModel.condition : condition;

            let { ret } = yield call( getStudentList, ({ ...params }) );
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        dataSource        : ret.results,
                        resultCount       : ret.data.resultCount,
                        pageIndex         : ret.data.pageIndex,
                        pageSize          : ret.data.pageSize,
                        selectedRowKeys   : [],
                        selectedRows      : [],
                        selectedRecordIds : [],
                        wetherClearSearchContent : false,
                        ...params
                    }
                })
            } else{
                message.error( (ret && ret.errorMessage ) || '学员列表加载失败' );
            }
            yield put({
                type : 'updateState',
                payload : {
                    loading : false,
                }
            })
        },

        //点击搜索
        *onSearch({ payload },{ call, put, select }){
            let { values } = payload;
            let scrmStudentManageModel = yield select( state => state.scrmStudentManageModel );
            let params = {
                uids       : scrmStudentManageModel.uids,
                pageSize   : scrmStudentManageModel.pageSize,
                pageIndex  : 0,
                ...values
            }
            yield put({
                type : 'getStudentList',
                payload : {
                    params
                }
            });
        },

        //表格搜索
        *subordinateChange({ payload },{ call, put, select }){
            let { ids } = payload;
            let scrmStudentManageModel = yield select( state => state.scrmStudentManageModel );
            let followUpRecordModel = yield select( state => state.followUpRecordModel );
            let params = {
                uids      : ids,
                pageSize  : scrmStudentManageModel.pageSize,
                pageIndex : scrmStudentManageModel.pageIndex,
                name      : scrmStudentManageModel.name,
                seller    : scrmStudentManageModel.seller,
                intention : scrmStudentManageModel.intention,
                orgId     : scrmStudentManageModel.orgId,
                mobile    : scrmStudentManageModel.mobile,
                saleStatus: scrmStudentManageModel.salesStatus,
                channel   : scrmStudentManageModel.channel,
                creator   : scrmStudentManageModel.creator,
            };
            yield put({
                type : 'getStudentList',
                payload : {
                    params
                }
            })
        },

        //点击重置
        *onClear({ payload },{ call, select, put }){
            let { values } = payload;
            let scrmStudentManageModel = yield select( state => state.scrmStudentManageModel );
            let params = {
                pageSize   : scrmStudentManageModel.pageSize,
                pageIndex  : scrmStudentManageModel.pageIndex,
                uids       : scrmStudentManageModel.uids,
                ...values
            };
            yield put({
                type : 'getStudentList',
                payload : {
                    params
                }
            });
            yield put({
                type : 'updateState',
                payload : {
                    sellerList : [],
                }
            })
        },

        //新增学员
        *createStudent({ payload },{ call, put, select }){
            let { createStudentModalVisible } = payload;
            yield put({
                type : 'updateState',
                payload : {
                    createStudentModalVisible : !createStudentModalVisible
                }
            });
        },


        *confirmsaleStatusrecordModal({ payload },{ call, put, select }) {

            let { showsaleStatusecord }= payload;
            yield put({
                type : 'updateState',
                payload : {
                    showsaleStatusecord : !showsaleStatusecord,
                    saleStatusrecordarr : [],
                    saleStatusrecordarrCount      :'',
                    saleStatusrecordarrselctstuId :'',

                }
            });
         },

        *cancelsaleStatusrecordModal({ payload },{ call, put, select }) {
            let { showsaleStatusecord }= payload;
            yield put({
                type : 'updateState',
                payload : {
                    showsaleStatusecord : !showsaleStatusecord,
                    saleStatusrecordarr : [],
                    saleStatusrecordarrCount      :'',
                    saleStatusrecordarrselctstuId :'',
                }
            });
          },
         //全部跟进记录
        *onsaleStatusrecord ({ payload },{ call, put, select }) {

            let { showsaleStatusecord,selctstuId }= payload;

           // 得到跟进记录列表

                    let  params  = {pageSize:10, pageIndex:0,stuId:payload.selctstuId };
                    let { ret } = yield call( getFollowUpRecordList, ({ ...params }));

                    if( ret && ret.errorCode == '9000' ){
                        yield put({
                            type : 'updateState',
                            payload : {
                                saleStatusrecordarr : ret.results,
                                saleStatusrecordarrCount      :ret.data.resultCount,
                                saleStatusrecordarrselctstuId :payload.selctstuId,

                            }
                        });
                        //先请求借口 获取   全部跟进记录
                        //显示全部跟进记录
                        yield put({
                            type : 'updateState',
                            payload : {
                                showsaleStatusecord : !showsaleStatusecord
                            }
                        });
                    }






        },

        *pageindexStatusrecord ({ payload },{ call, put, select }) {

            let { pageIndex,pageSize,stuId}= payload;

            // pageIndex:par.pageIndex,
            //     pageSize:par.pageSize,
            //     stuId:par.stuId,
            // let {  pageIndex,
            //     pageSize,
            //     stuId }= payload;

            let  params  = {pageSize:payload.pageSize, pageIndex:payload.pageIndex,stuId:payload.stuId};

            let { ret } = yield call( getFollowUpRecordList, ({ ...params }));

            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        saleStatusrecordarr : ret.results,
                        saleStatusrecordarrCount      :ret.data.resultCount,
                        saleStatusrecordarrselctstuId :payload.stuId,

                    }
                });

            }
        },

        //学员查重
        *checkStudentStatus({ payload },{ call, put, select }){
            let { name } = payload;
            let scrmStudentManageModel = yield select( state => state.scrmStudentManageModel );
            let orgId = scrmStudentManageModel.createOrgId;
            if( !orgId ){
                message.error( '校区必选' );
            }else{
                let params = {
                    pageSize  : 10000,          //拿到所有数据
                    pageIndex : 0,
                    orgId     : orgId,
                    name      : name,
                }
                let { ret } = yield call( getStudentList, ({ ...params }) );
                if( ret && ret.errorCode == '9000' ){
                    yield put({
                        type : 'updateState',
                        payload : {
                            checkStudentList     : ret.results,
                            checkStudentVisible  : true,
                            checkName            : name,
                        }
                    })
                } else{
                    message.error( (ret && ret.errorMessage ) || '学员加载失败' );
                }
            }

        },

        //选择校区查询学员负责人下拉列表
        *TenantSelectOnSelect({ payload },{ call, put, select }){
            let { value } = payload;
            let scrmStudentManageModel = yield select( state => state.scrmStudentManageModel );
            let { ret } = yield call( getSellerIdList, ({ orgId : value, condition: scrmStudentManageModel.condition }) );
            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        createSellerList : ret.results,
                        createOrgId      : value,
                    }
                })
            }
        },

        //编辑学员
        *updateStudent({ payload },{ call, put, select }){
            let scrmStudentManageModel = yield select( state => state.scrmStudentManageModel );
            let { selectedRecordIds, selectedOrgIds, createStudentModalVisible } = payload;
            let id = selectedRecordIds.join(',');
            let orgId = selectedOrgIds.join(',');
            let { ret } = yield call( getStudentInfo, ({ id : id, orgId : orgId }));
            let sellerIdList = yield call( getSellerIdList, ({ orgId : orgId , condition: scrmStudentManageModel.condition }));
            if( sellerIdList &&　sellerIdList.ret &&　sellerIdList.ret.errorCode == '9000' ){
                yield put({
                    type : 'updateState',
                    payload : {
                        createSellerList : sellerIdList.ret.results,
                    }
                })
            }
            if( ret && ret.errorCode == '9000' ){
                let studentInfo = {
                    id         : ret.id,
                    orgId      : ret.orgId,
                    name       : ret.name,
					vip        : ret.vip,
                    intention  : ret.intention,
                    saleStatus : ret.saleStatus,
                    headimgurl : ret.headimgurl,
                    channel    : ret.channel,
                    seller     : ret.seller,
                    sex        : ret.sex,
                    birthday   : ret.birthday,
                    mobile     : ret.mobile,
                    conaddress : ret.conaddress,
                    community  : ret.community,
                    schaddress : ret.schaddress,
                }
                yield put({
                    type : 'updateState',
                    payload : {
                        studentInfo,
                        stuId  : id,
                        createStudentModalVisible : !createStudentModalVisible,
                    }
                })
            }
        },
        //删除学员
        *deleteStudent({ payload },{ call, put, select }){
            let scrmStudentManageModel = yield select( state => state.scrmStudentManageModel );
            let { selectedRecordIds } = payload;
            let stuIds = selectedRecordIds.join(',');
            let { ret } = yield call( deleteStudent, ({ stuIds : stuIds }));
            if( ret && ret.errorCode == '9000' ){
                let params = {
                    uids      : scrmStudentManageModel.uids,
                    pageSize  : scrmStudentManageModel.pageSize,
                    pageIndex : scrmStudentManageModel.pageIndex,
                    name      : scrmStudentManageModel.name,
                    seller    : scrmStudentManageModel.seller,
                    intention : scrmStudentManageModel.intention,
                    orgId     : scrmStudentManageModel.orgId,
                    mobile    : scrmStudentManageModel.mobile,
                    saleStatus: scrmStudentManageModel.salesStatus,
                    channel   : scrmStudentManageModel.channel,
                    creator   : scrmStudentManageModel.creator,
                };
                yield put({
                    type : 'getStudentList',
                    payload : {
                        params
                    }
                });
            }
        },
        //确认新增学员
        *confirmCreateForm({ payload },{ call, put, select }){
            let { values, createStudentModalVisible } = payload;
            let birthday = '';
            let headimgurl = '';
            if ( values.headimgurl && values.headimgurl.length > 0){
				let head_img_item = values.headimgurl[0];
				let head_img_item_res = head_img_item.response;
				if ( head_img_item_res && head_img_item_res.errorCode == 9000 ){
					headimgurl = head_img_item_res.data.url;
				} else {
					headimgurl = head_img_item.url || "";
				}
			}else{
				if( values.sex == '1' ){
					headimgurl = '//img.ishanshan.com/gimg/img/300f433150bdfe4c13fa0e137efce725'
				}else if( values.sex == '2' ){
					headimgurl = '//img.ishanshan.com/gimg/img/85148fc80751d0efcf809ddab826ca11'
				}
			}
            if( !!values.birthday ){
                birthday = values.birthday.format('YYYY-MM-DD');
            };
            let scrmStudentManageModel = yield select( state => state.scrmStudentManageModel );
            let id = scrmStudentManageModel.stuId;
            let { ret } = yield call( confirmCreateForm, ({ ...values, birthday : birthday, headimgurl : headimgurl, id : id }));
            if( ret && ret.errorCode == '9000' ){
                let params = {
                    uids      : scrmStudentManageModel.uids,
                    pageSize  : scrmStudentManageModel.pageSize,
                    pageIndex : scrmStudentManageModel.pageIndex,
                    name      : scrmStudentManageModel.name,
                    seller    : scrmStudentManageModel.seller,
                    intention : scrmStudentManageModel.intention,
                    orgId     : scrmStudentManageModel.orgId,
                    mobile    : scrmStudentManageModel.mobile,
                    saleStatus: scrmStudentManageModel.salesStatus,
                    channel   : scrmStudentManageModel.channel,
                    creator   : scrmStudentManageModel.creator,
                }
                yield put({
                    type : 'getStudentList',
                    payload : {
                       params
                    }
                })
                yield put({
                    type : 'updateState',
                    payload : {
                        createStudentModalVisible : !createStudentModalVisible,
                        confirmCreateForm         : [],
                        studentInfo               : {},
                        stuId                     : '',
                        createOrgId               : '',
                    }
                })
            }
        },

        //转移学员
        *translateStudent({ payload },{ call, put, select }){
            let { selectedRecordIds, selectedOrgIds, translateModalVisible } = payload;
            let isTranslate = true;
            selectedOrgIds.map(function( item, index ){
                if( item !== selectedOrgIds[0] ){
                    isTranslate = false;
                    message.error('不能选择不同校区的学员');
                    return;
                };
            });
            if( !!isTranslate ){
                let scrmStudentManageModel = yield select( state => state.scrmStudentManageModel );
                let condition = scrmStudentManageModel.condition;
                let { ret } = yield call( getSellerIdList, ({ orgId : selectedOrgIds[0], condition, }));
                if( ret && ret.errorCode == '9000' ){
                    yield put({
                        type : 'updateState',
                        payload : {
                            selectedRecordIds,
                            sellerList            : ret.results,
                            selectedOrgId         : selectedOrgIds[0],
                            translateModalVisible : !translateModalVisible
                        }
                    });

                }
            }
        },

        //确认转移学员
        *confirmTranslate({ payload },{ call, put, select }){
            let { values } = payload;
            let scrmStudentManageModel = yield select( state => state.scrmStudentManageModel );
            let obj = {
                orgId : scrmStudentManageModel.selectedOrgId,
                ids   : scrmStudentManageModel.selectedRecordIds.join(','),
                ...values
            }
            let { ret } = yield call( confirmTranslate, ({ ...obj }) );
            if( ret && ret.errorCode == '9000' ){
                let params = {
                    uids      : scrmStudentManageModel.uids,
                    pageSize  : scrmStudentManageModel.pageSize,
                    pageIndex : scrmStudentManageModel.pageIndex,
                    name      : scrmStudentManageModel.name,
                    seller    : scrmStudentManageModel.seller,
                    intention : scrmStudentManageModel.intention,
                    orgId     : scrmStudentManageModel.orgId,
                    mobile    : scrmStudentManageModel.mobile,
                    saleStatus: scrmStudentManageModel.salesStatus,
                    channel   : scrmStudentManageModel.channel,
                    creator   : scrmStudentManageModel.creator,
                }
                yield put({
                    type : 'getStudentList',
                    payload : {
                        params
                    }
                })
                yield put({
                    type : 'updateState',
                    payload : {
                        selectedOrgId   : '',
                        sellerList      : [],
                        selectedOrgIds  : [],
                    }
                })
            }
        },

        //跳到学员详情页面
        *linkToStudentDetail({ payload },{ call, put, select }){
            let scrmStudentManageModel = yield select( state => state.scrmStudentManageModel );
            let menuList = scrmStudentManageModel.menuList;
            let studentDetailTab = '';
            if( !!menuList.crm_stuparent_mgr ){
                studentDetailTab = 'parentInfo';
            }else if( !!menuList.crm_product_mgr ){
                studentDetailTab = 'accountInfo'
            }else if( !!menuList.crm_follow_mgr ){
                studentDetailTab = 'followUpRecord'
            }else if( !!menuList.crm_sorder_mgr ){
                studentDetailTab = 'contractOrder'
            }else if( !!menuList.crm_rorder_mgr ){
                studentDetailTab = 'refundRecord'
            }else if( !!menuList.erp_course_mgr ){
                studentDetailTab = 'classInfo'
            }else if( !!menuList.erp_cloud_mgr ){
                studentDetailTab = 'studentWorks'
            }else if( !!menuList.erp_stusign_mgr ){
                studentDetailTab = 'signRecord'
            }else if( !!menuList.erp_cp_mgr ){
                studentDetailTab = 'classSchedule'
            }
            let { stuId, orgId } = payload;
            yield put( routerRedux.push('/crm_stu_detail?studentId='+stuId+'&orgId='+orgId+'&key='+studentDetailTab ) );
        },

        //分页
        *paginationChange({ payload },{ call, put, select }){
            let { pageSize , pageIndex } = payload;
            let scrmStudentManageModel = yield select( state => state.scrmStudentManageModel );
            let params = {
                uids      : scrmStudentManageModel.uids,
                pageSize   : pageSize,
                pageIndex  : pageIndex - 1,
                name       : scrmStudentManageModel.name,
                seller     : scrmStudentManageModel.seller,
                intention  : scrmStudentManageModel.intention,
                saleStatus : scrmStudentManageModel.saleStatus,
                orgId      : scrmStudentManageModel.orgId,
                channel    : scrmStudentManageModel.channel,
                creator    : scrmStudentManageModel.creator,
                mobile     : scrmStudentManageModel.mobile
            };
            yield put({
                type : 'getStudentList',
                payload : {
                    params
                }
            })
        }
    },

	reducers : {
		//更改状态
		updateState( state, action ){
			return { ...state, ...action.payload }
		}
	}
}
