import React from 'react';
import { Modal, Button, Rate, Popconfirm, Popover } from 'antd';
import moment from 'moment';
import ContractOrderComponent from '../../common/new-component/manager-list/ManagerList';
import { StatusFlag } from '../../common/new-component/NewComponent';
import styles from './ProductionTab.less';

function ContractTab ({
	contractOrderList,
	contractOrderLoading,
	contractOrderResultCount,
	contractOrderPageIndex,
	contractOrderPageSize,
	contractOrderPageSizeChange,
	contractOrderPageIndexChange,

	addContractOrder
}){
    let contractOrderComponentProps = {
        table : {
            loading     : contractOrderLoading,
            dataSource  : contractOrderList,
            xScroll     : 1170,
			height      : 376,
			isWidth     : true,
            columns : [
                {
					dataIndex : 'orderNum',
					key       : 'orderNum',
					title     : '合同编号',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							<span>{ text }</span>
						</Popover>
					)
				},{
					dataIndex : 'orderNewOldstu',
					key       : 'orderNewOldstu',
					title     : '签约类型',
					width     : 96,
					render    : ( text, record ) => (
						<span>
							{ !!text && text == '0' ? '新签约' : text == '1' ? '续约' : '暂无' }
						</span>
					)
				},{
					dataIndex : 'orderType',
					key       : 'orderType',
					title     : '购买类型',
					width     : 96,
					render    : ( text, record ) => (
						<span>
							{ !!text && text == '1' ? '充值' : text == '2' ? '课时包' : '暂无' }
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
					dataIndex : 'orderMoney',
					key       : 'orderMoney',
					title     : '合同金额',
					width     : 96,
				},{
					dataIndex : 'orderState',
					key       : 'orderState',
					title     : '审核状态',
					width     : 96,
					render    : ( text, record ) => (
						<StatusFlag type = { !!text && text == '0' ? 'gray' : text == '1' ? 'red' : text == '3' ? 'deep_red' : '' } >
							{ !!text && text == '1' ? '待审核' : text == '3' ? '已驳回' : text == '4' ? '已通过' : '暂无' }
						</StatusFlag>
					)
				},{
					dataIndex : 'receiptStatus',
					key       : 'receiptStatus',
					title     : '收款状态',
					width     : 96,
					render    : ( text, record ) => (
						<StatusFlag type = { !!text && text == '0' ? 'red' : '' } >
							{ !!text && text == '0' ? '未收款' : text == '1' ? '已收款' : '暂无' }
						</StatusFlag>
					)
				},{
					dataIndex : 'orderCreateTime',
					key       : 'orderCreateTime',
					title     : '签订日期',
					width     : 160,
				},{
					dataIndex : 'orderCreatePerson',
					key       : 'orderCreatePerson',
					title     : '创建人',
					width     : 82,
					render    : ( text, record ) => (
						<Popover placement = "top" content = { text } trigger = 'hover' >
							<span>{ text }</span>
						</Popover>
					)
				}
            ],
            emptyText : '暂时没有数据',
        },
        pagination : {
            total            : contractOrderResultCount,
            pageIndex        : contractOrderPageIndex,
            pageSize         : contractOrderPageSize,
            showTotal        : total => `总共 ${ total } 条`,
//            showSizeChanger  : true,
            showQuickJumper  : true,
            onShowSizeChange : contractOrderPageSizeChange,
            onChange         : contractOrderPageIndexChange,
        }
    };

    return(
        <div className = { styles.Production_plan_inner_list } >
            <Button
				type = 'primary'
				className = { styles.stumanageBtn }
				style={{ width : 120, marginLeft : '30px' }}
				onClick = { addContractOrder }
			>
				添加合同
			</Button>
            <div className = { styles.stumanageProduction_plan_inner_list } >
				<ContractOrderComponent { ...contractOrderComponentProps } />
			</div>
        </div>
    );
}

export default ContractTab;
