import React, { PropTypes } from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import ClassPackageCreateForm from '../../../components/scrm/class-package/ClassPackageCreateForm';
import ClassPackageComponent from '../../../components/common/new-component/manager-list/ManagerList';
import { StatusFlag } from '../../../components/common/new-component/NewComponent';
import TreeOrgCheckSelect from '../../../components/common/new-component/tree-org-check-select/TreeOrgCheckSelect';
import { Popover } from 'antd';

function ClassPackagePage({ dispatch, classPackageModel }){
    let {
        searchVisible,

        selectedRowKeys,
        selectedRows,
        selectedRecordIds,

        dataSource,
        loading,
        resultCount,
        pageSize,
        pageIndex,

        signleClassPackageInfo,
        orgIdList,
        createClassPackageVisible,
        classHourInfo,
        courseOptList,

        selectedCourseIds,

        classPackageId,
        createOrgId,

		newColumns,

		orgKind,

		classPackageBtnLoading,

        //选择校区
        selectCampus,                         //已选的校区
        selectCampusModalVisible,             //校区选择框是否显示
        checkOrgsModalVisible,
        checkOrgsModalData,
        cType,

    } = classPackageModel;

    dataSource && dataSource.map(function(item,index){
        item.key = index;
    })

    //筛选是否可见
    function filterFunction(){
        dispatch({
            type : 'classPackageModel/updateState',
            payload : {
                searchVisible : !searchVisible
            }
        })
    };

    //搜索
    function searchFunction( values ){
        dispatch({
            type : 'classPackageModel/searchFunction',
            payload : {
                values,
            }
        })
    };
    //清除条件
    function clearFunction(){
        dispatch({
            type : 'classPackageModel/clearFunction',
            payload : {
                name   : undefined,
                status : undefined,
                orgId  : undefined,
            }
        })
    };

    //选择表格项
    function rowSelectChange( selectedRowKeys, selectedRows ){
        dispatch({
            type : 'classPackageModel/updateState',
            payload : {
                selectedRowKeys,
                selectedRows
            }
        })
    };

    //删除产品
    function deleteClassPackage(){
        let selectedRecordIds = [];
        selectedRows.map(function(item,index){
            selectedRecordIds.push( item.id );
        })
        dispatch({
            type : 'classPackageModel/deleteClassPackage',
            payload : {
                selectedRecordIds
            }
        })
    };

    //点击新增产品
    function createClassPackage(){

        let org;
        /*取到第一个校区(默认校区)ID*/
        if(window._init_data.firstOrg != undefined){
            org = window._init_data.firstOrg;                //获取选择校区下的第一间校区
            dispatch({
                type:'classPackageModel/updateState',
                payload:{
                    createOrgId : org.key,

                }
            });
//            dispatch({
//                type : 'classPackageModel/selectOrgId',
//                payload : {
//                    orgId:org.key,
//                }
//            });
        }

        dispatch({
            type : 'classPackageModel/updateState',
            payload : {
                createClassPackageVisible : !createClassPackageVisible
            }
        })
    };
    //确认新增
    function confirmAddClassPackage( values ){
        dispatch({
            type : 'classPackageModel/confirmAddClassPackage',
            payload : {
                values,
                createClassPackageVisible
            }
        })
    };
    //取消新增
    function cancelAddClassPackage(){
        dispatch({
            type : 'classPackageModel/updateState',
            payload : {
                createClassPackageVisible : !createClassPackageVisible,
                classHourInfo             : '[{}]',
                signleClassPackageInfo    : {},
                classPackageId            : '',
                selectCampus              : [],
                courseOptList             : [],
            }
        })
    };

    //点击修改课时包
    function updateClassPackage( id, orgId ){
        dispatch({
            type : 'classPackageModel/updateClassPackage',
            payload : {
                id,
                orgId
            }
        })
    };
    //改变pageSize
    function pageSizeChange( pageIndex, pageSize ){
        dispatch({
            type : 'classPackageModel/pagination',
            payload : {
                pageIndex,
                pageSize,
            }
        })
    };

    //改变pageIndex
    function pageIndexChange( pageIndex ){
        dispatch({
            type : 'classPackageModel/pagination',
            payload : {
                pageIndex,
                pageSize,
            }
        })
    };

    //选择校区onChange
    function TenantSelectOnSelect( orgId ){
        dispatch({
            type : 'classPackageModel/selectOrgId',
            payload : {
                orgId
            }
        })
    };


     /*打开选择管辖校区modal*/
    function OpenCloseChooseMgrOrgModal(){
        dispatch({
            type:'classPackageModel/updateState',
            payload:{
                selectCampusModalVisible : !selectCampusModalVisible,
            }
        });
    }

    /*添加校区选择完毕点击保存*/
    function AfterSelectCampusModalSubmit(array){
        if(selectCampus === null || array.toString() != selectCampus.toString()){
            dispatch({
                type:'classPackageModel/updateState',
                payload:{
                    cType : '1',
                    classHourInfo  : '[{}]',
                    courseOptList : [],
                }
            });

        }
        dispatch({
            type:'classPackageModel/updateState',
            payload:{
                selectCampus : array,
            }
        });
        dispatch({
            type : 'classPackageModel/selectOrgId',
            payload : {
                orgIds:array.join(','),
            }
        });
    }

    function changeCtype(e){
        dispatch({
            type:'classPackageModel/updateState',
            payload:{
                cType : e.target.value,
            }
        });
    }

    let classPackageCreateFormProps = {
        createClassPackageVisible,
        signleClassPackageInfo,
        orgIdList,

        classHourInfo,
        courseOptList,

        selectedCourseIds,
        cancelAddClassPackage,
        confirmAddClassPackage,

        TenantSelectOnSelect,

        classPackageId,
        createOrgId,

		orgKind,

		classPackageBtnLoading,

        //选择校区
        OpenCloseChooseMgrOrgModal,
        AfterSelectCampusModalSubmit,
        selectCampusModalVisible,
        selectCampus,
        changeCtype,
        cType,
    }

	function superSearch(){
	}

	function changeColumns( newColumns ){
		dispatch({
			type : 'classPackageModel/updateState',
			payload : {
				newColumns,
			}
		})
	}

    function ClassPackageCheckOrgs(data){
        dispatch({
            type : 'classPackageModel/updateState',
            payload : {
                checkOrgsModalVisible : true,
                checkOrgsModalData : data
            }
        })
    }

    function CheckOrgsModalCancel(){
        dispatch({
            type : 'classPackageModel/updateState',
            payload : {
                checkOrgsModalVisible : false,
            }
        })
    }

	let ClassPackageComponentProps = {
		search : {
            onSearch      : searchFunction,
            onClear       : clearFunction,
            fields : [
				{
					key         : 'orgId',
					type        : 'orgSelect',
					placeholder : '所属校区',
					options : {
						width : 300,
					},
				},{
					key         : 'name',
					type        : 'input',
					placeholder : '名称',
				},{
					key         : 'status',
					type        : 'select',
					placeholder : '状态',
					options     : [
						{ 'key' : '1', 'label' : '上架' },
						{ 'key' : '2', 'label' : '下架' }
					],
				},
            ]
        },
        leftBars : {
            label : '已选',
			labelNum : selectedRows.length,
            btns : [
                {
                    label    : '删除',
                    handle   : deleteClassPackage,
                    confirm  : true,
                }
            ]
        },
        rightBars : {
            btns : [
                {
                    label    : '新增产品',
                    handle   : createClassPackage
                }
            ],
			isSuperSearch : false,
        },
        table : {
            loading    : loading,
            dataSource : dataSource,
			newColumns : newColumns,
			changeColumns : changeColumns,
            columns : [
                {
                    dataIndex : 'name',
                    key       : 'name',
                    title     : '名称',
					width     : 112,
                    render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							<a onClick = { () => updateClassPackage( record.id, record.orgId ) }>{ text }</a>
						</Popover>
                    )
                },{
                    dataIndex : 'cType',
                    key       : 'cType',
                    title     : '套餐内容',
                    width     : 96,
                    render    : ( text, record ) => (
                        <span>
                            { text }
                        </span>
                    )
                },{
                    dataIndex : 'status',
                    key       : 'status',
                    title     : '产品状态',
                    width     : 96,
                    render    : ( text, record ) => (
						<StatusFlag type = { text == '2' ? 'gray' : ''}>{ text == '1' ? '已上架' : text == '2' ? '已下架' : '删除' }</StatusFlag>
                    )
                },{
                    dataIndex : 'price',
                    key       : 'price',
                    title     : '原价',
                    width     : 96,
                },{
                    dataIndex : 'realPrice',
                    key       : 'realPrice',
                    title     : '售卖价',
                    width     : 96,
                },{
                    dataIndex : 'saleNum',
                    key       : 'saleNum',
                    title     : '销量',
					width     : 68,
                },{
                    dataIndex : 'createTime',
                    key       : 'createTime',
                    title     : '创建日期',
					width     : 160,
                },{
                    dataIndex : 'orgIds',
                    key       : 'orgIds',
                    title     : '所属校区',
					render    : ( text, record ) => (
                        <span>
                            { !!text ? <a onClick={() => ClassPackageCheckOrgs(!!text ? text.split(',') : [])}>{ !!text ? text.split(',').length + '家' : '无' }</a> : '无' }
                        </span>
					)
                }
            ],
            rowSelection : {
                selectedRowKeys : selectedRowKeys,
                onChange        : rowSelectChange,
            },
         },
		pagination : {
			total            : resultCount,
			pageIndex        : pageIndex,
			pageSize         : pageSize,
			showTotal        : total => `总共 ${total} 条`,
			showSizeChanger  : true,
			showQuickJumper  : true,
			onShowSizeChange : pageSizeChange,
			onChange         : pageIndexChange

		}
	}
    //校区选择框属性
    let TreeOrgCheckSelectProps = {
        headOrg : false,
        visible : checkOrgsModalVisible,
        onClose : CheckOrgsModalCancel,
        disabled : true,
        init_org_select: checkOrgsModalData,
    };

    return (
        <div style = {{ height : '100%', overflowX : 'hidden' }}>
            <ClassPackageCreateForm { ...classPackageCreateFormProps } />
			<ClassPackageComponent { ...ClassPackageComponentProps } />
            <TreeOrgCheckSelect { ...TreeOrgCheckSelectProps } />
        </div>
    )
};

function mapStateToProps ({ classPackageModel }){
	return { classPackageModel };
};

export default connect( mapStateToProps )( ClassPackagePage );
