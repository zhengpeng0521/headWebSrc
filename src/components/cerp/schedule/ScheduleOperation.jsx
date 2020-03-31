/**
 * @author yhwu
 *
 * 课程表
 * 顶部操作区域
 */

import React from 'react';
import moment from 'moment';
import styles from './ScheduleOperation.less';
import { Popover, Button, Progress, Select } from 'antd';
import TenantOrgFilter from '../../../pages/common/tenant-org-filter/TenantOrgFilter';
const ButtonGroup = Button.Group;
const Option = Select.Option;

function ScheduleOperation({

	lastWeekClick,                         //上周
	currentWeekClick,                      //本周
	nextWeekClick,                         //下周


	scheduleTypeChange,                    //改变课程表类型
	scheduleType,                          //课程表类型
	teacherSelectFunc,
	roomSelectFunc,

	roomSelectList,                        //教室下拉列表
	teachSelectList,                       //老师下拉列表

	selectedTeacherKeys,                   //已选老师
	selectedRoomKeys,                      //已选教室

	orgId,
	orgFilterChange,
	createAble

}){
	let teachers = window.localStorage && window.localStorage.getItem('teachers[' + orgId + ']');
	let rooms = window.localStorage && window.localStorage.getItem('rooms[' + orgId + ']');
	let teacherArrs = !!teachers && JSON.parse(teachers);
	let roomArrs = !!rooms && JSON.parse(rooms);

    return (
        <div className = 'schedule_head' >
        	<ButtonGroup>
				<Button onClick = { lastWeekClick } style = {{ width : '60px', padding : '0' }} >上周</Button>
				<Button onClick = { currentWeekClick } style = {{ width : '60px', padding : '0' }} >本周</Button>
				<Button onClick = { nextWeekClick } style = {{ width : '60px', padding : '0' }} >下周</Button>
			</ButtonGroup>
			<Select
				style = {{ width : '140px', marginLeft : '20px' }}
				placeholder = '显示类型'
				value = { scheduleType }
				onChange = { scheduleTypeChange }
			>
				<Option value = 'date' >日期</Option>
				<Option value = 'teacher' >日期+老师</Option>
				<Option value = 'room' >日期+教室</Option>
			</Select>
			{ scheduleType == 'teacher' &&
				<Select
					style = {{ width : '340px', marginLeft : '10px' }}
					placeholder = '选择老师'
					mode = 'multiple'
					onChange = { teacherSelectFunc }
					defaultValue = { teacherArrs || selectedTeacherKeys }
				>
					{ !!teachSelectList && teachSelectList.map(function( item, index ){
						return ( <Option key = { 'schedule_teacher_' + item.userId } value = { item.userId + '' } >{ item.userName }</Option> )
					})}
				</Select>
			}
			{ scheduleType == 'room' &&
				<Select
					style = {{ width : '340px', marginLeft : '10px' }}
					placeholder = '选择教室'
					mode = 'multiple'
					onChange = { roomSelectFunc }
					defaultValue = { roomArrs || selectedRoomKeys }
				>
					{ !!roomSelectList && roomSelectList.map(function( item, index ){
						return ( <Option key = { 'schedule_room_' + item.id } value = { item.id + '' } >{ item.name }</Option> )
					})}
				</Select>
			}
			{ !!createAble &&
				<div style = {{ float : 'right' }} key = "schedule_org_filter_content" >
					<TenantOrgFilter value = { orgId } onChange = { orgFilterChange } />
				</div>
			}
        </div>
    );
}

export default ScheduleOperation;
