import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover, Tabs, Button, Modal } from 'antd';
import OrderRecordSearchComponent from '../../../common/new-component/manager-list/ManagerList';
import SuperSearch from '../../../common/new-component/super-search/SuperSearch';

function OrderRecordSearch({
	searchFunction,
	clearFunction,

	courseList,
	classRoomList,
	teacherList,

	/*高级搜索*/
	searchVisible,
	superSearchClick,
	onSuperSearch,
	onSuperClear

}){
	let orderRecordSearchComponentProps = {
		search : {
            onSearch  : searchFunction,
            onClear   : clearFunction,
            fields : [
				{
                    key         : 'dept_org',
                    type        : 'dept_org'
                },{
					key         : 'stuName',
					type        : 'input',
					placeholder : '学员名称',
				},{
                    key         : 'courseName',
					type        : 'input',
					placeholder : '课程名称',
                }
            ]
        },
		rightBars : {
			isSuperSearch      : true,
			superSearch        : superSearchClick,
			superSearchVisible : searchVisible,
		}
	}

	let superSearchProps = {
		searchVisible : searchVisible,
		closeSearch   : superSearchClick,
		onSearch      : onSuperSearch,
		onClear       : onSuperClear,
		fields        : [
			{
				key         : 'roomName',
				type        : 'input',
				label       : '教室',
				placeholder : '教室名称',
			},{
                key         : 'mtName',
                type        : 'input',
                label       : '主教',
                placeholder : '主教',
            },{
				key         : 'startTime',
				type        : 'timePicker',
				placeholder : '选择开始时间',
				label       : '开始时间'
			},{
				key         : 'endTime',
				type        : 'timePicker',
				placeholder : '选择结束时间',
				label       : '结束时间'
			},{
				key         : 'signType',
				type        : 'select',
				placeholder : '状态',
				label       : '状态',
                options     : [
                    { label : '出勤' , key : '3' },
                    { label : '请假' , key : '4' },
                    { label : '旷课' , key : '5' },
                    { label : '取消' , key : '6' },
                    { label : '预约' , key : '1' },
                    { label : '排队' , key : '2' }
                ],
			}
		]
	}
	return(
		<div>
			<OrderRecordSearchComponent { ...orderRecordSearchComponentProps } />
			<SuperSearch { ...superSearchProps } />
		</div>
	)
}

export default OrderRecordSearch;
