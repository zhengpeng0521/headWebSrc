import {
    getOrgOptionsList,      //得到校区下拉列表
    getCourseList,          //得到课程列表
    deleteCourse,           //删除课程
    CourseInfoUpdate,       //得到单个课程信息修改
    confirmCreateForm,      //确认新增

    getCourseDetail,        //获取数据详情
    CourseOrderSystemOpen,  //打开课系列表
    CourseOrderSystemAdd,   //新增课系
    CourseOrderSystemEdit,  //编辑课系
    CourseOrderSystemDelete ,//删除课系

    CourseThemeCreate,       //主題新增
    CourseThemeUpdateStatus, //主題刪除
    CourseThemeQuery,        //主題列表查詢
    CourseThemeUpdate,       //主題編輯

} from '../../../../services/campus-management/courseManage/courseManageService';
import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';

export default {
	namespace : 'cerpCourseManageModel',
	state : {

		searchVisible         : false,       //搜索框是否可见
       // orgOptionsList        : [],          //搜索框校区下拉列表
        courseTitle           : '',          //课程名称
        courseType            : '',          //课程类型
        orgId                 : '',          //全局校区id

        id                    : '',          //修改用课程id
		createFormVisible     : false,       //新增框是否可见
        courseInfo            : {},          //课程信息
        ageType               : undefined,   //新增编辑年龄类型
        status               : undefined,   //新增上下架类型
        modalAllDetailContent : {},          //课程信息
        selectModalVisible    : false,       //校区选择框是否可见
        selectOrgs            : [],          //机构选择- 选择的机构列表
		dataSource            : [],          //列表数据
        resultCount           : 0,           //列表数据总数
        loading               : false,
        newColumns            : [],

        selectedRecordIds     : [],          //批量操作选择的列表项
        selectedRecordOrgIds  : [],
        selectedRowKeys       : [],
        selectedRows          : [],

        pageIndex             : 0,
        pageSize              : 20,

        selectedOrgIds        : [],
        selectedOrgModalVisible : false,

        editFormVisible       : false,
        addSchduleVisible     : false,       //添加排课显示
        remindCreateStatus    : false,
        remindEditStatus      : false,

        modalButtonLoading    : false,

        classOrder            : [],                          //新增编辑时课阶课系内容

        /*删除确认modal*/
        removeCourseModalAlertVisible : false,                //删除二次确认modal是否显示
        removeCourseModalAlertTitle : '',                     //删除二次确认modal表单头部
        removeCourseModalAlertContent : '',                   //删除二次确认modal表单内容
        removeCourseModalAlertButtonLoading : false,          //删除二次确认确认按钮加载状态
        removeCourseModalAlertMessage : '',                   //删除二次确认点击确定需要提交的信息

        initOrgId : undefined,                                //当前校区

        /*课系课阶modal*/
        courseOrderSystemModalVisible : false,                //modal是否显示
        courseOrderSystemModalLoading : false,                //modal加载状态
        courseOrderSystemModalData : [],                      //modal数据

        //新增编辑课阶课系
        courseOrderSystemAddOrEditModalVisible : false,        //modal是否显示
        courseOrderSystemAddOrEditModalType    : undefined,    //类型(add/edit)
        courseOrderSystemAddOrEditModalLoading : false,        //表单加载状态
        courseOrderSystemAddOrEditModalData    : {},           //编辑回填数据

        //上课主题modal
        courseTopicModalVisible      : false,                  //modal是否显示
        courseTopicModalLoading      : false,                  //modal加载状态
        courseTopicModalData         : [],                     //modal数据

        //新增或编辑管理上课主题
        courseTopicAddOrEditModalVisible   : false,            //modal是否显示
        courseTopicAddOrEditModalType      : undefined,        //类型(add/edit)
        courseTopicAddOrEditModalLoading   : false,            //表单加载状态
        courseTopicAddOrEditModalData      : {},               //编辑回填数据
        courseTopicId                      : undefined,        //新增时选中的课程id

        /*新增编辑员工时校区选择modal*/
        selectCampusModalVisible : false,           //选择校区modal是否显示
        selectCampus: [],                          //默认添加的校区选项
        /*课系删除失败*/
        classCeletionFailed: false,
        failedText: [],
        classCeletionFailedtow: false,
        editortext: [],
        goeditFormVisible: false,
        editortextlast: [],
        Judgment: false,

	},

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(( { pathname, query }) => {
                if(pathname === '/hq_org_course') {
                    dispatch({
                        type : 'getCourseParams',
						payload : {
							pageSize : 20
						}
                    });

                    dispatch({
                        type:'updateState',
                        payload:{
                            initOrgId : window._init_data.firstOrg && window._init_data.firstOrg.key,
                            createFormModelVisible : false
                        }
                    })
                }
            });
        },
    },

	effects : {
        //得到传参
        *getCourseParams({ payload },{ call, put, select }){
            let cerpCourseManageModel = yield select( state => state.cerpCourseManageModel );
            let pageSize    = payload.pageSize;
            let pageIndex   = cerpCourseManageModel.pageIndex;
            //let orgId = window._init_data.firstOrg.key;                 //获取所选校区
            let params = {
                pageSize,
                pageIndex  : 0,
                //orgId      : orgId,
                title: undefined,
                status:'1'
            };

            yield put({
                type : 'getCourseList',
                payload : {
                    params
                }
            })
        },

        //得到列表数据
        *getCourseList({ payload },{ select , call , put}){
            yield put({
                type : 'updateState',
                payload : {
                    loading : true
                }
            })
            let cerpCourseManageModel = yield select( state => state.cerpCourseManageModel );
            let { params } = payload;

            let { ret } = yield call( getCourseList, ({ ...params }) );
            if(ret && ret.errorCode == 9000 ){
                for(let i in ret.results){
                    if(ret.results[i].minMa==undefined && ret.results[i].maxMa==undefined){
                        ret.results[i].month = ''
                    }else{
                        ret.results[i].month = ret.results[i].minMa + '~' + ret.results[i].maxMa + '月'
                    }

                 }
                yield put({
                    type : 'updateState',
                    payload : {
                        dataSource : ret.results,
                        resultCount : ret.data.resultCount,
                        pageSize   : params.pageSize,
                        pageIndex  : params.pageIndex,
                        //orgId      : window._init_data.firstOrg.key,
                        courseTitle: params.title,
                        selectedRowKeys       : [],
                        selectedRows          : [],
                    }
                })

            } else {
              message.error( (ret && ret.errorMessage) || '查询课程列表出错啦');
          }
          yield put({
              type : 'updateState',
              payload : {
                  loading : false
              }
          })
        },

        //点击搜索按钮进行搜索
        *onCourseSearch({ payload }, { call, put, select }){
            let { values } = payload;
            let cerpCourseManageModel = yield select( state => state.cerpCourseManageModel );
            let params = {
                pageIndex  : 0,
                pageSize   : cerpCourseManageModel.pageSize,
                //orgId      : window._init_data.firstOrg.key,
                title: values.title,
                status:values.status
            };

            yield put({
                type : 'getCourseList',
                payload : {
                    params
                }
            })

        },

        //清除条件
        *onCourseReset({ payload },{ call, put, select }){
            let { id, title, courseType } = payload;
            let cerpCourseManageModel = yield select( state => state.cerpCourseManageModel );
            let params = {
                id         : id,
                title      : title,
                courseType : courseType,
                //orgId      : window._init_data.firstOrg.key,
                pageSize   : cerpCourseManageModel.pageSize,
                pageIndex: cerpCourseManageModel.pageIndex,
                status:cerpCourseManageModel.status
            }
            yield put({
                type : 'getCourseList',
                payload : {
                    params,
                }
            })
        },

        //批量操作删除课程
        *deleteCourse({ payload },{ select, call ,put}){
            let { selectedRecordIds ,selectedRecordOrgIds} = payload;
            let courseIds = selectedRecordIds.join(',');
            let status = '0';
            let cerpCourseManageModel = yield select( state => state.cerpCourseManageModel );

            let params = {
                pageSize   : cerpCourseManageModel.pageSize,
                pageIndex  : cerpCourseManageModel.pageIndex,
                title      : cerpCourseManageModel.courseTitle,
                //orgId      : window._init_data.firstOrg.key,
            }

            let { ret } = yield call( deleteCourse , ({ ids : courseIds ,status : '0' }))

            if( ret && ret.errorCode == '9000' ){
                yield put({
                    type : 'getCourseList',
                    payload : {
                        params
                    }
                });
                yield put({
                    type : 'updateState',
                    payload : {
                        selectedRecordIds : [],
                        selectedRows      : [],
                        selectedRowKeys : [],
                    }
                })
                message.success('删除成功');
            }else{

               message.error(ret && ret.errorMessage);

            }
        },

        //单个删除详情
        *deleteCourseDetail({ payload },{ select, call, put}){
            yield put({ type : 'showAlertModalButtonLoading' });
             let cerpCourseManageModel = yield select( state => state.cerpCourseManageModel );
            const { ret, err } = yield call(deleteCourse, parse(payload));
             let params = {
                pageSize   : cerpCourseManageModel.pageSize,
                pageIndex  : cerpCourseManageModel.pageIndex,
                title      : cerpCourseManageModel.courseTitle,
                //orgId      : window._init_data.firstOrg.key,
                status     : cerpCourseManageModel.status
             }
             if( ret && ret.errorCode == '9000' ){
                message.success('成功');
                yield put({
                    type : 'updateState',
                    payload : {
                        createFormModelVisible:false,
                        /*清空提示框信息*/
                        removeCourseModalAlertVisible : false,                  //删除二次确认modal是否显示
                        removeCourseModalAlertTitle : '',                       //删除二次确认modal表单头部
                        removeCourseModalAlertContent : '',                     //删除二次确认modal表单内容
                        removeCourseModalAlertButtonLoading : false,            //删除二次确认确认按钮加载状态
                        removeCourseModalAlertMessage : {},
                    }
                });
                yield put({
                    type : 'getCourseList',
                    payload : {
                        params,
                    }
                });
                yield put({
                    type : 'updateState',
                    payload : {
                        selectedRecordIds : [],
                        selectedRows      : [],
                        selectedRowKeys : [],
                    }
                })
             } else if (ret.proErrorMsgs) {
                yield put({
                    type : 'updateState',
                    payload : {
                        editortextlast: ret.proErrorMsgs,
                        goeditFormVisible: true
                    }
                })
             } else {
                message.error(ret.errorMessage)  
            }
            yield put({ type : 'closeAlertModalButtonLoading' });
        },


		//点击新建课程按钮
		*createCourse({ payload },{ select , call ,put }){
			let { createFormVisible } = payload;
			yield put({
				type : 'updateState',
				payload : {
					createFormVisible : !createFormVisible,
                    courseInfo : {},
                    selectOrgs : [],
                    ageType: '1',
                    status:'1'
				}
			});

		},

         //查看詳情
        *'getCourseDetail'({ payload }, { call, put, select }){              //编辑页面获取所有数据
            const { ret,err } = yield call(getCourseDetail, parse(payload));
             if (ret && ret.errorCode === 9000) {
                 if(ret.minMa!=undefined && ret.minMa != null &&ret.maxMa !=undefined && ret.maxMa != null){
                    ret.month = ret.minMa + '~' + ret.maxMa + '月';
                 }else{
                    ret.month = '';
                 }

                 yield put({
                    type: 'updateState',
                    payload : {
                        modalAllDetailContent : ret,
                        createFormModelVisible :true,
                    }
                })
             }else{

             }

        },
        //编辑获取详情
        *'EditCourse'({ payload }, { call, put, select }){              //编辑页面获取所有数据
            const { ret,err } = yield call(getCourseDetail, parse(payload));
            if (ret && ret.errorCode === 9000) {
                 let  orgIds = (ret.orgIds).split(',');
                 let  CampusOrgId = [];
                 for(let i in orgIds){
                     if(orgIds[i]!=''){
                         CampusOrgId.push(orgIds[i])
                     }
                 }
                 yield put({
                    type: 'updateState',
                     payload: {
                        editFormVisible:true,
                        courseInfo : ret,
                        selectCampus : CampusOrgId,
                        ageType : (!!ret.ageType || ret.ageType == 0) ? ret.ageType : '1'
                    }
                })
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('获取详情失败')
            }
        },
        //修改课程保存
        *confirmEditFrom({ payload }, { select, call, put }) {
            console.log(payload.status)
			yield put({ type : 'showModalButtonLoading' });
			let minMa = 0;
		    let maxMa = 0;
		    if( payload.ageType == '2' ){
			    minMa = Number(payload.minYe) * 12;
			    maxMa = Number(payload.maxYe) * 12;
		    }else{
			    minMa = payload.minMa;
			    maxMa = payload.maxMa;
		    }
			let params={
                title : payload.title,
                minMa : minMa,
                maxMa : maxMa,
                cost  : payload.cost,
                intro : payload.intro,
                id    : payload.id,
                ageType : payload.ageType,
                groupId : payload.groupId,
				cutType : payload.cutType,
                orgIds: payload.orgIds,
                status: payload.status
           }
            let cerpCourseManageModel = yield select( state => state.cerpCourseManageModel );
			let { ret } = yield call(CourseInfoUpdate, ( params ) );
            let values = {
                    pageSize   : cerpCourseManageModel.pageSize,
                    pageIndex  : cerpCourseManageModel.pageIndex,
                    title      : cerpCourseManageModel.courseTitle,
                    //orgId      : window._init_data.firstOrg.key,
                    status      :cerpCourseManageModel.status
              };

              if (ret && ret.errorCode === 9000) {
                  message.success(ret.errorMessage);
                  yield put({
                        type: 'updateState',
                        payload : {
                            editFormVisible:false,
                        }
                    })
                   yield put({
                        type : 'getCourseList',
                        payload : {
                            params : values,
                        }
                  });
                    yield put({
                        type:'getCourseDetail',
                        payload:{
                            id : payload.id,
                            //orgId : payload.orgId
                        }
                    })

              } else if (ret.proErrorMsgs) {
                yield put({
                    type:'updateState',
                    payload:{
                        editortext: ret.proErrorMsgs,
                        classCeletionFailedtow:true, 
                    }
                });
              } else {
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('编辑课系列表失败')
            } 
            yield put({ type : 'closeModalButtonLoading' });
        },
        *confirmEditFromLast({ payload }, { select, call, put }) {
            console.log(payload.status)
			yield put({ type : 'showModalButtonLoading' });
			let minMa = 0;
		    let maxMa = 0;
		    if( payload.ageType == '2' ){
			    minMa = Number(payload.minYe) * 12;
			    maxMa = Number(payload.maxYe) * 12;
		    }else{
			    minMa = payload.minMa;
			    maxMa = payload.maxMa;
		    }
			let params={
                title : payload.title,
                minMa : minMa,
                maxMa : maxMa,
                cost  : payload.cost,
                intro : payload.intro,
                id    : payload.id,
                ageType : payload.ageType,
                groupId : payload.groupId,
				cutType : payload.cutType,
                orgIds: payload.orgIds,
                status: payload.status
           }
            let cerpCourseManageModel = yield select( state => state.cerpCourseManageModel );
			let { ret } = yield call(CourseInfoUpdate, ( params ) );
            let values = {
                    pageSize   : cerpCourseManageModel.pageSize,
                    pageIndex  : cerpCourseManageModel.pageIndex,
                    title      : cerpCourseManageModel.courseTitle,
                    //orgId      : window._init_data.firstOrg.key,
                    status      :cerpCourseManageModel.status
              };

              if (ret && ret.errorCode === 9000) {
                  message.success(ret.errorMessage);
                  yield put({
                        type: 'updateState',
                        payload : {
                            editFormVisible:false,
                        }
                    })
                   yield put({
                        type : 'getCourseList',
                        payload : {
                            params : values,
                        }
                  });

              } else if (ret.proErrorMsgs) {
                yield put({
                    type:'updateState',
                    payload:{
                        editortext: ret.proErrorMsgs,
                        classCeletionFailedtow:true, 
                    }
                });
              } else {
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('编辑课系列表失败')
            } 
            yield put({ type : 'closeModalButtonLoading' });
        },




        //打开校区选择框
        *onOpenSelectOrgModal({ payload },{ select , put , call }){
            let { selectModalVisible } = payload;
            yield put({
                type : 'updateState',
                payload : {
                    selectModalVisible : !selectModalVisible
                }
            })
        },

        //关闭校区选择框
        *onSelectOrgModalClose({ payload },{ select , put , call }){
            let { selectModalVisible } = payload;
            yield put({
                type : 'updateState',
                payload : {
                    selectModalVisible : !selectModalVisible
                }
            })
        },

        //点击提交更新校区
        *afterSelectOrgModalSubmit({ payload },{ select , put , call }){
            let { selectOrgs } = payload;
            yield put({
                type : 'updateState',
                payload : {
                    selectOrgs
                }
            })
        },

		//确认新建课程
       *confirmCreateForm({ payload }, { call, put, select }){
           yield put({ type:'showModalButtonLoading' });
           let cerpCourseManageModel = yield select( state => state.cerpCourseManageModel );
		   let minMa = 0;
		   let maxMa = 0;
		   if( payload.ageType == '2' ){
			   minMa = Number(payload.minYe) * 12;
			   maxMa = Number(payload.maxYe) * 12;
		   }else{
			   minMa = payload.minMa;
			   maxMa = payload.maxMa;
		   }
           let params = {
               title : payload.title,
               minMa : minMa,
               maxMa : maxMa,
               cost  : payload.cost,
               intro : payload.intro,
			   ageType : payload.ageType,
               groupId : payload.groupId,
			   cutType : payload.cutType,
               orgIds: payload.orgIds,
               status:payload.status
           }

              let { ret } = yield call(confirmCreateForm, parse(params));
              let values = {
                    pageSize   : cerpCourseManageModel.pageSize,
                    pageIndex  : cerpCourseManageModel.pageIndex,
                    title      : cerpCourseManageModel.courseTitle,
                    //orgId      : window._init_data.firstOrg.key,
                    status      :cerpCourseManageModel.status
              };
              //let orgid = payload.orgId;
              if (ret && ret.errorCode === 9000) {
                  message.success(ret.errorMessage);
                  yield put({
                        type : 'getCourseList',
                        payload : {
                            params : values
                        }
                  });
                  yield put({
                        type : 'updateState',
                        payload : {
                             createFormVisible : false,
                             selectCampus : [],
                        }
                    })

              }else {
                ret && ret.errorMessage && message.error(ret.errorMessage);
              }
            yield put({ type : 'closeModalButtonLoading' });
        },



		//取消新建课程
		*cancelCreateForm({ payload } , { select , put ,call }){
			let { createFormVisible } = payload;
			yield put({
				type : 'updateState',
				payload : {
					createFormVisible : !createFormVisible,
                    courseInfo : {},
                    selectOrgs : [],
				}
			})
		},

        //分页
        *paginationChange({ payload } , { select , put ,call }){
            let { pageSize , pageIndex } = payload;
            let cerpCourseManageModel = yield select( state => state.cerpCourseManageModel );
            let params = {
                pageSize   : pageSize,
                pageIndex  : pageIndex - 1,
                title      : cerpCourseManageModel.courseTitle,
                //courseType : cerpCourseManageModel.courseType,
                //orgId      : window._init_data.firstOrg.key,
            };
            yield put({
                type : 'getCourseList',
                payload : {
                    params
                }
            })
        },

        //课系课阶modal打开获取列表
        *'CourseOrderSystemOpen'({ payload } , { select , put ,call }){
            yield put({ type : 'showCourseOrderSystemModalLoading' });
            let { ret } = yield call(CourseOrderSystemOpen,parse(payload));
            if(ret && ret.errorCode == '9000'){
                yield put({
                    type:'updateState',
                    payload:{
                        courseOrderSystemModalData : ret.results,
                        classOrder : ret.results
                    }
                });
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('获取课系列表失败')
            }
            yield put({ type : 'closeCourseOrderSystemModalLoading' });
        },

        //新增课系
        *'CourseOrderSystemAdd'({ payload } , { select , put ,call }){
            yield put({ type : 'showCourseOrderSystemAddOrEditModalLoading' });
            let { ret } = yield call(CourseOrderSystemAdd,parse(payload));
            if(ret && ret.errorCode == '9000'){
                message.success('新增课系成功');
                yield put({
                    type:'updateState',
                    payload:{
                        courseOrderSystemAddOrEditModalVisible : false,
                        courseOrderSystemAddOrEditModalType : undefined,
                    }
                });
                yield put({
                    type:'CourseOrderSystemOpen',
                    payload:{
                        //orgId : payload.orgId
                    }
                })
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('新增课系失败')
            }
            yield put({ type : 'closeCourseOrderSystemAddOrEditModalLoading' });
        },

        //修改课系
        *'CourseOrderSystemEdit'({ payload } , { select , put ,call }){
            yield put({ type : 'showCourseOrderSystemAddOrEditModalLoading' });
            let { ret } = yield call(CourseOrderSystemEdit,parse(payload));
            if(ret && ret.errorCode == '9000'){
                message.success('编辑课系成功');
                yield put({
                    type:'updateState',
                    payload:{
                        courseOrderSystemAddOrEditModalVisible : false,
                        courseOrderSystemAddOrEditModalData : {},
                        courseOrderSystemAddOrEditModalType : undefined,
                    }
                });
                yield put({
                    type:'CourseOrderSystemOpen',
                    payload:{
                        //orgId : payload.orgId
                    }
                })
            }else {
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('编辑课系失败') 
            }
            yield put({ type : 'closeCourseOrderSystemAddOrEditModalLoading' });
        },

        //删除课系
        *'CourseOrderSystemDelete'({ payload } , { select , put ,call }){
            yield put({ type : 'showCourseOrderSystemAddOrEditModalLoading' });
            let { ret } = yield call(CourseOrderSystemDelete,parse(payload));
            if(ret && ret.errorCode == '9000'){
                message.success('删除课系成功');
                yield put({
                    type:'updateState',
                    payload:{
                        courseOrderSystemAddOrEditModalVisible : false
                    }
                });
                yield put({
                    type:'CourseOrderSystemOpen',
                    payload:{
                        //orgId : payload.orgId
                    }
                })
            } else if (ret.courseErrorMsgs) {
                yield put({
                    type:'updateState',
                    payload: {
                        failedText:ret.courseErrorMsgs,
                        classCeletionFailed : true
                    }
                });
            } else {
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('新增课系失败')
            }
            yield put({ type : 'closeCourseOrderSystemAddOrEditModalLoading' });
        },
        //主題列表
        *'CourseThemeQuery'({ payload } , { select , put ,call }){
            yield put({ type : 'showCourseOrderSystemModalLoading' });
            let { ret } = yield call(CourseThemeQuery,parse(payload));
            if(ret && ret.errorCode == '9000'){
                yield put({
                    type:'updateState',
                    payload:{
                        courseTopicModalData  : ret.results,
                        courseTopicId         : payload.courseId,
                    }
                });
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('获取主題列表失败')
            }
            yield put({ type : 'closeCourseOrderSystemModalLoading' });
        },
        //新增主题
        *'CourseThemeCreate'({ payload } , { select , put ,call }){
            yield put({ type : 'showCourseOrderSystemAddOrEditModalLoading' });
            let { ret } = yield call(CourseThemeCreate,parse(payload));
            if(ret && ret.errorCode == '9000'){
                message.success('新增主题成功');
                yield put({
                    type:'updateState',
                    payload:{
                        courseTopicAddOrEditModalVisible    : false,
                        courseTopicAddOrEditModalType : undefined,
                    }
                });
                yield put({
                    type:'CourseThemeQuery',
                    payload:{
                        courseId : payload.courseId
                    }
                })
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('新增主题失败')
            }
            yield put({ type : 'closeCourseOrderSystemAddOrEditModalLoading' });
        },
        //修改主题
        *'CourseThemeUpdate'({ payload } , { select , put ,call }){
            yield put({ type : 'showCourseOrderSystemAddOrEditModalLoading' });
            let cerpCourseManageModel = yield select( state => state.cerpCourseManageModel );
            let { ret } = yield call(CourseThemeUpdate,parse(payload));
            if(ret && ret.errorCode == '9000'){
                message.success('编辑主题成功');
                yield put({
                    type:'updateState',
                    payload:{
                        courseTopicAddOrEditModalVisible : false,
                        courseTopicAddOrEditModalData : {},
                        courseTopicAddOrEditModalType : undefined,
                    }
                });
                yield put({
                    type:'CourseThemeQuery',
                    payload:{
                        courseId : cerpCourseManageModel.courseTopicId
                    }
                })
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('编辑主题失败')
            }
            yield put({ type : 'closeCourseOrderSystemAddOrEditModalLoading' });
        },
        //删除主题
        *'CourseThemeUpdateStatus'({ payload } , { select , put ,call }){
            yield put({ type : 'showCourseOrderSystemAddOrEditModalLoading' });
            let cerpCourseManageModel = yield select( state => state.cerpCourseManageModel );
            let { ret } = yield call(CourseThemeUpdateStatus,parse(payload));
            if(ret && ret.errorCode == '9000'){
                message.success('删除主题成功');
                yield put({
                    type:'updateState',
                    payload:{
                        courseTopicAddOrEditModalVisible : false
                    }
                });
                yield put({
                    type:'CourseThemeQuery',
                    payload:{
                        courseId : cerpCourseManageModel.courseTopicId
                    }
                })
            }else{
                ret && ret.errorMessage ? message.error(ret.errorMessage) : message.error('删除主题成功')
            }
            yield put({ type : 'closeCourseOrderSystemAddOrEditModalLoading' });
        },

	},

	reducers : {
		//更改状态
		updateState( state, action ){
			return { ...state, ...action.payload }
		},
        //开启编辑框按钮加载
		showModalButtonLoading( state, action ){
			return { ...state, ...action.payload , modalButtonLoading : true }
		},
        //关闭编辑框按钮加载
		closeModalButtonLoading( state, action ){
			return { ...state, ...action.payload , modalButtonLoading : false }
		},
        //关闭编辑框按钮加载
		showAlertModalButtonLoading( state, action ){
			return { ...state, ...action.payload , removeCourseModalAlertButtonLoading : true }
		},
        //关闭编辑框按钮加载
		closeAlertModalButtonLoading( state, action ){
			return { ...state, ...action.payload , removeCourseModalAlertButtonLoading : false }
		},
        //开启课系管理modal加载状态
        showCourseOrderSystemModalLoading( state, action ){
			return { ...state, ...action.payload , courseOrderSystemModalLoading : true }
		},
        //开启课系管理modal加载状态
        closeCourseOrderSystemModalLoading( state, action ){
			return { ...state, ...action.payload , courseOrderSystemModalLoading : false }
		},
        //开启课系新增modal加载状态
        showCourseOrderSystemAddOrEditModalLoading( state, action ){
			return { ...state, ...action.payload , courseOrderSystemAddOrEditModalLoading : true }
		},
        //开启课系管理modal加载状态
        closeCourseOrderSystemAddOrEditModalLoading( state, action ){
			return { ...state, ...action.payload , courseOrderSystemAddOrEditModalLoading : false }
		},
	}
}
