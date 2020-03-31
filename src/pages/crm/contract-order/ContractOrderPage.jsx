import React from 'react';
import { connect } from 'dva';
import { Modal, Button, Popover, Icon, message , notification } from 'antd';
import moment from 'moment';
import { StatusFlag , AlertModal } from '../../../components/common/new-component/NewComponent';
import ContractOrderComponent from '../../../components/common/new-component/manager-list/ManagerList';
import SuperSearch from '../../../components/common/new-component/super-search/SuperSearch';
import ContractOrderImportModal from '../../../components/crm/contract-order/ContractOrderImportModal/ContractOrderImportModal';    //导入合同
import CheckContractOrder from '../../../components/crm/contract-order/contract-order-detail/CheckContractOrder';
import ContractOrderDetailPage from './ContractOrderDetailPage';

function ContractOrderPage({ dispatch, contractOrderModel }) {
	let {
		/*表格项参数*/
		dataSource,
		newColumns,
		resultCount,
		loading,
		pageIndex,
		pageSize,
        orderState,
        startTime,
        endTime,
        estartTime,
        eendTime ,                //到期日期
        expireInvalid ,           //过期作废

        /*审核*/
        selectedRows,
        selectedRowKeys,
        currentItem,
        checkContractBtnLoading,
        checkContractOrderVisible,
        checkContractBtnFailLoading,

		/*高级搜索*/
		searchVisible,
		searchValues,

    } = contractOrderModel;

	/*常用搜索*/
	function searchFunction( values ){
		if( !!values && values.dept_org ){
			values.tenantIds = values.dept_org.split('-')[0];
			values.orgIds = values.dept_org.split('-')[1];
			values.orgId = values.dept_org.split('-')[1];
			delete values.dept_org;
		}
		dispatch({
			type : 'contractOrderModel/searchFunction',
			payload : {
				values
			}
		})
	}

	/*常用重置*/
	function clearFunction(){
		dispatch({
			type : 'contractOrderModel/searchFunction',
			payload : {
				values : {
					orgIds      : undefined,
					tenantIds   : undefined,
					mobile      : undefined,
					type				: undefined
				}
			}
		})
	}

	/*点击高级搜索*/
	function superSearchClick(){
		dispatch({
			type : 'contractOrderModel/updateState',
			payload : {
				searchVisible : !searchVisible
			}
		})
	}

	/*高级搜索*/
	function onSuperSearch( values ){
		dispatch({
			type : 'contractOrderModel/onSuperSearch',
			payload : {
				values
			}
		})
	}
	/*高级搜索重置*/
	function onSuperClear(){
		dispatch({
			type : 'contractOrderModel/onSuperSearch',
			payload : {
				values : {
					signType          : undefined,
					type              : undefined,
					parentName        : undefined,
					createPersonName  : undefined,
					startTime         : undefined,
					endTime           : undefined,
                    estartTime        : undefined,
                    eendTime          : undefined ,                //到期日期
                    expireInvalid     : undefined,           //过期作废
				}
			}
		})
	}

	//改变表格项
	function changeColumns( newColumns ){
		dispatch({
			type : 'contractOrderModel/updateState',
			payload : {
				newColumns
			}
		})
	}

	/*分页*/
	function pageSizeChange( pageIndex, pageSize ){
		dispatch({
			type : 'contractOrderModel/pagination',
			payload : {
				pageIndex,
				pageSize,
			}
		})
	}
	function pageIndexChange( pageIndex ){
		dispatch({
			type : 'contractOrderModel/pagination',
			payload : {
				pageIndex,
				pageSize,
			}
		})
	}

    /*显示详情*/
	function showContractOrderDetail( id, item ){
		dispatch({
			type : 'contractOrderDetailModel/showDetail',
			payload : {
				id : item.orderNumber,
				item,
			}
		})
	}

    /*审核合同订单*/
	function checkContractOrder(){
		if( !!selectedRowKeys && selectedRowKeys.length > 1 ){
			message.error( '只能选择一条合同进行审核' );
			return
		}else if(!!currentItem.orderState && currentItem.orderState != '1'){
            message.error( '该合同已审核' );
			return
        }
		dispatch({
			type : 'contractOrderModel/updateState',
			payload : {
				checkContractOrderVisible : true
			}
		})
	}

    /*关闭审核*/
	function cancelCheckContract(){
		dispatch({
			type : 'contractOrderModel/updateState',
			payload : {
				checkContractOrderVisible : false
			}
		})
	}

    /*选择表格列表项*/
	function rowSelectChange( selectedRowKeys, selectedRows ){
		dispatch({
			type : 'contractOrderModel/rowSelectChange',
			payload : {
				selectedRowKeys,
				selectedRows
			}
		})
	}

    /*审核通过或不通过*/
	function confirmCheckContractOrder( values, status ){
		dispatch({
			type : 'contractOrderModel/confrimCheckContractOrder',
			payload : {
				status,
				values
			}
		})
	}

	/** 合同导出 */
	function contractExport(){
		if(resultCount > 0){
			window.excelExport('/hq/crm/purchase/export',searchValues)
		} else {
			message.warn('无查询结果可导出');
		}

	}

	let contractOrderComponentProps = {
        search : {
            onSearch          : searchFunction,
            onClear           : clearFunction,
            fields : [
				{ key : 'dept_org' , type : 'dept_org' },
				{ key : 'mobile', type : 'input', placeholder : '请输入手机号搜索' },
				{ key : 'type', type : 'select', placeholder : '请选择购买类型', options: [
					{ key : '2', label : '课时套餐' },
					{ key : '3', label : '托班套餐' }
				] }
            ]
        },
        leftBars : {
			label : '已选',
			labelNum : selectedRows.length,
			btns : [
				{
					label : '审核',
					handle : checkContractOrder
				},

			]
		},
		rightBars : {
			isSuperSearch      : true,
			superSearch        : superSearchClick,
			superSearchVisible : searchVisible,
			btns : [
				{
						icon     : 'export',
						label    : '按查询结果导出',
						handle   : contractExport,
						type     : 'button'
				}
			],
		},
        table : {
					rowKey: 'orderNum',
            loading       : loading,
            dataSource    : dataSource,
			xScroll       : 1800,
			newColumns    : newColumns,
			changeColumns : changeColumns,
            columns : [
                {
					dataIndex : 'orderNum',
					key       : 'orderNum',
					title     : '合同编号',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							<a onClick = { () => showContractOrderDetail( text, record ) }>{ text }</a>
						</Popover>
					)
				},{
					dataIndex : 'orderNewOldstu',
					key       : 'orderNewOldstu',
					title     : '学员类型',
					width     : 96,
					render    : ( text, record ) => (
						<span>
							{ !!text && text == '0' ? '新学员' : text == '1' ? '老学员' : '暂无' }
						</span>
					)
				},{
					dataIndex : 'signType',
					key       : 'signType',
					title     : '签约类型',
					width     : 96,
					render    : ( text, record ) => (
						<span>
							{ !!text && text == '0' ? '新签约' : text == '1' ? '续约' : text == '2' ? '新签-转介绍' : '暂无' }
						</span>
					)
				},{
					dataIndex : 'orderType',
					key       : 'orderType',
					title     : '购买类型',
					width     : 96,
					render    : ( text, record ) => (
						<span>
							{ !!text && text == '1' ? '充值' : text == '2' ? '课时套餐' : text == '3' ? '托班套餐' : '暂无' }
						</span>
					)
				},{
					dataIndex : 'stuCardId',
					key       : 'stuCardId',
					title     : '会员卡号',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'parentName',
					key       : 'parentName',
					title     : '签约家长',
					width     : 96,
                    render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
                    title     : '家长手机号',
                    key       : 'mobile',
                    dataIndex : 'mobile',
                    width     : 112,
                    render    : (text,record) => (
                        <Popover placement="top" content={text||'暂无'} trigger="click">
                            <a>查看</a>
                        </Popover>
                    )
                },{
					dataIndex : 'periodExpend',
					key       : 'periodExpend',
					title     : '合同期限',
					width     : 160,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { !!record && !!record.startTime && !!record.endTime && record.startTime + ' ~ ' + record.endTime } trigger = 'hover' >
							<span>
								{ !!record && !!record.startTime && !!record.endTime && record.startTime + ' ~ ' + record.endTime }
							</span>
						</Popover>
					)
				},{
					dataIndex : 'expireInvalid',
					key       : 'expireInvalid',
					title     : '过期作废',
					width     : 90,
					render    : ( text, record ) => (
						<div>
							{ text=='1'?
                                <span>是</span>
                                :
                                <span>否</span>
                            }
						</div>
					)
				},{
					dataIndex : 'orderMoney',
					key       : 'orderMoney',
					title     : '合同金额',
					width     : 96,
                    render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'orderState',
					key       : 'orderState',
					title     : '审核状态',
					width     : 96,
					render    : ( text, record ) => (
                        <div>
                            { text == '0' ? <StatusFlag type = 'gray'>无效</StatusFlag> :
                              text == '1' ? <StatusFlag type = 'blue' >待审核</StatusFlag> :
                              text == '3' ? <StatusFlag type = 'deep_red' >已驳回</StatusFlag> :
															text == '4' ? <StatusFlag type = 'green' >已通过</StatusFlag> :
															text == '5' ? <StatusFlag type = 'red' >已作废</StatusFlag> : ''
                            }
                        </div>
					)
				},{
					dataIndex : 'receiptStatus',
					key       : 'receiptStatus',
					title     : '收款状态',
					width     : 96,
					render    : ( text, record ) => (
                        <div>
                            { text == '0' ? <StatusFlag type = 'red'>未收款</StatusFlag> :
                              text == '1' ? <StatusFlag type = 'green' >已收款</StatusFlag> :
                              text == '2' ? <StatusFlag type = 'green' >部分收款</StatusFlag> : ''
                            }
                        </div>
					)
				},{
					dataIndex : 'signTime',
					key       : 'signTime',
					title     : '签订日期',
					width     : 160,
                    render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'orderCreatePerson',
					key       : 'orderCreatePerson',
					title     : '创建人',
					width     : 82,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'checkUserName',
					key       : 'checkUserName',
					title     : '审核人',
					width     : 82,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'orderSubordinateCampus',
					key       : 'orderSubordinateCampus',
					title     : '所属校区',
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				}
            ],
            rowSelection : {
                selectedRowKeys  : selectedRowKeys,
                onChange         : rowSelectChange,
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
    };

	let superSearchProps = {
		searchVisible : searchVisible,
		closeSearch   : superSearchClick,
		onSearch      : onSuperSearch,
		onClear       : onSuperClear,
		fields        : [
			{
				key         : 'signType',
				type        : 'select',
				label       : '签约类型',
				placeholder : '签约类型',
				options     : [
					{ key : '0', label : '新签约' },
					{ key : '1', label : '续约' }
				]
			},{/*
				key         : 'type',
				type        : 'select',
				label       : '购买类型',
				placeholder : '购买类型',
				options     : [
					{ key : '1', label : '充值' },
					{ key : '2', label : '课时包' }
				]
			*/},{
				key         : 'parentName',
				type        : 'input',
				placeholder : '请输入家长',
				label       : '签约家长'
			},{
				key         : 'orderState',
				type        : 'select',
				label       : '审核状态',
				placeholder : '审核状态',
				options     : [
					{ key : '1', label : '待审核' },
					{ key : '3', label : '已驳回' },
					{ key : '4', label : '已通过' },
					{ key : '5', label : '已作废' },
				],
                initialValue : orderState
			},{
				key         : 'receiptStatus',
				type        : 'select',
				label       : '收款状态',
				placeholder : '收款状态',
				options     : [
					{ key : '0', label : '未收款' },
					{ key : '1', label : '已收款' },
                    { key : '2', label : '部分收款' },
				]
			},{
				key              : 'time',
				type             : 'rangePicker',
				label            : '签约日期',
				startPlaceholder : '开始时间',
				endPlaceholder   : '结束时间',
                initialValue     : [ startTime != undefined ? moment(startTime,'YYYY-MM-DD HH:mm') : undefined, endTime != undefined ? moment(endTime,'YYYY-MM-DD HH:mm') : undefined ]
			},{
				key              : 'eTime',
				type             : 'rangePicker',
				label            : '到期日期',
				startPlaceholder : '开始时间',
				endPlaceholder   : '结束时间',
                initialValue     : [ estartTime != undefined ? moment(estartTime,'YYYY-MM-DD') : undefined, eendTime != undefined ? moment(eendTime,'YYYY-MM-DD') : undefined ]
			},{
				key         : 'expireInvalid',
				type        : 'select',
				label       : '过期作废',
				placeholder : '过期作废',
				options     : [
					{ key : '0', label : '否' },
					{ key : '1', label : '是' },
				]
			},{
				key         : 'createPersonName',
				type        : 'input',
				placeholder : '输入创建人',
				label       : '创建人'
			}
		]
	}

    /*审核合同参数*/
	let checkContractOrderProps = {
		checkContractOrderVisible,
		currentItem,
		checkContractBtnLoading,
		checkContractBtnFailLoading,

		/*方法*/
		cancelCheckContract,
		confirmCheckContractOrder
	}

	return (
		<div style = {{ overflow : 'hidden', height : '100%' }}>
			<ContractOrderComponent { ...contractOrderComponentProps }/>
			<SuperSearch { ...superSearchProps } />
			<CheckContractOrder { ...checkContractOrderProps } />
			<ContractOrderDetailPage />
		</div>
	)
}

function mapStateToProps({ contractOrderModel }) {
  	return { contractOrderModel };
}

export default connect(mapStateToProps)(ContractOrderPage);
