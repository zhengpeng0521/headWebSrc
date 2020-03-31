/*********************
 * @author yhwu
 *
 *  约课课程表
 *  顶部操作区域
 *********************/
import React from 'react';
import moment from 'moment';
import { Popover, Button, Progress, Select, Radio } from 'antd';
import styles from './ScheduleOperation.less';
import TenantOrgFilter from '../../../../pages/common/tenant-org-filter/TenantOrgFilter';

const Option = Select.Option;
const ButtonGroup = Button.Group;
const RadioGroup  = Radio.Group;
const RadioButton = Radio.Button;

function ScheduleOperation({
	/*数据*/
	roomSelectList,                        //教室下拉列表
	teachSelectList,                       //老师下拉列表
	selectedTeacherKeys,                   //已选老师
	selectedRoomKeys,                      //已选教室
	orgId,                                 //当前校区id( 从localStorage获取缓存数据 )
	periodType,                            //按天按周展示

	/*方法*/
	changeTimeByDayAndWeek,                //上周 下周 前一天 后一天 切换

	scheduleTypeChange,                    //改变课程表维度
	scheduleType,                          //课程表维度( 日期, 日期+老师, 日期+教室 )
	teacherSelectFunc,                     //选中老师
	roomSelectFunc,                        //选中教室

	dayAndWeekChange,                      //按周按天展示切换

    JumpToPrintByDay                       //跳到按天打印课程表

}){
	let teachers = window.localStorage && window.localStorage.getItem('teachers[' + orgId + ']');        //前端缓存已选的老师
	let rooms    = window.localStorage && window.localStorage.getItem('rooms[' + orgId + ']');           //前端缓存已存的教室
	let teacherArrs = !!teachers && JSON.parse(teachers);    //解析json数据
	let roomArrs    = !!rooms && JSON.parse(rooms);          //解析json数据

    return (
        <div className = 'schedule_head' >
			{ periodType == 'perWeek' ?
				<ButtonGroup>
					<Button onClick = { () => changeTimeByDayAndWeek( 'lastWeek' ) } style = {{ width : '60px', padding : '0' }} >上周</Button>
					<Button onClick = { () => changeTimeByDayAndWeek( 'currWeek' ) } style = {{ width : '60px', padding : '0' }} >本周</Button>
					<Button onClick = { () => changeTimeByDayAndWeek( 'nextWeek' ) } style = {{ width : '60px', padding : '0' }} >下周</Button>
				</ButtonGroup>
				: periodType == 'perDay' ?
				<ButtonGroup>
					<Button onClick = { () => changeTimeByDayAndWeek( 'lastDay' ) } style = {{ width : '60px', padding : '0' }} >前一天</Button>
					<Button onClick = { () => changeTimeByDayAndWeek( 'currDay' ) } style = {{ width : '60px', padding : '0' }} >今天</Button>
					<Button onClick = { () => changeTimeByDayAndWeek( 'nextDay' ) } style = {{ width : '60px', padding : '0' }} >下一天</Button>
				</ButtonGroup>
				: null
			}
			<Select
				style = {{ width : '140px', marginLeft : '20px' }}
				placeholder = '显示类型'
				value = { scheduleType }
				onChange = { scheduleTypeChange }
			>
				<Option disabled = { periodType == 'perDay' } value = 'date'>日期</Option>
				<Option value = 'teacher'>日期+老师</Option>
				<Option value = 'room'>日期+教室</Option>
			</Select>
			{ scheduleType == 'teacher' &&
				<Select
					style = {{ width : '340px', marginLeft : '10px', top : '1px' }}
					onChange = { teacherSelectFunc }
					defaultValue = { teacherArrs || selectedTeacherKeys }
					placeholder = '选择老师'
					mode = 'multiple'
				>
					{ !!teachSelectList && teachSelectList.map(function( item, index ){
						return ( <Option key = { 'order_class_schedule_teacher_' + item.userId } value = { item.userId + '' } >{ item.userName }</Option> )
					})}
				</Select>
			}
			{ scheduleType == 'room' &&
				<Select
					style = {{ width : '340px', marginLeft : '10px', top : '1px' }}
					onChange = { roomSelectFunc }
					defaultValue = { roomArrs || selectedRoomKeys }
					placeholder = '选择教室'
					mode = 'multiple'
				>
					{ !!roomSelectList && roomSelectList.map(function( item, index ){
						return ( <Option key = { 'order_class_schedule_room_' + item.id } value = { item.id + '' } >{ item.name }</Option> )
					})}
				</Select>
			}
			<RadioGroup style = {{ float : 'right' }} onChange = { dayAndWeekChange } defaultValue = 'perWeek' >
				<RadioButton value = { 'perDay' } >按天</RadioButton>
				<RadioButton value = { 'perWeek' } >按周</RadioButton>
			</RadioGroup>
            <div style = {{ float : 'right' , marginRight : 20 }}>
                <Button type = 'primary' onClick = { JumpToPrintByDay }>按天打印课程表</Button>
            </div>
        </div>
    );
}

export default ScheduleOperation;
