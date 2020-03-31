import React from 'react';
import LineStudentComponent from '../../../common/new-component/manager-list/ManagerList';
import { Icon, Popover, Checkbox, Popconfirm } from 'antd';

function MulStudentList({
	mulStudentDataSource,
	mulStudentLoading,


//	lineStuDataSource,
//	lineStuLoading,
//
//	cancelLineStudent,
//	turnToClass

}){
	let mulStudentListProps = {
		table : {
			isInDetail    : true,
			height        : 363,
            loading       : mulStudentLoading,
            dataSource    : mulStudentDataSource,
			xScroll       : 956,
            columns : [
                {
					dataIndex : 'sign_type',
					key       : 'sign_type',
					title     : '状态',
					width     : 96,
					render    : ( text, record ) => (
						<span>
							{ !!text && text == '1' ? '预约' : text == '2' ? '排队' : text == '3' ? '出勤' : text == '4' ? '请假' : text == '5' ? '旷课' : text == '6' ? '取消' : '' }
						</span>
					)
				},{
					dataIndex : 'name',
					key       : 'name',
					title     : '学员姓名',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text || '' }
						</Popover>
					)
				},{
					dataIndex : 'nickname',
					key       : 'nickname',
					title     : '昵称',
					width     : 82
				},{
					dataIndex : 'birthday',
					key       : 'birthday',
					title     : '出生日期',
					width     : 96,
				},{
					dataIndex : 'mobile',
					key       : 'mobile',
					title     : '联系方式',
					width     : 112,
				},{
					dataIndex : 'monthAge',
					key       : 'monthAge',
					title     : '月龄',
					width     : 82,
				},{
					dataIndex : 'yearAge',
					key       : 'yearAge',
					title     : '年龄',
					width     : 82,
				},{
					dataIndex : 'sellerName',
					key       : 'sellerName',
					title     : '负责销售',
					width     : 96,
				},{
					dataIndex : 'counselorName',
					key       : 'counselorName',
					title     : '负责顾问',
					width     : 96,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text || '' }
						</Popover>
					)
				},{
					dataIndex : 'periodLeft',
					key       : 'periodLeft',
					title     : '剩余课时',
					width     : 82,
				},{
					dataIndex : 'fix',
					key       : 'fix',
					title     : '固定位',
					width     : 96,
					render    : ( text, record ) => (
						<span>{ text == '1' ? '是' : '否' }</span>
					)
				}
            ],
         }
	}

	return (
		<LineStudentComponent { ...mulStudentListProps } />
	)
}

export default MulStudentList;
