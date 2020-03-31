import React from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import DepositManageTable from '../../../components/crm/contract-order/deposit-manage/deposit-manage-table/DepositManageTable';
import DepositManageSuperSearch from '../../../components/crm/contract-order/deposit-manage/deposit-manage-table/DepositManageSuperSearch';
import CreateOrUpdateModal from '../../../components/crm/contract-order/deposit-manage/deposit-manage-create-or-update/CreateOrUpdateModal';

//订金管理
function DepositManage({ dispatch, depositManage }) {

	let {

        //table
        newColumns,                 //列表控制显示行
        pageIndex,                  //列表页码
        pageSize,                   //列表每页条数
        resultCount,                //列表总共有多少
        loading,                    //列表加载状态
        dataSource,                 //列表数据
        selectedRowKeys,            //复选框选中项的key
        selectedRows,               //复选框选中项数组

        //快捷搜索
        fastSearchContent,          //快捷搜索内容

        //高级搜索
        paymentMethod,              //收款方式
        superSearchVisible,         //高级搜索是否显示
        superSearchContent,         //高级搜索内容

        //新建订金
        createOrUpdateModalVisible,         //modal是否显示
        createOrUpdateModalLoading,         //modal加载状态
        createOrUpdateModalButtonLoading,   //modal按钮加载状态
        createOrUpdateModalStu,             //modal所属学员

    } = depositManage;

    function dp(path,obj){
        dispatch({
            type:path,
            payload:{
                ...obj
            }
        })
    }

    //列表控制显示行
    function ChangeColumns(newColumns){
        dp('depositManage/updateState',{
            newColumns
        });
    }

    //快捷搜索搜索或者清空
    function FastSearch(data){
        dp('depositManage/GetTableList',{
            pageIndex : 0,
            pageSize,
            fastSearchContent : data,
            superSearchContent
        });
    }

    //分页改变事件
    function pageOnChange(pageIndex,pageSize){
        dp('depositManage/GetTableList',{
            pageIndex : pageIndex - 1,
            pageSize,
            fastSearchContent,
            superSearchContent
        });
    }

    //table点击高级搜索
    function superSearchOnSearch(){
        dp('depositManage/updateState',{
            superSearchVisible : !superSearchVisible
        });
    }

    //高级搜索或清空
    function SuperSearchClick(data){
        dp('depositManage/GetTableList',{
            pageIndex : 0,
            pageSize,
            fastSearchContent,
            superSearchContent : data,
        });
    }

    //复选框onChange事件
    function SelectedRowsOnChange(selectedRowKeys, selectedRows){
        dp('depositManage/updateState',{
            selectedRowKeys,
            selectedRows
        });
    }

    //批量操作退款
    function Refund(){
        if(selectedRows && selectedRows.length == 1){
            if(selectedRows[0].status == '1'){
                dp('depositManage/Refund',{
                    orgId : selectedRows[0].orgId,
                    id : selectedRows[0].id,
                })
            }else{
                message.warn('只能选择待处理项退款')
            }
        }else if(selectedRows && selectedRows.length > 1){
            message.warn('暂不支持批量退款')
        }else if(selectedRows && selectedRows.length == 0){
            message.warn('请选择一项退款')
        }
    }

    //批量操作删除
    function Remove(){
        if(selectedRows && selectedRows.length == 1){
            if(selectedRows[0].status == '1'){
                dp('depositManage/Remove',{
                    orgId : selectedRows[0].orgId,
                    id : selectedRows[0].id,
                })
            }else{
                message.warn('只能选择待处理项删除')
            }
        }else if(selectedRows && selectedRows.length > 1){
            message.warn('暂不支持批量删除')
        }else if(selectedRows && selectedRows.length == 0){
            message.warn('请选择一项删除')
        }
    }

    //新建订金
    function CreateDeposit(){
        dp('depositManage/updateState',{
            createOrUpdateModalVisible : true
        });
    }

    //校区选择onChange获取所属学员
    function OrgOnChange(orgId){
        if(orgId != '' && orgId != undefined && orgId != null){
            dp('depositManage/GetStuSummary',{
                orgId
            });
        }else{
            dp('depositManage/updateState',{
                createOrUpdateModalStu : []
            });
        }
    }

    //新建订金modal提交
    function CreateOrUpdateModalSubmit(data){
        dp('depositManage/CreateOrUpdateModalSubmit',{
            ...data
        });
    }

    //新建订金modal关闭
    function CreateOrUpdateModalCancel(){
        dp('depositManage/clearModalData');
    }

    //高级搜索属性
    let DepositManageSuperSearchProps = {
        paymentMethod,              //收款方式
        superSearchVisible,         //高级搜索是否显示
        SuperSearchClick,           //高级搜索点击搜索或者重置
        superSearchOnSearch,        //点击右上角的X
    };

    let CreateOrUpdateModalProps = {
        createOrUpdateModalVisible,         //modal是否显示
        createOrUpdateModalLoading,         //modal加载状态
        createOrUpdateModalButtonLoading,   //modal按钮加载状态
        createOrUpdateModalStu,             //modal所属学员
        paymentMethod,                      //收款方式

        OrgOnChange,                        //校区选择onChange获取所属学员
        CreateOrUpdateModalSubmit,          //modal提交
        CreateOrUpdateModalCancel,          //modal关闭
    }

	let DepositManageTableProps = {
        paymentMethod,              //收款方式
        search : {
            onSearch  : (data) => FastSearch(data),
            onClear   : (data) => FastSearch(data),
            fields : [
				{
					key         : 'id',
					type        : 'input',
					placeholder : '订金编号',
				},{
					key         : 'stuName',
					type        : 'input',
					placeholder : '所属学员',
				},{
					key         : 'status',
					type        : 'select',
					placeholder : '状态',
                    options     : [
                        { label : '全部', key : '' },
                        { label : '待确认', key : '1' },
                        { label : '已确认 ', key : '2' },
                        { label : '已退款', key : '3' },
                        { label : '无效', key : '0' },
                    ]
				}
            ]
        },
		leftBars : {
			label : '已选',
			labelNum : selectedRows.length,
			btns : [
                {
					label : '退款',
					handle : Refund,
                    confirm : true
				},
				{
					label : '删除',
					handle : Remove,
                    confirm : true
				}
			]
		},
		rightBars : {
			isSuperSearch      : true,
			superSearch        : superSearchOnSearch,
			superSearchVisible : superSearchVisible,
            btns               : [
                {
					label : '新建订金',
					handle : CreateDeposit
				},
			]
		},
        table : {
            newColumns : newColumns,
            changeColumns : ChangeColumns,
            loading : loading,
            dataSource : dataSource,
            rowKey : 'id',
            rowSelection : {
                selectedRowKeys : selectedRowKeys,
                onChange : SelectedRowsOnChange,        //复选框onChange事件
            },
        },
		pagination : {
			total            : resultCount,
			pageIndex        : pageIndex,
			pageSize         : pageSize,
			showTotal        : total => `共${resultCount} 条`,
			showSizeChanger  : true,
			showQuickJumper  : true,
			onShowSizeChange : pageOnChange,
			onChange         : pageOnChange
		}
    };

	return (
		<div style = {{ overflowX : 'hidden', height : '100%' }}>
            <DepositManageTable {...DepositManageTableProps}/>
            <DepositManageSuperSearch {...DepositManageSuperSearchProps}/>
            { createOrUpdateModalVisible ? <CreateOrUpdateModal {...CreateOrUpdateModalProps}/> : null }
		</div>
	)
}
function mapStateToProps({ depositManage }) {
  	return { depositManage };
}

export default connect(mapStateToProps)(DepositManage);
