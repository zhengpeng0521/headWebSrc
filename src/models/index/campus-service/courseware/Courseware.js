import {
    GetLeftCoursewareList,          //获取校区信息左侧组织架构
    GetCoursewareList,              //获取课件列表数据
    RightTableOpenDetail,           //获取课件详情(有几张图片)
    GetDetailImg,                    //如果详情图片多余0张，则获取第一张做默认显示
    CoursewareDelete,               //课件删除
    ReleaseCoursewareModalSubmit,   //发布课件提交
    CoursewareDetailInfo,           //课件详情
    CoursewareUpdate,               //课件编辑
    getGroupList,                   //获取课件分组列表
    changeGroupName,                //修改分组名
    copyGroup,                      //复制分组
    saveGroupInfo,                  //保存分组信息
} from '../../../../services/campus-service/courseware/Courseware';
import { parse } from 'qs';
import { message } from 'antd';

/*教学课件*/
export default {

    namespace: 'courseware',

    state: {
        /*左侧组织架构*/
        leftFrameworkData : [],                 //组织架构数据
        leftFrameworkLoading : false,           //加载状态
        leftFrameworkOpenTag : [],              //打开的节点，默认打开架构二级菜单数组['a','b']
        leftFrameworkInitOpenTag : ['all'],     //默认打开的节点
        leftFrameworkSearchContent : {},        //左边搜索数据
        /*右侧列表*/
            /*搜索内容*/
            rightFastSearchContent : {},        //快捷搜索内容
            nameOrder : undefined,              //姓名排序
            createOrder : undefined,            //发布时间排序

            /*列表内容*/
            rightTablePageIndex : 0,            //页码
            rightTablePageSize : 20,            //每页条数
            rightTableLoading : false,          //表格加载状态
            rightTableTotal : 0,                //表格数据总数
            rightTableData : [],                //表格数据所有内容
            rightTableSelectedRowKeys : [],     //选中项的key
            rightTableSelectedRows : [],        //选中项的数组集合

        /*发布课件modal*/
        releaseCoursewareModalVisible : false,      //modal是否显示
        releaseCoursewareModalLoading : false,      //表单加载状态
        releaseCoursewareModalButtonLoading : false,//提交按钮加载状态

        /*课件查看modal*/
        coursewareCheckModalVisible : false,        //modal是否显示
        coursewareCheckModalImgTenantId : undefined,//租户id
        coursewareCheckModalImgCourseId : undefined,//课件id
        coursewareCheckModalImgTotal : 0,           //modal课件图片个数
        coursewareCheckModalImgIndex : 1,           //课件图片分页(默认是1)
        coursewareCheckModalImgRatio : undefined,   //课件图片宽高比
        coursewareCheckModalCurrentUrl : undefined, //当前显示课件的图片url
        show_standard_length : 0,                   //具体显示的标准长度

        TypeStatus          : '0',

        enlargeSpaceVisible : false,

        useStorage : 0,  //已用空间
        totalStorage : 0, //总容量

        courseType: undefined, //课件类型
        courseVideoSrc : '',  //视频地址

        /*新增编辑员工时校区选择modal*/
        selectCampusModalVisible : false,           //选择校区modal是否显示
        selectCampus : [],                          //默认添加的校区选项

        //新增编辑员工时部门选择modal
        departmentModalVisible  : false,
        departmentIds : [],

        //查看所选校区
        selectedOrgModalVisible            : false,
        selectedOrgIds                     : [],
        modifyCourse                       : false,           //显示选中的机构
        allVisible : '1',

        //课件详情
        CoursewareDetailInfo               : {},
        releaseCoursewareDetailLoading     : false,  //详情加载按钮
        orgIdsOnChangeStatus : '1',
        disabled : true,
        disabled1 : true,

        //课件分组
        groupingVisible : false,
        groupList : [],                     //分组列表
        groupKey : 0,                       //选中分组key
        addStutas : false,                  //正在新增
        groupName : undefined,              //组名
        orgList : [],
        groupLoading : false,
        selectedKeys : [],                  //选中的校区列表
        changeInfo : {},                    //当前修改分组信息
        editKey : undefined,                //当前编辑index

        progress: 0,
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                if (location.pathname === '/hq_orgser_courseware') {
                    //获取课件分类左侧组织架构
                    dispatch({
                        type : 'GetLeftCoursewareList'
                    });
                    //获取课件列表数据
                    dispatch({
                        type : 'GetCoursewareList',
                        payload : {
                            pageIndex : 0,
                            pageSize : 20,
                            init : true
                        }
                    })

                    let orgList = []
                    window._init_data.orgIdList && window._init_data.orgIdList.forEach((org) => {
                        orgList.push({
                            label: org.orgName,
                            value: org.orgId
                        })
                    })
                    dispatch({
                        type: 'updateState',
                        payload: {
                            orgList
                        }
                    })

                }
            });
        },
    },

    effects: {
        //获取课件分类左侧组织架构
        *'GetLeftCoursewareList'({ payload },{ call , select , put }){
            yield put({ type : 'showLeftLoading' });
            let res = yield call(GetLeftCoursewareList,parse(payload));
            if(!!res && res.ret && res.ret.errorCode == '9000'){
                let courseware = yield select(state => state.courseware);
                let { ret } = res;
                yield put({
                    type : 'updateState',
                    payload : {
                        leftFrameworkData : ret.results,
                        leftFrameworkOpenTag : courseware.leftFrameworkInitOpenTag
                    }
                })
            }else{
                message.error('获取课件分类失败');
                yield put({
                    type : 'updateState',
                    payload : {
                        leftFrameworkData : [],
                    }
                })
            }
            yield put({ type : 'closeLeftLoading' });
        },

        //获取课件列表数据
        *'GetCoursewareList'({ payload },{ call , select , put }){
            yield put({ type : 'showRightTableLoading' });
            let courseware = yield select(state => state.courseware);
            let { nameOrder, createOrder } = payload;
            let leftFrameworkSearchContent = payload && !!payload.init ? {} : payload && payload.leftFrameworkSearchContent ? payload.leftFrameworkSearchContent : courseware.leftFrameworkSearchContent;
            let rightFastSearchContent = payload && !!payload.init ? {} : payload && payload.rightFastSearchContent ? payload.rightFastSearchContent : courseware.rightFastSearchContent;
            delete payload.leftFrameworkSearchContent;
            delete payload.rightFastSearchContent;
            let params = { ...payload , ...leftFrameworkSearchContent , ...rightFastSearchContent };
            let resInit = yield call(GetCoursewareList,parse(params));
            if(!!resInit && resInit.ret && resInit.ret.errorCode == '9000'){
                let { ret } = resInit;
                //存在删除数据情况当前页面没有数据需要跳回前一页
                if(ret.results && ret.results.length == 0 && params.pageIndex > 0){
                    params.pageIndex -= 1;
                    let resAgain = yield call(GetCoursewareList,parse(params));
                    if(!!resAgain && resAgain.ret && resAgain.ret.errorCode == '9000'){
                        let { ret } = resAgain;
                        yield put({
                            type : 'updateState',
                            payload : {
                                leftFrameworkSearchContent,         //保存左侧树状结构查询条件
                                rightFastSearchContent,             //保存快捷搜索查询条件
                                rightTablePageIndex : ret.data && ret.data.pageIndex || 0,
                                rightTablePageSize : ret.data && ret.data.pageSize || 20,
                                rightTableTotal : ret.data && ret.data.resultCount || 0,
                                rightTableData : ret.results || [],
                                rightTableSelectedRowKeys : [],     //选中项的key
                                rightTableSelectedRows : [],        //选中项的数组集合
                                useStorage : ret.useStorage || 0,  //已用空间
                                totalStorage : ret.totalStorage || 0, //总容量
                                nameOrder,
                                createOrder,
                            }
                        })
                    }else{
                        message.error(!!resAgain && resAgain.ret && resAgain.ret.errorMessage ? resAgain.ret.errorMessage : '获取课件列表失败');
                        yield put({
                            type : 'updateState',
                            payload : {
                                rightTableData : [],
                                rightTableSelectedRowKeys : [],     //选中项的key
                                rightTableSelectedRows : [],        //选中项的数组集合
                            }
                        })
                    }
                }else{
                    yield put({
                        type : 'updateState',
                        payload : {
                            leftFrameworkSearchContent,         //保存左侧树状结构查询条件
                            rightFastSearchContent,             //保存快捷搜索查询条件
                            rightTablePageIndex : ret.data && ret.data.pageIndex || 0,
                            rightTablePageSize : ret.data && ret.data.pageSize || 20,
                            rightTableTotal : ret.data && ret.data.resultCount || 0,
                            rightTableData : ret.results || [],
                            rightTableSelectedRowKeys : [],     //选中项的key
                            rightTableSelectedRows : [],        //选中项的数组集合
                            useStorage : ret.useStorage || 0,  //已用空间
                            totalStorage : ret.totalStorage || 0, //总容量
                            nameOrder,
                            createOrder,
                        }
                    })
                }
            }else{
                message.error(!!resInit && resInit.ret && resInit.ret.errorMessage ? resInit.ret.errorMessage : '获取课件列表失败');
                yield put({
                    type : 'updateState',
                    payload : {
                        rightTableData : [],
                        rightTableSelectedRowKeys : [],     //选中项的key
                        rightTableSelectedRows : [],        //选中项的数组集合
                    }
                })
            }
            yield put({ type : 'closeRightTableLoading' });
        },

        //获取课件详情(有几张图片)
        *'RightTableOpenDetail'({ payload },{ call , select , put }){
            let res = yield call(RightTableOpenDetail,parse(payload));
            if(!!res && res.ret && res.ret.errorCode == '9000'){
                let { ret } = res;
                yield put({
                    type : 'updateState',
                    payload : {
                        coursewareCheckModalImgTenantId : payload.tenantId,
                        coursewareCheckModalImgCourseId : payload.coursewareId,
                        coursewareCheckModalImgTotal : ret.total || 0,  //modal课件图片个数
                        //coursewareCheckModalImgIndex : 1,               //课件图片分页(默认是1)
                        coursewareCheckModalImgRatio : !isNaN(ret.ratio) ? parseFloat(ret.ratio) : 1,       //课件图片宽高
                        //coursewareCheckModalCurrentUrl : undefined,     //当前显示课件的图片url
                    }
                });
                //如果详情图片多余0张，则获取第一张做默认显示
                if(ret.total > 0){
                    yield put({
                        type : 'GetDetailImg',
                        payload : {
                            index : 1 ,
                            ...payload
                        }
                    })
                }
            }else{
                yield put({ type : 'resetCheckCoursewareModal' });
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '获取课件详情失败');
            }
        },

        //如果详情图片多余0张，则获取第一张做默认显示
        *'GetDetailImg'({ payload },{ call , select , put }){
            let params = { ...payload , checkStr : window.createRandom(16,10,99).join('') };
            let res = yield call(GetDetailImg,parse(params));
            if(!!res && res.ret && res.ret.errorCode == '9000'){

                let { ret } = res;
                yield put({
                    type : 'updateState',
                    payload : {
                        courseType : ret.data.type, //课件上传类型
                        courseVideoSrc : ret.data.url || '',
                        coursewareCheckModalVisible : true,             //modal是否显示
                        coursewareCheckModalImgIndex : payload.index || 1,  //课件图片分页(默认是1)
                        coursewareCheckModalCurrentUrl : `url(data:image/jpg;base64,${ret.data.arr})`,      //当前显示课件的图片url
                    }
                });
            }else{
                yield put({ type : 'resetCheckCoursewareModal' });
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '获取课件图片失败');
            }
        },

        //发布课件提交
        *'ReleaseCoursewareModalSubmit'({ payload },{ call , select , put }){
            yield put({ type : 'updateState' , payload : { releaseCoursewareModalLoading : true } })
            let res = yield call(ReleaseCoursewareModalSubmit,parse(payload));
            if(!!res && res.ret && res.ret.errorCode == '9000'){
                message.success('发布课件成功');
                let { ret } = res;
                yield put({
                    type : 'updateState',
                    payload : {
                        releaseCoursewareModalVisible : false,
                        selectCampus : [],
                        departmentIds : [],
                        orgIdsOnChangeStatus : '1',
                        TypeStatus : '0',
                    }
                });
                let courseware = yield select(state => state.courseware);
                let pageIndex = courseware.rightTablePageIndex;
                let pageSize = courseware.rightTablePageSize;
                let leftFrameworkSearchContent = courseware.leftFrameworkSearchContent;
                let rightFastSearchContent = courseware.rightFastSearchContent;
                yield put({
                    type : 'GetCoursewareList',
                    payload : {
                        pageIndex , pageSize , leftFrameworkSearchContent , rightFastSearchContent
                    }
                })
            }else{
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '发布课件失败');
            }
            yield put({ type : 'updateState' , payload : { releaseCoursewareModalLoading : false } })
        },

        //删除课件(由于table的rowKey就是coursewareId，所以直接取rightTableSelectedRowKeys处理即可)
        *'CoursewareDelete'({ payload },{ call , select , put }){
            yield put({ type : 'showRightTableLoading' });
            let res = yield call(CoursewareDelete,parse(payload));
            if(!!res && res.ret && res.ret.errorCode == '9000'){
                message.success('删除课件成功');
                let { ret } = res;
                let courseware = yield select(state => state.courseware);
                let pageIndex = courseware.rightTablePageIndex;
                let pageSize = courseware.rightTablePageSize;
                let leftFrameworkSearchContent = courseware.leftFrameworkSearchContent;
                let rightFastSearchContent = courseware.rightFastSearchContent;
                yield put({
                    type : 'GetCoursewareList',
                    payload : {
                        pageIndex , pageSize , leftFrameworkSearchContent , rightFastSearchContent
                    }
                })
            }else{
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '删除课件失败');
            }
            yield put({ type : 'closeRightTableLoading' });
        },
        //课件详情
        *'CoursewareDetailInfo'({ payload },{ call , select , put }){
            yield put({ type : 'updateState' , payload : { releaseCoursewareModalLoading : true } })
            let res = yield call(CoursewareDetailInfo,parse(payload));
            if(!!res && res.ret && res.ret.errorCode == '9000'){
                let { ret } = res;
                if(ret.allVisible == '3'){
                    let deptids = (ret.deptIds).split(',');
                    let deptIdsarr = [];
                    deptids.map((item,index)=>{
                        if(item.length>0){
                            deptIdsarr.push(item)
                        }
                    })
                    yield put({
                        type : 'updateState',
                        payload : {
                            selectCampus : [],
                            departmentIds : deptIdsarr,
                        }
                    })
                }else{
                    let orgIds = (ret.orgIds).split(',');
                    let orgIdsarr = [];
                    orgIds.map((item,index)=>{
                        if(item.length>0){
                            orgIdsarr.push(item)
                        }
                    })
                    yield put({
                        type : 'updateState',
                        payload : {
                            selectCampus : orgIdsarr,
                        }
                    })
                }


                yield put({
                    type : 'updateState',
                    payload : {
                        CoursewareDetailInfo : ret,
//                        selectCampus : orgIdsarr,
                        releaseCoursewareDetailLoading : false,
                        TypeStatus : ret.timeOut=='-1'? '0':'1',
                        orgIdsOnChangeStatus : ret.allVisible+'',
                    }
                });
            }else{
                yield put({
                    type : 'updateState',
                    payload : {
                        releaseCoursewareDetailLoading : false,
                    }
                });
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '获取课件详情失败');
            }
            yield put({ type : 'updateState' , payload : { releaseCoursewareModalLoading : false } })
        },
        //课件编辑提交
        *'CoursewareUpdate'({ payload },{ call , select , put }){
            let res = yield call(CoursewareUpdate,parse(payload));
            let courseware = yield select(state => state.courseware);
            if(!!res && res.ret && res.ret.errorCode == '9000'){
                message.success('课件编辑成功');
                yield put({
                    type : 'updateState',
                    payload : {
                        releaseCoursewareModalVisible : false ,
                        uploadFileName : undefined ,
                        CoursewareDetailInfo: {} ,
                        selectCampus : [],
                        departmentIds : [],
                        orgIdsOnChangeStatus : '1',
                        rightTableSelectedRowKeys : [],
                        rightTableSelectedRows : [],
                        TypeStatus : '0'
                    }
                });
                let pageIndex = courseware.rightTablePageIndex;
                let pageSize = courseware.rightTablePageSize;
                let leftFrameworkSearchContent = courseware.leftFrameworkSearchContent;
                let rightFastSearchContent = courseware.rightFastSearchContent;
                yield put({
                    type : 'GetCoursewareList',
                    payload : {
                        pageIndex , pageSize , leftFrameworkSearchContent , rightFastSearchContent
                    }
                })
            }else{

                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '编辑课件失败');
            }
        },

        //获取课件分组列表
        *'getGroupList'({ payload },{ call , select , put }){
            yield put({type: 'updateState', payload: {groupLoading: true}})
            let state = yield select(state => state.courseware)
            let res = yield call(getGroupList);
            if(!!res && res.ret && res.ret.errorCode == '9000'){
                //转为string
                res.ret.data.length > 0 && res.ret.data.forEach((group, key) => {
                    group.orgIds.forEach((item, index) => {
                        res.ret.data[key].orgIds[index] = item + ''
                    })
                })

                yield put({
                    type : 'updateState',
                    payload : {
                        groupList: res.ret.data,
                        selectedKeys: res.ret.data.length > 0 ? res.ret.data[0].orgIds : []
                    }
                })
                //复制后选中复制对象
                if(!!payload && !!payload.isCopy){
                    yield put({
                        type : 'updateState',
                        payload : {
                            groupKey: res.ret.data.length - 1,
                            selectedKeys: res.ret.data.length > 0 ? res.ret.data[res.ret.data.length - 1].orgIds : []
                        }
                    })
                }
                //删除后选中第一个
                if(!!payload && !!payload.goFirst){
                    yield put({
                        type : 'updateState',
                        payload : {
                            groupKey: 0,
                            selectedKeys: res.ret.data.length > 0 ? res.ret.data[0].orgIds : []
                        }
                    })
                }
                //保存后选中当前
                if(!!payload && !!payload.isSave){
                    yield put({
                        type : 'updateState',
                        payload : {
                            groupKey: state.groupKey,
                            selectedKeys: res.ret.data.length > 0 ? res.ret.data[state.groupKey].orgIds : []
                        }
                    })
                }
            }else{
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '课件分组获取失败');
            }
            yield put({type: 'updateState', payload: {groupLoading: false}})
        },

        //修改分组名
        *'changeGroupName'({ payload },{ call , select , put }){
            yield put({type: 'updateState', payload: {groupLoading: true}})
            let state = yield select(state => state.courseware)
            let { id, status } = payload
            let text = '新增'
            if(!!id && status === 0){
                text = '删除'
            }else if(!!id){
                text = '编辑'
            }
            let {ret} = yield call(changeGroupName,parse(payload));
            if(ret && ret.errorCode == '9000'){
                message.success(`${text}成功`)
                if(!!state.editKey || state.editKey === 0){
                    yield put({
                        type : 'updateState',
                        payload : {
                            editKey: undefined,
                            groupName: undefined,
                        }
                    })
                    yield put({
                        type : 'getGroupList'
                    })
                }else{
                    yield put({
                        type : 'updateState',
                        payload : {
                            addStutas: false,
                            groupName: undefined,
                        }
                    })
                    yield put({
                        type : 'getGroupList',
                        payload: {
                            goFirst: true
                        }
                    })
                }
            }else{
                message.error(ret && ret.errorMessage ? ret.errorMessage : `${text}失败`);
            }
            yield put({type: 'updateState', payload: {groupLoading: false}})
        },

        //复制分组
        *'copyGroup'({ payload },{ call , select , put }){
            yield put({type: 'updateState', payload: {groupLoading: true}})
            let res = yield call(copyGroup, parse(payload));
            if(!!res && res.ret && res.ret.errorCode == '9000'){
                message.success('复制成功')
                yield put({
                    type : 'getGroupList',
                    payload: {
                        isCopy: true
                    }
                })
            }else{
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '复制失败');
            }
            yield put({type: 'updateState', payload: {groupLoading: false}})
        },

        //保存分组
        *'saveGroup'({ payload },{ call , select , put }){
            yield put({type: 'updateState', payload: {groupLoading: true}})
            let res = yield call(saveGroupInfo, parse(payload));
            if(!!res && res.ret && res.ret.errorCode == '9000'){
                message.success('保存分组成功')
                yield put({
                    type : 'getGroupList',
                    payload: {
                        isSave: true
                    }
                })
            }else{
                message.error(!!res && res.ret && res.ret.errorMessage ? res.ret.errorMessage : '保存分组失败');
            }
            yield put({type: 'updateState', payload: {groupLoading: false}})
        },

    },


    reducers: {
        updateState(state, action) {
            return { ...state , ...action.payload };
        },
        showLeftLoading(state, action){
            return { ...state , leftFrameworkLoading : true }
        },
        closeLeftLoading(state, action){
            return { ...state , leftFrameworkLoading : false }
        },
        showRightTableLoading(state, action){
            return { ...state , rightTableLoading : true }
        },
        closeRightTableLoading(state, action){
            return { ...state , rightTableLoading : false }
        },
        resetCheckCoursewareModal(state, action){
            let obj = {
                coursewareCheckModalVisible : false,            //modal是否显示
                coursewareCheckModalImgTotal : 0,               //modal课件图片个数
                coursewareCheckModalImgIndex : 1,               //课件图片分页(默认是1)
                coursewareCheckModalImgSize : {},               //课件图片宽高
                coursewareCheckModalCurrentUrl : undefined,     //当前显示课件的图片url
            }
            return { ...state , ...obj }
        },
    },
};
