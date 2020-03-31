import React from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import QueueAnim from 'rc-queue-anim';
import Media from 'react-media';
import styles from './Courseware.less';
import LeftFramework from '../../../components/campus-service/courseware/courseware-left-framework/CoursewareLeftFramework';
import RightTable from '../../../components/campus-service/courseware/courseware-right-table/CoursewareRightTable';
import ReleaseCoursewareModal from '../../../components/campus-service/courseware/release-courseware-modal/ReleaseCoursewareModal';
import CoursewareCheckModal from '../../../components/campus-service/courseware/courseware-check-modal/CoursewareCheckModal';
import CoursewareRightTableSearch from '../../../components/campus-service/courseware/courseware-right-table/CoursewareRightTableSearch';
import EnlargeSpaceModal from '../../../components/campus-service/courseware/courseware-right-table/EnlargeSpaceModal';
import TenantOrgSelect from '../../common/tenant-org-select/TenantOrgSelect';            //引进校区公共组件
import CourseGroup from '../../../components/campus-service/courseware/courseware-right-table/CourseGroup';
/*教学课件*/
function Courseware({ dispatch, courseware ,mainLayoutModel }) {

    let {
        /*左侧组织架构*/
        leftFrameworkData,                      //组织架构数据
        leftFrameworkLoading,                   //加载状态
        leftFrameworkOpenTag,                   //打开的节点，默认打开架构二级菜单数组['a','b']
        leftFrameworkInitOpenTag,               //默认打开的节点
        leftFrameworkSearchContent,             //左边搜索数据

        /*右侧列表*/
        /*搜索内容*/
        rightFastSearchContent,                 //快捷搜索内容
        nameOrder,
        createOrder,

        /*列表内容*/
        rightTablePageIndex,                    //页码
        rightTablePageSize,                     //每页条数
        rightTableLoading,                      //表格加载状态
        rightTableTotal,                        //表格数据总数
        rightTableData,                         //表格数据所有内容
        rightTableSelectedRowKeys,              //选中项的key
        rightTableSelectedRows,                 //选中项的数组集合

        /*发布课件modal*/
        releaseCoursewareModalVisible,              //modal是否显示
        releaseCoursewareModalLoading,              //表单加载状态
        releaseCoursewareModalButtonLoading,        //提交按钮加载状态

        /*课件查看modal*/
        coursewareCheckModalVisible,                //modal是否显示
        coursewareCheckModalImgTenantId,            //租户id
        coursewareCheckModalImgCourseId,            //课件id
        coursewareCheckModalImgTotal,               //modal课件图片个数
        coursewareCheckModalImgIndex,               //课件图片分页(默认是1)
        coursewareCheckModalImgRatio,               //课件图片宽高
        coursewareCheckModalCurrentUrl,             //当前显示课件的图片url
        show_standard_length,                       //具体显示的标准长度

        TypeStatus,

        //扩容弹窗
        enlargeSpaceVisible,
        useStorage ,  //已用空间
        totalStorage , //总容量

        courseType,    //课件上传类型
        courseVideoSrc , //课件地址

        /*新增编辑员工时校区选择modal*/
        selectCampusModalVisible ,             //选择校区modal是否显示
        selectCampus,                          //默认添加的校区选项

        departmentModalVisible,
        departmentIds,
        allVisible,

        //查看所选校区
        selectedOrgModalVisible ,
        selectedOrgIds,
        modifyCourse ,

        //详情
        releaseCoursewareDetailLoading ,
        CoursewareDetailInfo,
        orgIdsOnChangeStatus,

        disabled,
        disabled1,

        //课件分组
        groupingVisible,
        groupList,
        groupKey,
        addStutas,                  //正在新增
        orgList,                    //机构列表
        groupLoading,
        selectedKeys,
        groupName,                  //组名
        changeInfo,                 //当前修改分组信息
        editKey,                    //当前编辑index

        progress,
	} = courseware

    //屏蔽右键和F12
    if(!!coursewareCheckModalVisible){
        document.oncontextmenu = function (event){
            if(window.event){
                event = window.event;
            }
            try{
                let the = event.srcElement;
                if (!((the.tagName == "INPUT" && the.type.toLowerCase() == "text") || the.tagName == "TEXTAREA")){
                    return false;
                }
                return true;
            }catch (e){
                return false;
            }
        }
        document.onkeydown = document.onkeyup = document.onkeypress = function(){
            if(window.event.keyCode == 123) {
                window.event.returnValue = false;
                return false;
            }
        }
    }

    //封装dispatch
    function dp(path,obj){ dispatch({ type : path , payload : obj }) };

    //树状结构节点展开事件
    function LeftFrameworkOnExpend(expandedKeys){
        dp('courseware/updateState' , { leftFrameworkOpenTag : expandedKeys })
    }

    //点击树节点名称事件
    function LeftFrameworkClickTreeName(id,e){
        let obj = {};
        //选中状态传相应参数，取消选中状态传空对象
        if(!!e.selected){
            obj = { cat : id[0] != leftFrameworkInitOpenTag[0] ? id[0] : undefined };     //点击最外层节点不传值
        }
        dp('courseware/GetCoursewareList',{
            pageIndex : 0,
            pageSize : rightTablePageSize,
            leftFrameworkSearchContent : obj,
            rightFastSearchContent
        })
    }

    //点击搜索
    function RightOnSearch(data){
        if(!!data && !!data.dept_org){
            data.orgId = data.dept_org.substr(data.dept_org.indexOf('-') + 1);
            delete data.dept_org;
        }
        dp('courseware/GetCoursewareList',{
            pageIndex : 0,
            pageSize : rightTablePageSize,
            leftFrameworkSearchContent,
            rightFastSearchContent : data,
            nameOrder,
            createOrder
        })
    }
    //清除
    function onClear(){
        dp('courseware/GetCoursewareList',{
            pageIndex : 0,
            pageSize : '20',
            leftFrameworkSearchContent,
            rightFastSearchContent : {},
            nameOrder,
            createOrder
        })
        dp('courseware/updateState' , { rightFastSearchContent : {} })
        dp('mainLayoutModel/initOrgPermissionList' , {})
    }
    //查看课件详情
    function RightTableOpenDetail(data){ dp('courseware/RightTableOpenDetail',{ coursewareId : data.coursewareId , tenantId : data.tenantId }) }

    //课件分页改变
    function CoursewareCheckModalChangePage(type,index){
        let obj = {
            coursewareId : coursewareCheckModalImgCourseId,
            tenantId : coursewareCheckModalImgTenantId,
        }
        if(type == 'free'){
            if((index + '').indexOf('.') > -1){
                dp('courseware/updateState' , { coursewareCheckModalImgIndex }) ;
                return message.warn('页码不可以为小数');
            }else if(index < 1){
                dp('courseware/GetDetailImg' , { index : 1 , ...obj }) ;
            }else if(index > coursewareCheckModalImgTotal){
                dp('courseware/GetDetailImg' , { index : coursewareCheckModalImgTotal , ...obj }) ;
            }else{
                dp('courseware/GetDetailImg' , { index , ...obj }) ;
            }
        }else if(type == '+'){
            if(coursewareCheckModalImgIndex == coursewareCheckModalImgTotal){
                return message.info('已经是最后一页')
            }
            dp('courseware/GetDetailImg' , { index : coursewareCheckModalImgIndex + 1 , ...obj }) ;
        }else if(type == '-'){
            if(coursewareCheckModalImgIndex == 1){
                return message.info('已经是第一页')
            }
            dp('courseware/GetDetailImg' , { index : coursewareCheckModalImgIndex - 1 , ...obj }) ;
        }
    }

    //关闭查看课件modal
    function CoursewareCheckModalClose(){
        dp('courseware/resetCheckCoursewareModal')
    }

    //分页onChange事件
    function RightTablePageOnChange(pageIndex,pageSize){
        dp('courseware/GetCoursewareList',{
            pageIndex : pageIndex - 1,
            pageSize,
            leftFrameworkSearchContent,
            rightFastSearchContent,
            nameOrder,
            createOrder
        })
    }

    //多选框选中的onChange方法
    function RightTableSelectOnChange(selectedRowKeys, selectedRows){
        dp('courseware/updateState',{ rightTableSelectedRowKeys : selectedRowKeys , rightTableSelectedRows : selectedRows })
    }

    //点击发布课件
    function RightTableReleaseCourseware(){ dp('courseware/updateState',{ releaseCoursewareModalVisible : true, disabled1: true, disabled: true }) }

    //发布课件提交
    function ReleaseCoursewareModalSubmit(data){ dp('courseware/ReleaseCoursewareModalSubmit',data) }

    //关闭发布课件modal
    function ReleaseCoursewareModalClose(){
        dp('courseware/updateState',{
            releaseCoursewareModalVisible : false ,
            uploadFileName : undefined ,
            CoursewareDetailInfo: {} ,
            selectCampus : [],
            departmentIds : [],
            orgIdsOnChangeStatus : '1',
            TypeStatus : '0'
        })
    }

    //删除课件(由于table的rowKey就是coursewareId，所以直接取rightTableSelectedRowKeys处理即可)
    function RightTableOnDelete(){
        if(rightTableSelectedRows.length==0){
            message.warning('请先选择课件再删除')
        }else{
            let coursewareIds = [];
            rightTableSelectedRows.map((item,index)=>{
                coursewareIds.push(item.coursewareId)
            })
            dp('courseware/CoursewareDelete',{ ids : coursewareIds.join(',') })
        }

    }

    function changeClassType(e){
       dp('courseware/updateState',{
           TypeStatus :e.target.value
       })
    }
    //扩容提示框
    function expandSpace(){
        dp('courseware/updateState',{
           enlargeSpaceVisible :true
        })
    }
    //关闭扩容弹窗
    function cancelEnlargeSpace(){
        dp('courseware/updateState',{
           enlargeSpaceVisible : false
       })
    }
    //课件视频关闭
    function coursewareCheckModalCancel(){
        dp('courseware/updateState',{
           coursewareCheckModalVisible : false
       })
    }

    /*打开选择管辖校区modal*/
    function OpenCloseChooseMgrOrgModal(){
        dispatch({
            type:'courseware/updateState',
            payload:{
                selectCampusModalVisible : !selectCampusModalVisible,
            }
        });
    }
    /*添加校区选择完毕点击保存*/
    function AfterSelectCampusModalSubmit(array){
        dispatch({
            type:'courseware/updateState',
            payload:{
                selectCampus : array,
            }
        });
    }

    //查看已选校区
    function openOrg(text,allVisible){
        dispatch({
            type : 'courseware/updateState',
            payload : {
                selectedOrgIds          : text.split(','),
                selectedOrgModalVisible : true,
                modifyCourse            : true,
                allVisible : allVisible,
            }
        })
    }
    //关闭校区查看框
    function selectedOrgModalClose(){
        dispatch({
            type : 'courseware/updateState',
            payload : {
                selectedOrgModalVisible : false,
                selectedOrgIds          : [],
            }
        })
    };
    //编辑课件
    function RightTableOnEdit(){
        if(rightTableSelectedRows.length==1){
            dispatch({
                type : 'courseware/updateState',
                payload : {
                    releaseCoursewareModalVisible : true,
                    releaseCoursewareDetailLoading : true,
                }
            })
            dispatch({
                type : 'courseware/CoursewareDetailInfo',
                payload : {
                    id : rightTableSelectedRows[0].coursewareId,
                }
            })
        }else{
            message.warning('只能选择单条数据进行编辑')
        }

    }
    //校区全部与部分的选择
    function orgIdsOnChange(e){
        if(e.target.value == '2'){
            dispatch({
                type : 'courseware/updateState',
                payload : {
                    disabled : false,
                    disabled1 : true
                }
            })

        }else if(e.target.value == '3'){
            dispatch({
                type : 'courseware/updateState',
                payload : {
                    disabled1 : false,
                    disabled : true,
                }
            })
        }else if(e.target.value == '1'){
            dispatch({
                type : 'courseware/updateState',
                payload : {
                    disabled1 : true,
                    disabled : true,
                }
            })
        }
        dispatch({
            type : 'courseware/updateState',
            payload : {
                orgIdsOnChangeStatus : e.target.value,
                selectCampus : [],
                departmentIds : [],
            }
        })
    }
    //课件编辑提交
    function ReleaseCoursewareModalEdit(value){
        dispatch({
            type : 'courseware/CoursewareUpdate',
            payload : {
                ...value
            }
        })
    }

    function OpendepartmentModal(){
        dispatch({
            type:'courseware/updateState',
            payload:{
                departmentModalVisible : !departmentModalVisible,
            }
        });
    }

    function AfterDepartmentModalSubmit(array){
        dispatch({
            type:'courseware/updateState',
            payload:{
                departmentIds : array,
            }
        });
    }

    //课件分组
    function courseGroup(){
        dispatch({
            type : 'courseware/updateState',
            payload : {
                groupingVisible: true,
                addStutas: false,
                editKey: undefined,
                groupName: undefined
            }
        })
        //获取分组列表
        dispatch({
            type: 'courseware/getGroupList'
        })
    }

    //关闭课件分组
    function cancelGroup(){
        dispatch({
            type : 'courseware/updateState',
            payload : {
                groupingVisible: false,
                changeType: 'add'
            }
        })
    }

    //新增分组
    function addGroup(changeInfo){
        if(!!changeInfo && (!!changeInfo.index || changeInfo.index === 0)){
            dispatch({
                type: 'courseware/updateState',
                payload: {
                    editKey: changeInfo.index,
                    groupName: changeInfo.name,
                    changeInfo
                }
            })
        }else{
            dispatch({
                type: 'courseware/updateState',
                payload: {
                    addStutas: true,
                    changeInfo: {}
                }
            })
        }
    }

    //分组名change
    function groupNameChange(e){
        dispatch({
            type : 'courseware/updateState',
            payload : {
                groupName: e.target.value
            }
        })
    }

    //取消姓名改变
    function cancelName(){
        if(!!editKey || editKey === 0){
            dispatch({
                type : 'courseware/updateState',
                payload : {
                    groupName: undefined,
                    editKey: undefined
                }
            })
        }else{
            dispatch({
                type : 'courseware/updateState',
                payload : {
                    groupName: undefined,
                    addStutas: false
                }
            })
        }
    }

    //确定分组名
    function saveName(){
        let payload = {}
        if(!!changeInfo.id){
            payload = { name: groupName, id: changeInfo.id }
        }else{
            payload = { name: groupName }
        }

        dispatch({
            type : 'courseware/changeGroupName',
            payload
        })
    }

    //删除分组
    function delGroup(id, name){
        dispatch({
            type : 'courseware/updateState',
            payload : {
                groupName: undefined,
                editKey: undefined,
                addStutas: false
            }
        })
        dispatch({
            type : 'courseware/changeGroupName',
            payload: {
                id,
                name,
                status: 0
            }
        })
    }

    //复制分组
    function copyGroup(id, e){
        if(e.preventDefault){
            e.preventDefault();
        }else{
            window.event.returnValue == false;
        }
        dispatch({
            type : 'courseware/updateState',
            payload : {
                groupName: undefined,
                editKey: undefined,
                addStutas: false
            }
        })
        dispatch({
            type : 'courseware/copyGroup',
            payload : {
                id
            }
        })
    }

    //选中分组
    function changeKey(key){
        dispatch({
            type : 'courseware/updateState',
            payload : {
                groupKey: key,
                selectedKeys: groupList[key].orgIds
            }
        })
    }

    //校区选择
    function groupSelect(type, keys, info){
        if(type == 'select'){
            //do nothing
        }else{
            dispatch({
                type : 'courseware/updateState',
                payload : {
                    selectedKeys: keys
                }
            })
        }
    }

    //保存分组
    function saveGroup(){
        let newSelect = [...selectedKeys]
        let delIndex = newSelect.indexOf('all')
        if(delIndex > -1){
            newSelect.splice(delIndex, 1)
        }

        dispatch({
            type : 'courseware/saveGroup',
            payload : {
                id: groupList[groupKey].groupId,
                orgIds: newSelect.join(',')
            }
        })
    }

    //排序
    function sorterChange(pagination, filters, sorter){
        if(!!sorter.field && sorter.field == 'name'){
            //1:倒序 2:正序
            let nameOrder = sorter.order == 'descend' ? '1' : sorter.order == 'ascend' ? '2' : undefined;
            dp('courseware/GetCoursewareList',{
                pageIndex : 0,
                pageSize : rightTablePageSize,
                leftFrameworkSearchContent,
                rightFastSearchContent,
                nameOrder
            })
        }else if(!!sorter.field && sorter.field == 'publishTime'){
            //1:倒序 2:正序
            let createOrder = sorter.order == 'descend' ? '1' : sorter.order == 'ascend' ? '2' : undefined;
            dp('courseware/GetCoursewareList',{
                pageIndex : 0,
                pageSize : rightTablePageSize,
                leftFrameworkSearchContent,
                rightFastSearchContent,
                createOrder
            })
        }else{
            dp('courseware/GetCoursewareList',{
                pageIndex : 0,
                pageSize : rightTablePageSize,
                leftFrameworkSearchContent,
                rightFastSearchContent
            })
        }
    }

    /*左侧组织架构属性*/
    let LeftFrameworkProps = {
        leftFrameworkData,                      //组织架构数据
        leftFrameworkLoading,                   //加载状态
        leftFrameworkOpenTag,                   //打开的节点，默认打开架构二级菜单数组['a','b']
        leftFrameworkInitOpenTag,               //默认打开的节点

        LeftFrameworkOnExpend,                  //树状结构节点展开事件
        LeftFrameworkClickTreeName,             //点击树节点名称事件
    }

    /*右侧列表数据*/
    let RightTableProps = {
        /*搜索内容*/
        RightOnSearch,                      //点击搜索
        nameOrder,
        createOrder,

        /*列表内容*/
        rightTablePageIndex,                //页码
        rightTablePageSize,                 //每页条数
        rightTableLoading,                  //表格加载状态
        rightTableTotal,                    //表格数据总数
        rightTableData,                     //表格数据所有内容
        rightTableSelectedRowKeys,          //选中项的key
        rightTableSelectedRows,             //选中项的数组集合

        RightTableOpenDetail,               //查看课件详情
        RightTablePageOnChange,             //分页onChange事件
        RightTableSelectOnChange,           //checkbox的onChange事件
        RightTableReleaseCourseware,        //发布课件
        RightTableOnDelete,                 //删除课件
        sorterChange,                       //排序

        openOrg,                            //打开已选校区
    }

    /*发布课件属性*/
    let ReleaseCoursewareModalProps = {
        dp,                                         //封装dispatch方法
        releaseCoursewareModalVisible,              //modal是否显示
        releaseCoursewareModalLoading,              //表单加载状态
        releaseCoursewareModalButtonLoading,        //提交按钮加载状态
        ReleaseCoursewareModalSubmit,               //发布课件提交
        ReleaseCoursewareModalClose,                //关闭发布课件modal
        changeClassType,
        TypeStatus,

        //选择校区
        OpenCloseChooseMgrOrgModal,
        AfterSelectCampusModalSubmit,
        selectCampusModalVisible,
        selectCampus,

        //选择部门
        OpendepartmentModal,
        AfterDepartmentModalSubmit,
        departmentModalVisible,
        departmentIds,

        ///详情
        releaseCoursewareDetailLoading,   //详情加载按钮
        CoursewareDetailInfo,  //详情数据
        orgIdsOnChangeStatus,  //部分或全部属性
        orgIdsOnChange,
        ReleaseCoursewareModalEdit,  //编辑

        disabled,
        disabled1,

        progress
    }

    let CoursewareCheckModalProps = {
        dp,                                         //封装dispatch方法
        coursewareCheckModalVisible,                //modal是否显示
        coursewareCheckModalImgTenantId,            //租户id
        coursewareCheckModalImgCourseId,            //课件id
        coursewareCheckModalImgTotal,               //modal课件图片个数
        coursewareCheckModalImgIndex,               //课件图片分页(默认是1)
        coursewareCheckModalImgRatio,               //课件图片宽高
        coursewareCheckModalCurrentUrl,             //当前显示课件的图片url
        show_standard_length,                       //具体显示的标准长度

        CoursewareCheckModalChangePage,             //课件分页改变
        CoursewareCheckModalClose,                  //关闭查看课件modal

        courseType,    //课件上传类型
        courseVideoSrc , //课件地址
        coursewareCheckModalCancel,
    }
    var selctarr =  [
        { 'key' : '1', 'label' : '文档' },
        { 'key' : '2', 'label' : '图片' },
        { 'key' : '3', 'label' : '视频' }
    ];

    let CoursewareRightTableSearchProps = {
        RightOnSearch,
        onClear,
        RightTableReleaseCourseware,
        rightTableSelectedRowKeys,
        RightTableOnDelete,
        RightTableOnEdit,                   //编辑课件
        expandSpace, //扩容
        useStorage ,  //已用空间
        totalStorage , //总容量
        courseGroup,		//课件分组
        search : {
            onSearch : (data) => RightOnSearch(data),
            onClear : (data) => RightOnSearch(data),
            fields : [
                { key : 'dept_org' , type : 'dept_org' },
                { key : 'name' ,type : 'input' ,placeholder : '课件名称' },
                { key : 'author' , type : 'input' , placeholder : '作者'},
                { key : 'type' ,type : 'select' ,placeholder : '类型' , options : selctarr},
            ],
        },
    }
    let EnlargeSpaceModalProps = {
        cancelEnlargeSpace,
        enlargeSpaceVisible,
    }
    //查看校区框属性
    let tenantOrgSelectProps = {
        visible         : selectedOrgModalVisible,
        onClose         : selectedOrgModalClose,
        disabled        : true,
        init_org_select : selectedOrgIds,
        no_select_campus: modifyCourse,
        type            : allVisible
    };

    let CourseGroupProps = {
        groupingVisible,            //显示
        groupList,
        groupKey,
        addStutas,                  //正在新增
        orgList,                    //机构列表
        groupLoading,
        selectedKeys,
        groupName,                  //组名
        editKey,                    //当前编辑index

        cancelGroup,                //关闭
        saveGroup,                  //确定
        groupSelect,                //校区选择
        addGroup,                   //新增分组
        groupNameChange,            //分组名change
        cancelName,                 //取消姓名改变
        saveName,                   //确定分组名
        copyGroup,                  //复制分组
        changeKey,                  //选中分组
        delGroup,                   //删除分组
    }

    return(
        <div className = { styles.all }>
            <Media query="(max-width: 1100px)">
                { matches => matches ?
                    <div className = { styles.left + ' ' + styles.left_s }>
                        <LeftFramework {...LeftFrameworkProps}/>
                    </div> :
                    <div className = { styles.left + ' ' + styles.left_l }>
                        <LeftFramework {...LeftFrameworkProps}/>
                    </div>
                }
            </Media>
            <Media query="(max-width: 1100px)">
                { matches => matches ?
                    <div className = { styles.right + ' ' + styles.right_s }>
                        <CoursewareRightTableSearch {...CoursewareRightTableSearchProps}/>
                        <RightTable {...RightTableProps}/>
                    </div> :
                    <div className = { styles.right + ' ' + styles.right_l }>
                        <CoursewareRightTableSearch {...CoursewareRightTableSearchProps}/>
                        <RightTable {...RightTableProps}/>
                    </div>
                }
            </Media>
            { !!releaseCoursewareModalVisible ? <ReleaseCoursewareModal {...ReleaseCoursewareModalProps}/> : null }
            { !!coursewareCheckModalVisible ? <CoursewareCheckModal {...CoursewareCheckModalProps}/> : null }
            { !!enlargeSpaceVisible ? <EnlargeSpaceModal { ...EnlargeSpaceModalProps }/> : null }
            { !!groupingVisible ? <CourseGroup {...CourseGroupProps} /> : null }
            <TenantOrgSelect { ...tenantOrgSelectProps } />
        </div>
    );
}

function mapStateToProps({ courseware , mainLayoutModel }) {
  return { courseware ,mainLayoutModel };
}

export default connect(mapStateToProps)(Courseware);
