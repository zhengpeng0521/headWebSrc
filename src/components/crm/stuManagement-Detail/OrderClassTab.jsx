import React from 'react';
import { Modal, Button, Rate, Popconfirm, Popover } from 'antd';
import moment from 'moment';
import OrderClassComponent from '../../common/new-component/manager-list/ManagerList';
import { StatusFlag } from '../../common/new-component/NewComponent';
import styles from './ProductionTab.less';

function OrderClassTab({
	orderClassList,
	orderClassLoading,
	orderClassResultCount,
	orderClassPageIndex,
	orderClassPageSize,

	orderClassPageIndexChange,

}){
    let orderClassComponentProps = {
        table : {
            loading     : orderClassLoading,
            dataSource  : orderClassList,
			height      : 338,
			isWidth     : true,
            columns : [
                {
					dataIndex : 'cardId',
					key       : 'cardId',
					title     : '会员卡号',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'courseName',
					key       : 'courseName',
					title     : '课程',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'studyDate',
					key       : 'studyDate',
					title     : '日期',
					width     : 96
				},{
					dataIndex : 'time',
					key       : 'time',
					title     : '时间段',
					width     : 96,
					render    : ( text, record ) => (
						<span>{ !!record.startTime && !!record.endTime && record.startTime + '~' + record.endTime || '--' }</span>
					)
				},{
					dataIndex : 'clsName',
					key       : 'clsName',
					title     : '班级',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'mtNames',
					key       : 'mtNames',
					title     : '主教',
					width     : 68,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'roomName',
					key       : 'roomName',
					title     : '教室',
					width     : 68,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text }
						</Popover>
					)
				},{
					dataIndex : 'cost',
					key       : 'cost',
					title     : '消耗课时',
					width     : 96,
				},{
					dataIndex : 'fix',
					key       : 'fix',
					title     : '固定位',
					width     : 82,
					render    : ( text, record ) => (
						<span>{ text == '1' ? '是' : '否' }</span>
					)
				},{
					dataIndex : 'signType',
					key       : 'signType',
					title     : '状态',
					width     : 68,
//					render    : ( text, record ) => (
//						<span>{ text == '1' ? '预约' : text  == '2' ? '排队' : text == '3' ? '出勤' : text == '4' ? '请假' : text == '5' ? '旷课' : text == '6' ? '取消' : '' }</span>
//					)
                    render    : ( text, record ) => (
						<span>{ record.stuType == '3' ? ( text == '0' ? '取消' : text == '1' ? '预约' : text == '2' ? '已试听' : text == '3' ? '旷课' : '--' ) : (text == '1' ? '预约' : text  == '2' ? '排队' : text == '3' ? '出勤' : text == '4' ? '请假' : text == '5' ? '旷课' : text == '6' ? '取消' : '--') }</span>
					)
				}
            ],
            emptyText : '暂时没有数据',
        },
        pagination : {
            total            : orderClassResultCount,
            pageIndex        : orderClassPageIndex,
            pageSize         : orderClassPageSize,
            showTotal        : total => `总共 ${ total } 条`,
            showQuickJumper  : true,
            onChange         : orderClassPageIndexChange,
        }
    };

    return(
        <div className = { styles.Production_plan_inner_list } >
            <div className = { styles.stumanageProduction_plan_inner_list } >
				<OrderClassComponent { ...orderClassComponentProps } />
			</div>
        </div>
    );
}

export default OrderClassTab;
