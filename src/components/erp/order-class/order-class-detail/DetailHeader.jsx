import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover, Button, Menu, Dropdown } from 'antd';
import styles from './DetailHeader.less';
const ButtonGroup = Button.Group;
const MenuItem = Menu.Item;

function DetailHeader({
	/*方法*/
	closeDetail,
	onceOrderClassClick,          //单次约课
	batchOrderClassClick,         //批量约课
	orderMissClassClick,          //预约补课
	subscribeClassClick,          //预约试听

	currentItem,
	currentDate

}){
	let studyDate = !!!!currentItem && currentItem.studyDate;
	let disabled = studyDate < currentDate;
	return (
        <div className = { styles.header_wrap } >
			<span className = { styles.detail_title } >约课详情<span className = { styles.detail_time } >{ !!currentItem && currentItem.studyDate + ' ' + currentItem.startTime + ' ~ ' + currentItem.endTime }</span></span>
			<div className = { styles.close_detail }>
				<Icon onClick = { closeDetail } style = {{ fontSize : '14px' , cursor : 'pointer' }} type = { 'close' } />
			</div>
			<ul className = 'order_detail_content' >
				<li>标题 :&nbsp;
					<Popover placement = "topLeft" content = { !!currentItem && currentItem.title } trigger = 'hover' >
						<span>{ !!currentItem && currentItem.title }</span>
					</Popover>
				</li>
				<li>课程名称 :&nbsp;
					<Popover placement = "topLeft" content = { !!currentItem && currentItem.courseName } trigger = 'hover' >
						<span>{ !!currentItem && currentItem.courseName }</span>
					</Popover>
				</li>
				<li>所属校区 :&nbsp;
					<Popover placement = "topLeft" content = { !!currentItem && currentItem.orgName } trigger = 'hover' >
						<span>{ !!currentItem && currentItem.orgName }</span>
					</Popover>
				</li>
				<li>主教 :&nbsp;
					<Popover placement = "topLeft" content = { !!currentItem && currentItem.mtnames } trigger = 'hover' >
						<span>{ !!currentItem && currentItem.mtnames }</span>
					</Popover>
				</li>
				<li>教室 :&nbsp;
					<Popover placement = "topLeft" content = { !!currentItem && currentItem.roomName } trigger = 'hover' >
						<span>{ !!currentItem && currentItem.roomName }</span>
					</Popover>
				</li>
				<li>消耗课时 :&nbsp;
					<span>{ !!currentItem && currentItem.cost }</span>
				</li>
				<li>上课人数 :&nbsp;
					<span>{ !!currentItem && currentItem.num + '/' + currentItem.maxNum + ' (' + ( !!currentItem && currentItem.lineStuList && currentItem.lineStuList.length || 0 ) + ')'  }</span>
				</li>
				<li>补课人数 :&nbsp;
					<span>{ !!currentItem && ( ( currentItem.mulNum || 0 ) + '/' + ( currentItem.maxMulNum || 0 ) ) }</span>
				</li>
				<li>试听人数 :&nbsp;
					<span>{ !!currentItem && currentItem.tryNum + '/' + currentItem.maxTryNum }</span>
				</li>
			</ul>
			<div className = { styles.btn_group }>
				<Button disabled = { disabled } type = 'primary' style = {{ marginRight : '20px' }} onClick = { onceOrderClassClick }>单次约课</Button>
				<Button disabled = { disabled } type = 'primary' style = {{ marginRight : '20px' }} onClick = { batchOrderClassClick } >批量约课</Button>
				<Button disabled = { disabled } type = 'primary' style = {{ marginRight : '20px' }} onClick = { orderMissClassClick } >预约补课</Button>
				<Button disabled = { disabled } type = 'primary' onClick = { subscribeClassClick } >预约试听</Button>
			</div>
		</div>
    )
};

export default DetailHeader;
