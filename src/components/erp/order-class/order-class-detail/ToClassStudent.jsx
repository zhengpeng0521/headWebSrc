import React from 'react';
import ToClassStudentComponent from '../../../common/new-component/manager-list/ManagerList';
import { Icon, Popover, Checkbox, Popconfirm } from 'antd';
import { StatusFlag, NewModal } from '../../../common/new-component/NewComponent';

function ToClassStudent({
	toClassStuDataSource,
	toClassStuLoading,
	currentDate,
	currentItem,

	cancelToClassStudent,
	leaveClass,
	isCheckUpdate            //回访确认

}){
	let studyDate = !!!!currentItem && currentItem.studyDate;
	let disabled = studyDate < currentDate;

	let toClassStudentProps = {
		table : {
			isInDetail    : true,
			height        : 363,
            loading       : toClassStuLoading,
            dataSource    : toClassStuDataSource,
			xScroll       : 1308,
            columns : [
                {
					dataIndex : 'operation',
					key       : 'operation',
					title     : '操作',
					render    : ( text, record ) => (
						<div>
							{ !!record && record.sign_type != '6' &&
								<Popconfirm title = "确认要取消么?" onConfirm = { () => cancelToClassStudent( record.id, '6' ) } okText = "确定" cancelText = "取消">
									<a style = {{ marginRight : '10px' }} disabled = { disabled }>取消</a>
								</Popconfirm>
							}
							{ !!record && record.sign_type != '4' && record.sign_type != '3' &&
								<Popconfirm title = "确认要请假么?" onConfirm = { () => cancelToClassStudent( record.id, '4' ) } okText = "确定" cancelText = "取消">
									<a style = {{ marginRight : '10px' }} disabled = { disabled }>请假</a>
								</Popconfirm>

							}
							{ !!record && record.is_check != '1' &&
								<Popconfirm title = "确认要回访确认么?" onConfirm = { () => isCheckUpdate( record.id ) } okText = "确定" cancelText = "取消">
									<a disabled = { disabled }>回访确认</a>
								</Popconfirm>
							}
						</div>
					)
				},{
					dataIndex : 'name',
					key       : 'name',
					title     : '学员姓名',
					width     : 150,
					render    : ( text, record ) => (
						<span>
							{ text || '' }
							{ !!record && record.isBirthday == '1' &&
								<span style = {{ marginLeft : '10px', display : 'inline-block', width : '14px', height : '14px', background : 'url("https://img.ishanshan.com/gimg/img/ac568b9d045c4b79dd24a1958b44e993")', position : 'relative', top : '1px' }}></span>
							}
							{ !!record && record.isFirst == '1' &&
								<span style = {{ marginLeft : '10px', display : 'inline-block', width : '14px', height : '14px', background : 'url("https://img.ishanshan.com/gimg/img/f969de45f4b30cd0abf0f767d83a453b")', position : 'relative', top : '2px' }}></span>
							}
						</span>
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
					width     : 112,
					render    : ( text, record ) => (
						<Popover placement = 'top' content = { text } trigger = 'hover' >
							{ text || '' }
						</Popover>
					)
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
					width     : 82,
					render    : ( text, record ) => (
						<span>{ text == '1' ? '是' : '否' }</span>
					)
				},{
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
					dataIndex : 'is_check',
					key       : 'is_check',
					title     : '回访确认',
					width     : 96,
					render    : ( text, record ) => (
						<div style = {{ background : text == '1' ? "url('https://img.ishanshan.com/gimg/img/f1e3ebaa34addae8cbf77eb9203d42da')" : '', width : '13px', height : '13px', display : 'inline-block' }}></div>
					)
				}
            ],
         }
	}

	return (
		<ToClassStudentComponent { ...toClassStudentProps } />
	)
}

export default ToClassStudent;
