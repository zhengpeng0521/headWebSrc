/*
* 课时月结表
*
*/
import React from 'react';
import Media from 'react-media';
import { Popover, Icon } from 'antd';
import { StatusFlag } from '../../../common/new-component/NewComponent';

import ManagerList from '../../../common/new-component/manager-list/ManagerList';

function ClassMonthKnotSheetTable({
	pageIndex,
	pageSize,
	resultCount,
	dataSource,
	loading,

	//方法
	paginationChange,

}){
	let managerListProps = {
		table : {
			loading       : loading,
			dataSource    : dataSource,
			xScroll       : 2900,
			height        : 380,
      columns : [
                {
					title     : '会员卡号',
					dataIndex : 'cardId',
					key       : 'cardId',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '学员姓名',
					key       : 'stuNames',
					dataIndex : 'stuNames',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
                    key       : 'mobile',
                    dataIndex : 'mobile',
                    title     : '家长手机号',
                    width     : 112,
					render    : ( text, record ) => (
                        <Popover placement = "top"
                             content = {
                                    <div>
                                        { !!record.parents && record.parents.map( (item, index) => {
                                        return(
                                            <div key = { 'mobile' + index }>
                                                <span style = {{ marginRight : record.parents.length > 1 && index != record.parents.length - 1 ? 10 : 0 }}>{ (item.name || '--') + ' : ' + (item.mobile || '--') }</span>
                                            </div>)
                                        }) }

                                    </div>
                                        }
                             trigger = 'click' >
							<a>查看</a>
						</Popover>
					)
                },{
					title     : '上月底剩余课时',
					key       : 'periodEndLeftNum',
					dataIndex : 'periodEndLeftNum',
					width     : 128,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '上月底剩余金额',
					key       : 'periodEndLeftMoney',
					dataIndex : 'periodEndLeftMoney',
					width     : 128,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '本月增加课时',
					key       : 'periodAddNum',
					dataIndex : 'periodAddNum',
					width     : 128,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '本月实收金额',
					key       : 'payMoney',
					dataIndex : 'payMoney',
					width     : 128,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '本月应收金额',
					key       : 'oriMoney',
					dataIndex : 'oriMoney',
					width     : 128,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '总剩余课时',
					key       : 'totalPeriodLeftNum',
					dataIndex : 'totalPeriodLeftNum',
					width     : 112,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '总剩余金额',
					key       : 'totalPeriodLeftMoney',
					dataIndex : 'totalPeriodLeftMoney',
					width     : 112,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '课时均价',
					key       : 'periodAveragePrice',
					dataIndex : 'periodAveragePrice',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '本月已消耗课时',
					key       : 'periodCostNum',
					dataIndex : 'periodCostNum',
					width     : 128,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '本月已消耗金额',
					key       : 'periodCostMoney',
					dataIndex : 'periodCostMoney',
					width     : 128,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '转课转出课时',
					key       : 'periodTranOutNum',
					dataIndex : 'periodTranOutNum',
					width     : 120,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '转课转出金额',
					key       : 'periodTranOutMoney',
					dataIndex : 'periodTranOutMoney',
					width     : 120,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '转课转入课时',
					key       : 'periodTranInNum',
					dataIndex : 'periodTranInNum',
					width     : 120,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '转课转入金额',
					key       : 'periodTranInMoney',
					dataIndex : 'periodTranInMoney',
					width     : 120,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '转校转出数量',
					key       : 'periodTranSchOutNum',
					dataIndex : 'periodTranSchOutNum',
					width     : 120,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '转校转出金额',
					key       : 'periodTranSchOutMoney',
					dataIndex : 'periodTranSchOutMoney',
					width     : 120,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '转校转入数量',
					key       : 'periodTranSchInNum',
					dataIndex : 'periodTranSchInNum',
					width     : 120,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '转校转入金额',
					key       : 'periodTranSchInMoney',
					dataIndex : 'periodTranSchInMoney',
					width     : 120,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '退课时',
					key       : 'periodRefundNum',
					dataIndex : 'periodRefundNum',
					width     : 82,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '退课金额',
					key       : 'periodRefundMoney',
					dataIndex : 'periodRefundMoney',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '退课手续费',
					key       : 'periodRefundFee',
					dataIndex : 'periodRefundFee',
					width     : 112,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '过期作废课时',
					key       : 'periodExpireNum',
					dataIndex : 'periodExpireNum',
					width     : 112,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text || '0' }
						</Popover>
					)
				},{
					title     : '过期作废金额',
					key       : 'periodExpireMoney',
					dataIndex : 'periodExpireMoney',
					width     : 112,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text || '0' }
						</Popover>
					)
				},{
					title     : '总消耗课时',
					key       : 'totalExpendPeriod',
					dataIndex : 'totalExpendPeriod',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text || '0' } trigger = 'hover' >
							{ text || '0' }
						</Popover>
					)
				},{
					title     : '总消耗金额',
					key       : 'totalExpendPeriodMoney',
					dataIndex : 'totalExpendPeriodMoney',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text || '0' } trigger = 'hover' >
							{ text || '0' }
						</Popover>
					)
				},{
					title     : '剩余课时',
					key       : 'periodLeftNum',
					dataIndex : 'periodLeftNum',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					title     : '剩余金额',
					key       : 'periodLeftMoney',
					dataIndex : 'periodLeftMoney',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},
            ],
         },
		pagination : {
			total            : resultCount,
			pageIndex        : pageIndex,
			pageSize         : pageSize,
			showTotal        : total => `总共 ${ total } 条`,
			showSizeChanger  : true,
			showQuickJumper  : true,
			onShowSizeChange : paginationChange,
			onChange         : paginationChange
		}
	}

    return(
		<ManagerList { ...managerListProps } />
    );
}

export default ClassMonthKnotSheetTable;
