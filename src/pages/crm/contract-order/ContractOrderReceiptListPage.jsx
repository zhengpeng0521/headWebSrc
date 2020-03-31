import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover } from 'antd';
import ContractOrderReceiptListComponent from '../../../components/common/new-component/manager-list/ManagerList';
import SuperSearch from '../../../components/common/new-component/super-search/SuperSearch';

function ContractOrderReceiptListPage({ dispatch, contractOrderReceiptListModel }){
    let {
		/*高级搜索*/
		searchVisible,
		/*高级搜索*/

		id,
		receiverName,
		paymentId,

		paymentSelectList,

		purchaseId,
		orgId,
		acctNo,
		realSerialNumber,

		pageIndex,
		pageSize,
		loading,
		dataSource,
		resultCount,
		newColumns,

		selectedRowKeys

    } = contractOrderReceiptListModel;
	//高级搜索点击事件
	function superSearchClick(){
		dispatch({
			type : 'contractOrderReceiptListModel/updateState',
			payload : {
				searchVisible : !searchVisible
			}
		})
	}

	//高级搜索
	function onSuperSearch( values ){
		let params = {
			/*常用搜索*/
			id, receiverName, paymentId,
			pageSize, pageIndex,
			...values
		}
		dispatch({
			type : 'contractOrderReceiptListModel/getReceiptList',
			payload : {
				params
			}
		})
	}

	//高级搜索重置
	function onSuperClear(){
		let params = {
			/*常用搜索*/
			id, receiverName, paymentId,
			pageSize, pageIndex,
			purchaseId       : undefined,
			orgId            : undefined,
			acctNo           : undefined,
			realSerialNumber : undefined
		}
		dispatch({
			type : 'contractOrderReceiptListModel/getReceiptList',
			payload : {
				params
			}
		})
	}

	//常用搜索
	function searchFunction( values ){
		let params = {
			/*高级搜索*/
			purchaseId, orgId, acctNo, realSerialNumber,
			pageSize, pageIndex,
			...values
		}
		dispatch({
			type : 'contractOrderReceiptListModel/getReceiptList',
			payload : {
				params
			}
		})
	}

	//常用重置
	function clearFunction(){
		let params = {
			/*高级搜索*/
			purchaseId, orgId, acctNo, realSerialNumber,
			pageSize, pageIndex,
			id           : undefined,
			receiverName : undefined,
			paymentId    : undefined,
		}
		dispatch({
			type : 'contractOrderReceiptListModel/getReceiptList',
			payload : {
				params
			}
		})
	}

	//分页
	function pageSizeChange( pageIndex, pageSize ){
		let params = {
			purchaseId,
			orgId,
			acctNo,
			realSerialNumber,

			id,
			receiverName,
			paymentId,

			pageSize,
			pageIndex : pageIndex - 1
		}
		dispatch({
			type : 'contractOrderReceiptListModel/getReceiptList',
			payload : {
				params
			}
		})
	}
	function pageIndexChange( pageIndex ){
		let params = {
			purchaseId,
			orgId,
			acctNo,
			realSerialNumber,

			id,
			receiverName,
			paymentId,

			pageSize,
			pageIndex : pageIndex - 1
		}
		dispatch({
			type : 'contractOrderReceiptListModel/getReceiptList',
			payload : {
				params
			}
		})
	}

	//表格显示项
	function changeColumns( newColumns ){
		dispatch({
			type : 'contractOrderReceiptListModel/updateState',
			payload : {
				newColumns
			}
		})
	}

	//高级搜索
	let superSearchProps = {
		searchVisible : searchVisible,
		closeSearch   : superSearchClick,
		onSearch      : onSuperSearch,
		onClear       : onSuperClear,
		fields        : [
			{
				key         : 'orgId',
				type        : 'orgSelect',
				label       : '所属校区',
				options     : {
					width : 280,
					getPopupContainer : () => document.getElementById( 'super_search_wrap' )
				}
			},{
				key         : 'purchaseId',
				type        : 'input',
				label       : '合同号',
				placeholder : '请输入合同号',
			},{
				key         : 'acctNo',
				type        : 'input',
				label       : '收款账号',
				placeholder : '请输入收款账号',
			},{
				key         : 'realSerialNumber',
				type        : 'input',
				label       : '流水号',
				placeholder : '请输入流水号',
			}
		]
	}

    let contractOrderReceiptListComponentProps = {
        search : {
            onSearch  : searchFunction,
            onClear   : clearFunction,
            fields    : [
				{
					key         : 'id',
					type        : 'input',
					placeholder : '收款编号',
				},{
					key         : 'receiverName',
					type        : 'input',
					placeholder : '收款人'
				},{
					key         : 'paymentId',
					type        : 'select',
					placeholder : '收款方式',
					options     : paymentSelectList,
					opt_key     : 'id',
					opt_label   : 'name'
				}
            ],
        },
        rightBars : {
			isSuperSearch      : true,
			superSearch        : superSearchClick,
			superSearchVisible : searchVisible,
        },
        table : {
            loading       : loading,
            dataSource    : dataSource,
			xScroll       : 1066,
			newColumns    : newColumns,
			changeColumns : changeColumns,
            columns : [
                {
                    dataIndex : 'id',
                    key       : 'id',
                    title     : '收款编号',
                    width     : 96,
                    render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
                        	{ text }
						</Popover>
                    )
                },{
                    dataIndex : 'purchaseId',
                    key       : 'purchaseId',
                    title     : '合同编号',
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
                },{
                    dataIndex : 'paymentName',
                    key       : 'paymentName',
                    title     : '收款方式',
                    width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
                },{
                    dataIndex : 'acctNo',
                    key       : 'acctNo',
                    title     : '收款账号',
                    width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
                },{
                    dataIndex : 'realSerialNumber',
                    key       : 'realSerialNumber',
                    title     : '对应流水号',
                    width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
                },{
                    dataIndex : 'money',
                    key       : 'money',
                    title     : '收款金额',
                    width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
                },{
                    dataIndex : 'realMoney',
                    key       : 'realMoney',
                    title     : '实际到账',
                    width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
                },{
                    dataIndex : 'createTime',
                    key       : 'createTime',
                    title     : '收款日期',
                    width     : 160,
                },{
                    dataIndex : 'receiverName',
                    key       : 'receiverName',
                    title     : '收款人',
                    width     : 82,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
                },{
                    dataIndex : 'orgName',
                    key       : 'orgName',
                    title     : '所属校区',
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
                }
            ],
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

    return (
        <div style = {{ height : '100%', overflow : 'hidden' }}>
			<ContractOrderReceiptListComponent { ...contractOrderReceiptListComponentProps } />
			<SuperSearch { ...superSearchProps } />
        </div>
    )
};

function mapStateToProps ({ contractOrderReceiptListModel }){
	return { contractOrderReceiptListModel };
};

export default connect( mapStateToProps )( ContractOrderReceiptListPage );
