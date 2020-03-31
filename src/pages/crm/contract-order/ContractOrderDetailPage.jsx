import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover, Tabs, Button, Modal } from 'antd';
import { StatusFlag, NewModal} from '../../../components/common/new-component/NewComponent';
import DetailHeader from '../../../components/crm/contract-order/contract-order-detail/DetailHeader';
import ReceiptList from '../../../components/crm/contract-order/contract-order-detail/ReceiptList';
import SendClassList from '../../../components/crm/contract-order/contract-order-detail/SendClassList';
//import ReceiptList from '../../../components/crm/contract-order/contract-order-detail/ReceiptList';
import ContractOrderDetail from '../../../components/crm/contract-order/contract-order-detail/ContractOrderDetail';         //合同详情
//import SendClassList from '../../../components/crm/contract-order/contract-order-detail/SendClassList';
import styles from './ContractOrderDetailPage.less';

const TabPane = Tabs.TabPane;

function ContractOrderDetailPage({ dispatch, contractOrderDetailModel }){
    let {
		detailVisible,

		activeKey,         //当前激活的tab
		currentItem,

		/*收款单*/
		receiptDataSource,
		receiptResultCount,
		receiptPageIndex,
		receiptPageSize,
		receiptLoading,

		/*赠课记录参数*/
		sendClassDataSource,
		sendClassResultCount,
		sendClassPageSize,
		sendClassPageIndex,
		sendClassLoading,

		/*打印信息*/
		printVisible,
		printData,

		/*审核合同参数*/
		checkContractOrderVisible,

		/*收款参数*/
		receiptContractOrderVisible,
		receiptPaymentList,
		balance,

		contractOrderDetail,


    } = contractOrderDetailModel;

	/*关闭详情*/
	function closeDetail(){
		dispatch({
			type : 'contractOrderDetailModel/updateState',
			payload : {
				detailVisible : false
			}
		})
	}

	function changeTab( activeKey ){
		dispatch({
			type : 'contractOrderDetailModel/changeTab',
			payload : {
				activeKey,
			}
		})
	}

    /*收款单*/
	function receiptPageSizeChange( pageIndex, pageSize ){
		dispatch({
			type : 'contractOrderDetailModel/receiptPagination',
			payload : {
				receiptPageSize  : pageSize,
				receiptPageIndex : pageIndex,
			}
		})
	}
	function receiptPageIndexChange( pageIndex ){
		dispatch({
			type : 'contractOrderDetailModel/receiptPagination',
			payload : {
				receiptPageSize,
				receiptPageIndex : pageIndex,
			}
		})
	}

    /*赠送课时分页*/
	function sendClassPageSizeChange( pageIndex, pageSize ){
		dispatch({
			type : 'contractOrderDetailModel/sendClassPagination',
			payload : {
				sendClassPageSize  : pageSize,
				sendClassPageIndex : pageIndex,
			}
		})
	}

	function sendClassPageIndexChange( pageIndex ){
		dispatch({
			type : 'contractOrderDetailModel/sendClassPagination',
			payload : {
				sendClassPageSize,
				sendClassPageIndex : pageIndex,
			}
		})
	}


	/*头部详情*/
	let headDeatilProps = {
		closeDetail,
		currentItem,
	}

	let contractOrderDetailProps = {
		currentItem,
		contractOrderDetail
	}

    /*收款单列表*/
	let receiptListProps = {
		receiptDataSource,
		receiptResultCount,
		receiptPageIndex,
		receiptPageSize,
		receiptLoading,

		/*方法*/
		receiptPageSizeChange,
		receiptPageIndexChange
	}
    /*赠送课时列表*/
	let sendClassListProps = {
		sendClassDataSource,
		sendClassResultCount,
		sendClassPageSize,
		sendClassPageIndex,
		sendClassLoading,

		/*方法*/
		sendClassPageSizeChange,
		sendClassPageIndexChange,
	}

    return (
		<div className = 'common_detail' >
			<NewModal
				visible = { detailVisible }
				width = '900px'
				headVisible = { false }
				footer = '' >
				<DetailHeader { ...headDeatilProps } />
				<Tabs onChange = { changeTab } size = "small" activeKey = { activeKey } >
                    <TabPane tab = '收款单' key = "1">
						<div className = 'vip_detail_content_item' >
							<ReceiptList {...receiptListProps} />
						</div>
					</TabPane>
					<TabPane tab = '赠课记录' key = "2">
						<div className = 'vip_detail_content_item' >
							<SendClassList {...sendClassListProps} />
						</div>
					</TabPane>
					<TabPane tab = '合同详情' key = "3">
						<div className = 'vip_detail_content_item contract_order_detail_spe' style = {{ height : "calc(100vh - 260px)", overflow : 'auto' }} >
							<ContractOrderDetail { ...contractOrderDetailProps } />
						</div>
					</TabPane>
				  </Tabs>
			</NewModal>
		</div>
    )
};

function mapStateToProps ({ contractOrderDetailModel }){
	return { contractOrderDetailModel };
};

export default connect( mapStateToProps )( ContractOrderDetailPage );
