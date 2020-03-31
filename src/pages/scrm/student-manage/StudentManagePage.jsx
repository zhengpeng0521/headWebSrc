import React, { PropTypes } from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {Icon} from 'antd';
import StudentManageComponent from '../../../components/common/manager-list/ManagerListMgr';
import StudentManageCreateForm from '../../../components/scrm/student-manage/StudentManageCreateForm';
import StudentManageTranslateModal from '../../../components/scrm/student-manage/StudentManageTranslateModal';
import StudentManageCheckStudentForm from '../../../components/scrm/student-manage/StudentManageCheckStudentForm';
import SaleStatusrecordModal from '../../../components/scrm/student-manage/SaleStatusrecordModal';

function StudentManagePage ({ dispatch , location, scrmStudentManageModel, mainLayoutModel }){
	let {
        filterVisible,

        dataSource,
        loading,
        resultCount,
        selectedRowKeys,
        selectedRows,
        selectedRecordIds,

        createStudentModalVisible,
        createSellerList,
        createOrgId,
        createOrgName,


        translateModalVisible,

        pageSize,
        pageIndex,

        sellerList,
        studentTypeList,
        sourceList,
        saleStatusList,

        studentInfo,

        //学员查重
        checkStudentVisible,
        checkStudentList,
        checkName,

        menuList,
        showsaleStatusecord,
        saleStatusrecordarr,
        selectedOrgIds,
        saleStatusrecordarrCount ,
        saleStatusrecordarrselctstuId ,
        condition,

        wetherClearSearchContent,

    } = scrmStudentManageModel;

    let indexx = 1;

    let saleStatusLasttime =[{key: '1',value: '今天'},
        {key: '7',value: '7天内'},
        {key: '30',value: '30天内'},
        {key: '-30',value: '30天以上'},
        ];


    if( JSON.stringify(menuList) == '{}' && indexx == '1' ){
        let allMenuList = mainLayoutModel.allMenuList;
        indexx++;
        allMenuList && allMenuList.map(function( item, index ){
            if( item.menu_key == 'crm' || item.menu_key == 'erp' ){
                let childMenuList = item.children['0'];
                childMenuList.map(function( item, index ){
                    menuList[item.menu_key] = item.menu_key
                })
            }
            dispatch({
                type : 'studentdetailModel/updateState',
                payload : {
                    menuList
                }
            })
        });
    };

    dataSource && dataSource.map(function(item, index){
        item.key = index;
    });

    //筛选框是否可见
    function filterFunction(){
        dispatch({
            type : 'scrmStudentManageModel/updateState',
            payload : {
                filterVisible : !filterVisible
            }
        })
    };

    //点击搜索
    function searchFunction( values ){

        dispatch({
            type : 'scrmStudentManageModel/onSearch',
            payload : {
                values,
            }
        })
    };

    //表格上方筛选
    function subordinateChange( ids ){
        dispatch({
            type : 'scrmStudentManageModel/subordinateChange',
            payload : {
                ids
            }
        })
    };

    //点击清除条件
    function clearFunction(){
        dispatch({
            type : 'scrmStudentManageModel/onClear',
            payload : {
                values : {
                    name       : '',
                    seller     : '',
                    intention  : '',
                    saleStatus : '',
                    orgId      : '',
                    channel    : '',
                    creator    : '',
                    mobile     : '',
                }
            }
        })
    };

    //选择表格列表项
    function rowSelectChange(selectedRowKeys, selectedRows){
        dispatch({
            type : 'scrmStudentManageModel/updateState',
            payload : {
                selectedRowKeys,
                selectedRows
            }
        })
    };

    //转移学员
    function translateStudent(){
        let selectedRecordIds = [];
        let selectedOrgIds = [];
        selectedRows.map(function(item, index){
            selectedRecordIds.push( item.id );
            selectedOrgIds.push( item.orgId );
        });
        dispatch({
            type : 'scrmStudentManageModel/translateStudent',
            payload : {
                selectedRecordIds,
                selectedOrgIds,
                translateModalVisible
            }
        })
    };
    //确认转移学员
    function confirmTranslate( values ){
        dispatch({
            type : 'scrmStudentManageModel/confirmTranslate',
            payload : {
               values
            }
        })
    };
    //取消转移学员
    function cancelTranslate(){
        dispatch({
            type : 'scrmStudentManageModel/updateState',
            payload : {
                translateModalVisible : !translateModalVisible,
                sellerList            : [],
                selectedOrgIds        : [],
                selectedOrgId         : '',
            }
        })
    };

    //批量删除学员
    function deleteStudent(){
        let selectedRecordIds = [];
        selectedRows.map(function(item, index){
            selectedRecordIds.push( item.id );
        });
        dispatch({
            type : 'scrmStudentManageModel/deleteStudent',
            payload : {
                selectedRecordIds
            }
        })
    };

    //编辑学员
    function updateStudent(){
        let selectedRecordIds = [];
        let selectedOrgIds = [];
        selectedRows.map(function(item, index){
            selectedRecordIds.push( item.id );
            selectedOrgIds.push( item.orgId );
        });
        //console.log("selectedOrgIdsselectedOrgIds",selectedOrgIds[0]);

        dispatch({
            type:'scrmStudentManageModel/updateState',
            payload:{
                selectedOrgIds : selectedOrgIds,
                createOrgId : selectedOrgIds[0],

            }
        });
        dispatch({
            type : 'scrmStudentManageModel/updateStudent',
            payload : {
                selectedRecordIds,
                selectedOrgIds,
                createStudentModalVisible
            }
        })
    };

    //导入学员
    function importStudents(){

    };

    //点击新增学员
    function createStudent(){


             let org;
             /*取到第一个校区(默认校区)ID*/
             if(window._init_data.firstOrg != undefined){
                 org = window._init_data.firstOrg;                //获取选择校区下的第一间校区

                 dispatch({
                     type : 'scrmStudentManageModel/TenantSelectOnSelect',
                     payload : {
                         value:org.key,
                     }
                 })
                 dispatch({
                     type:'scrmStudentManageModel/updateState',
                     payload:{
                         createOrgId : org.key,
                         createOrgName : org.label,
                     }
                 });
             }

        dispatch({
            type : 'scrmStudentManageModel/createStudent',
            payload : {
                createStudentModalVisible
            }
        })
    };

    //学员查重
    function checkStudentStatus( name ){



        dispatch({
            type : 'scrmStudentManageModel/checkStudentStatus',
            payload : {
                name:name,
            }
        })
    };

    //选择校区查询学员负责人下拉列表
    function TenantSelectOnSelect( value ){
        dispatch({
            type : 'scrmStudentManageModel/TenantSelectOnSelect',
            payload : {
                value
            }
        })
    };

    //确认新增学员
    function confirmCreateForm( values ){
        dispatch({
            type : 'scrmStudentManageModel/confirmCreateForm',
            payload : {
                values,
                createStudentModalVisible
            }
        })
    };

    //取消新增学员
    function cancelCreateForm(){
        dispatch({
            type : 'scrmStudentManageModel/updateState',
            payload : {
                createStudentModalVisible : !createStudentModalVisible,
                studentInfo      : {},
                createSellerList : [],
                createOrgId      : '',
                stuId            : '',
                selectedRows     : [],
                selectedRowKeys  : [],
            }
        })
    };

    //改变pageSize
    function pageSizeChange( pageIndex,pageSize ){
        dispatch({
            type : 'scrmStudentManageModel/paginationChange',
            payload : {
                pageIndex,
                pageSize,
            }
        })
    };

    //改变pageIndex
    function pageIndexChange( pageIndex ){
        dispatch({
            type : 'scrmStudentManageModel/paginationChange',
            payload : {
                pageIndex,
                pageSize
            }
        })
    };

    //点击学员进入学员详情
    function linkToStudentDetail( stuId, orgId ){
        dispatch({
            type : 'scrmStudentManageModel/linkToStudentDetail',
            payload : {
                stuId,
                orgId
            }
        })
    };

    //关闭学员查重
    function cancelCheckStudent(){
        dispatch({
            type : 'scrmStudentManageModel/updateState',
            payload : {
                checkStudentVisible : !checkStudentVisible,
                checkStudentList    : [],
            }
        })
    };

    //搜索学员
    function confirmCheckStudent( values ){
        let { name } = values;
        dispatch({
            type : 'scrmStudentManageModel/checkStudentStatus',
            payload : {
                name
            }
        })
    };
    //查看记录
    function onsaleStatusrecord(orgId,selctstuId) {
        dispatch({
            type : 'scrmStudentManageModel/onsaleStatusrecord',
            payload : {
                showsaleStatusecord,
                orgId,
                selctstuId
            }
        })

    };
    
    function Modalpageion(par) {

        dispatch({
            type : 'scrmStudentManageModel/pageindexStatusrecord',
            payload : {
                pageIndex:par.pageIndex,
                pageSize:par.pageSize,
                stuId:par.stuId,
            }
        })
    }
    
    function confirmsaleStatusrecordModal() {
        dispatch({
            type : 'scrmStudentManageModel/confirmsaleStatusrecordModal',
            payload : {
                showsaleStatusecord,

            }
        })
    };

    function  cancelsaleStatusrecordModal() {
        dispatch({
            type : 'scrmStudentManageModel/cancelsaleStatusrecordModal',
            payload : {
                showsaleStatusecord,

            }
        })
    };

    let studentManageComponentProps = {
        search : {
			searchAble    : true,
			showSearch    : filterVisible,
            filterBtnText : '筛选',
            onFilterClick : filterFunction,
			onSearch      : searchFunction,
			onClear       : clearFunction,
            wetherClear   : wetherClearSearchContent,
			fields : [
						{
							key   : 'orgId',
							type  : 'orgSelect',
							placeholder : '所属校区',
							options : {
                                width : 300,
                            },
						},{
							key   : 'name',
							type  : 'text',
							placeholder : '学员姓名',
						},{
							key   : 'intention',
							type  : 'select',
							placeholder : '学员类型',
							options : studentTypeList,
                            opt_key   : 'key',
                            opt_label : 'value',
						},{
							key   : 'saleStatus',
							type  : 'select',
							placeholder : '跟进状态',
							options : saleStatusList,
                            opt_key   : 'key',
                            opt_label : 'value',
						},{
                            key : 'channel',
                            type : 'select',
                            placeholder : '来源',
                            options : sourceList,
                            opt_key   : 'key',
                            opt_label : 'value',
                        },{
                            key : 'mobile',
                            type : 'text',
                            placeholder : '联系方式',
                        },
                {
                           key   : 'commBeforeDay',
                           type  : 'select',
                           placeholder : '最后跟进时间',
                           options : saleStatusLasttime,
                           opt_key   : 'key',
                           opt_label : 'value',
                       }

			]
		},
        leftBars: {
            label : '操作：',

            btns :
                [
                    {
                        type: 'text',
                        label: '分配',
                        disabled: selectedRowKeys.length == '0',
                        handle: translateStudent,
                    }, {
                        type: 'text',
                        label: '删除',
                        disabled: selectedRowKeys.length == '0',
                        handle: deleteStudent,
                        confirm: true,
                    }, {
                        type: 'text',
                        label: '编辑',
                        disabled: selectedRowKeys.length != 1,
                        handle: updateStudent,
                    }
                ],
            subordinate       : (condition != 'all'),
            subordinateChange : subordinateChange,
        },
        rightBars :  {
            isShowUpload : true,
            btns : [
                {
                    type : 'btn',
                    label : '新增学员',
                    icon : 'plus',
                    handle : createStudent
                }
            ]
        },
        table :{
            loading    : loading,
            dataSource : dataSource,
            columns : [
                {
                    dataIndex : 'name',
                    key       : 'name',
                    title     : '学员姓名',
                    width     : 80,
                    render    :　( text, record ) =>(
                        <a onClick = { () => linkToStudentDetail( record.id, record.orgId ) } >{ record.name }</a>
                    )
                },{
					dataIndex : 'vip',
					key       : 'vip',
					title     : '是否会员',
					width     : 80,
					render    : ( text, record ) => (
						<span>
							{ !!text && text == '0' ? '否' : text == '1' ? '是' : null }
						</span>
					)
				},{
                    dataIndex : 'balance',
                    key       : 'balance',
                    title     : '账户',
                    width     : 60,
                },{
                    dataIndex : 'period',
                    key       : 'period',
                    title     : '课时',
                    width     : 60,
                },{
                    dataIndex : 'sellerName',
                    key       : 'sellerName',
                    title     : '负责人',
                    width     : 70,
                },{
                    dataIndex : 'saleStatus',
                    key       : 'saleStatus',
                    title     : '跟进状态',
                    width     : 90,
                },
                {
                    dataIndex : 'lastCommTime',
                    key       : 'lastCommTime',
                    title     : '最后跟进时间',
                    width     : 150,
                    render: function(text, record, index) {
                        let lastCommTime = record.lastCommTime;

                        let flg = false;
                        if(lastCommTime && lastCommTime!= '') {
                            flg = true;

                        }else {
                            flg = false;
                        }
                        return (

                        <div>
                            <div> {flg?lastCommTime:'无'}</div>
                            {
                              flg?  <div> <a disabled={!flg}  onClick={()=>onsaleStatusrecord(record.orgId, record.id)}>查看记录</a></div> :""
                            }

                        </div>

                        );
                    },
                },
                {

                    dataIndex : 'intention',
                    key       : 'intention',
                    title     : '学员类型',
                    width     : 90,
                },{
                    dataIndex : 'mobile',
                    key       : 'mobile',
                    title     : '联系方式',
                    width     : 100,
                    render: function(text, record, index) {

                        return (
                            <div>
                                <div style={{display: 'inline-block'}}>{text}</div>
                            </div>
                        );
                    },
                },{
                    dataIndex : 'channel',
                    key       : 'channel',
                    title     : '来源',
                    width     : 70,
                },{
                    dataIndex : 'createTime',
                    key       : 'createTime',
                    title     : '创建时间',
                    width     : 150,
                },{
                    dataIndex : 'creatorName',
                    key       : 'creatorName',
                    title     : '创建人',
                    width     : 70,
                },{
                    dataIndex : 'orgName',
                    key       : 'orgName',
                    title     : '所属校区',
                    width     : 150,
                }
            ],
            emptyText : '暂时没有数据',
            rowSelection : {
                selectedRowKeys  : selectedRowKeys,
                onChange         : rowSelectChange,
            },

            pagination : {
                total            : resultCount,
                pageSize         : pageSize,
                pageIndex        : pageIndex,
                showSizeChanger  : true,
                showQuickJumper  : true,
                onShowSizeChange : pageSizeChange,
                onChange         : pageIndexChange
            }
         }
    };
    let studentManageCreateFormProps = {
        createStudentModalVisible,

        cancelCreateForm,
        confirmCreateForm,

        createSellerList,              //学员负责人列表
        createOrgId,
        createOrgName,
        studentTypeList,
        sourceList,
        saleStatusList,

        studentInfo,
        TenantSelectOnSelect,

        checkStudentStatus,           //学员查重


    };

    let studentManageTranslateModalProps = {
        translateModalVisible,
        confirmTranslate,
        cancelTranslate,
        selectedRows,

        sellerList,
    };

    let checkStudentModalProps = {
        checkStudentVisible,
        checkStudentList,
        checkName,

        cancelCheckStudent,
        confirmCheckStudent,
    }
    let saleStatusrecordModalProps = {
        showsaleStatusecord,
        confirmsaleStatusrecordModal,
        cancelsaleStatusrecordModal,
        saleStatusrecordarr,
        saleStatusrecordarrCount ,
        saleStatusrecordarrselctstuId ,
        Modalpageion,
        pageIndex,
    }
	return (
        <div>
            <StudentManageComponent { ...studentManageComponentProps } />
            <StudentManageCreateForm { ...studentManageCreateFormProps } />
            <StudentManageTranslateModal { ...studentManageTranslateModalProps } />
            <StudentManageCheckStudentForm { ...checkStudentModalProps } />
            <SaleStatusrecordModal { ...saleStatusrecordModalProps } />
        </div>
	)
};

function mapStateToProps ({ scrmStudentManageModel, mainLayoutModel }){
	return { scrmStudentManageModel, mainLayoutModel };
};

export default connect(mapStateToProps)(StudentManagePage);
