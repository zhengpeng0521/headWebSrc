import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover ,message } from 'antd';
import ContractOrderReceiptListComponent from '../../../components/common/new-component/manager-list/ManagerList';
import SuperSearch from '../../../components/common/new-component/super-search/SuperSearch';
import ContractOrderReceiptListCheckModel from '../../../components/crm/contract-order-receipt/ContractOrderReceiptListCheckModel'

function ContractOrderReceiptListPage({ dispatch, contractOrderReceiptListModel }){
    let {
		/*高级搜索*/
		searchVisible,
		/*高级搜索*/

		tenantId,
		orgId,
		id,
		receiverName,
		paymentId,

		paymentSelectList,

		orderNum,
		acctNo,
		realSerialNumber,

		pageIndex,
		pageSize,
		loading,
		dataSource,
		resultCount,
		newColumns,

		selectedRowKeys,
        selectedRows,

        ContractReceiptCheckVisible,  //模态框是否显示

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
			pageSize,
            pageIndex:0,
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
			orderNum       : undefined,
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
        if(!!values && !!values.dept_org){
            values.tenantId = values.dept_org.substr(0,values.dept_org.indexOf('-'));
            //values.orgIds = values.dept_org.substr(values.dept_org.indexOf('-') + 1);
            values.orgId = values.dept_org.substr(values.dept_org.indexOf('-') + 1);
            delete values.dept_org;
        }
		let params = {
			/*高级搜索*/
			orderNum, acctNo, realSerialNumber,
			pageSize,
            pageIndex:0,
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
			orderNum, acctNo, realSerialNumber,
			pageSize,
			pageIndex	 : 0,
			id           : undefined,
			receiverName : undefined,
			paymentId    : undefined,
			tenantId	 : undefined,
			orgId		 : undefined
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
			tenantId,
			orgId,
			orderNum,
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
			tenantId,
			orgId,
			orderNum,
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
    //选择表格行
	function rowSelectChange ( selectedRowKeys,selectedRows ){
		dispatch({
            type : 'contractOrderReceiptListModel/updateState',
            payload : {
                selectedRowKeys,
                selectedRows
            }
        })
	};
    //到账审核
    function receiptListCheck(){
        if(selectedRowKeys.length>1){
            message.error('只能选择一条收款单');
        }else{
            dispatch({
                type:'contractOrderReceiptListModel/updateState',
                payload :{
                    ContractReceiptCheckVisible : true
                }
            })
        }

    }
    //暂不处理
    function ContractReceiptCheckCancel(){
        dispatch({
            type:'contractOrderReceiptListModel/updateState',
            payload :{
                ContractReceiptCheckVisible : false
            }
        })
    }
    //作废
    function ContractReceiptCheckInvalid(){
        dispatch({
            type:'contractOrderReceiptListModel/checkPayInfo',
            payload :{
                payInfoId : selectedRows[0].id,
                status    : '3',
                orgId : selectedRows[0].orgId,
            }
        })
    }
    //确认到账
    function ContractReceiptCheckSure(){
        let payInfoId = '';
        dispatch({
            type:'contractOrderReceiptListModel/checkPayInfo',
            payload :{
                payInfoId : selectedRows[0].id,
                status    : '1',
                orgId : selectedRows[0].orgId,
            }
        })
    }

    //到账审核模态框
    let ContractOrderReceiptListCheckModelProps = {
        ContractReceiptCheckVisible,
        ContractReceiptCheckCancel,   //关闭
        ContractReceiptCheckInvalid, //作废
        ContractReceiptCheckSure, //确认到账
        selectedRows,
    }
	//高级搜索
	let superSearchProps = {
		searchVisible : searchVisible,
		closeSearch   : superSearchClick,
		onSearch      : onSuperSearch,
		onClear       : onSuperClear,
		fields        : [
			{
				key         : 'orderNum',
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
			},


		]
	}

    let contractOrderReceiptListComponentProps = {
        search : {
            onSearch  : searchFunction,
            onClear   : clearFunction,
            fields    : [
                { key : 'dept_org' , type : 'dept_org' },
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
				},

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
                    dataIndex : 'status',
                    key       : 'status',
                    title     : '收款状态',
                    width     : 96,
					render    : ( text, record ) => (
                        <div>
                            {
                                record.status=='1'?
                                    <span>已确认</span>
                                :record.status=='2'?
                                    <span>待确认</span>
                                :record.status=='3'?
                                    <span>已作废</span>
                                :null
                            }
                        </div>
					)
                },{
                    dataIndex : 'type',
                    key       : 'type',
                    title     : '收款类型',
                    width     : 96,
					render    : ( text, record ) => (
                        <div>
                            {
                                record.type=='3'?
                                    <span>在线支付</span>
                                :record.type=='2'?
                                    <span>POS收款</span>
                                :record.type=='1'?
                                    <span>手填收款</span>
                                :null
                            }
                        </div>
					)
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
                    dataIndex : 'orderNum',
                    key       : 'orderNum',
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
		},
        leftBars : {
            label    : '已选',
			labelNum : selectedRowKeys.length,
            btns : [
                {
                    label    : '到账审核',
                    handle   : receiptListCheck,
                },

            ]
        },
    };

    return (
        <div style = {{ height : '100%', overflow : 'hidden' }}>
			<ContractOrderReceiptListComponent { ...contractOrderReceiptListComponentProps } />
			<SuperSearch { ...superSearchProps } />
            <ContractOrderReceiptListCheckModel { ...ContractOrderReceiptListCheckModelProps }/>
        </div>
    )
};

function mapStateToProps ({ contractOrderReceiptListModel }){
	return { contractOrderReceiptListModel };
};

export default connect( mapStateToProps )( ContractOrderReceiptListPage );
