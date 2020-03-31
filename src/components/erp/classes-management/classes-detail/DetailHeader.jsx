import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover, Button, Menu, Dropdown } from 'antd';
import styles from './DetailHeader.less';
const ButtonGroup = Button.Group;
const MenuItem = Menu.Item;

function DetailHeader({
	closeDetail,
	currentItem,

	updateClasses           //编辑班级

}){

	let orgName = !!currentItem && currentItem.orgName || '--';
	let courseType = !!currentItem && currentItem.courseType == '1' ? '主题式' : '渐进式';

	let mainTeachers = [];
	let assiTeachers = [];
	let teacherList = !!currentItem && currentItem.teacherList;
	!!teacherList && teacherList.length > 0 && teacherList.map( function( item, index ){
		if( item.prime == '1' ){
			mainTeachers.push( item.uname )
		}else if( item.prime == '0' ){
			assiTeachers.push( item.uname )
		}
	})
	let mainTeacherStr = mainTeachers.join(',');
	let assiTeacherStr = assiTeachers.join(',');

    return (
        <div className = { styles.header_wrap } >
			<span className = { styles.detail_title } >班级信息</span>
			<div className = { styles.close_detail }>
				<Icon onClick = { closeDetail } style = {{ fontSize : '14px' , cursor : 'pointer' }} type = { 'close' } />
			</div>
			<div className = { styles.detail_content } >
				<div className = { styles.detail_content_item }>
					所属校区 :&nbsp;
					<Popover placement = 'topLeft' content = { orgName } trigger = 'hover' >
						<span style = {{ width : '150px' }}>{ orgName }</span>
					</Popover>
				</div>
				<div className = { styles.detail_content_item }>
					课程类型 :&nbsp;
					<span style = {{ width : '150px' }}>
						{ courseType }
					</span>
				</div>
				<div className = { styles.detail_content_item }>
					进度 :&nbsp;
					<span style = {{ width : '100px' }}>
						{ (!!currentItem && currentItem.progress + '/' + currentItem.maxProgress) || '--' }
					</span>
				</div>
				<div className = { styles.detail_content_item }>
					班级人数 :&nbsp;
					<span style = {{ width : '100px' }}>
						{ (!!currentItem && currentItem.stuNum + '/' + currentItem.maxStuNum) || '--' }
					</span>
				</div>
			</div>
			<div className = { styles.detail_content_angin } >
				<div className = { styles.detail_content_item }>
					班级名称 :&nbsp;
					<Popover placement = 'topLeft' content = { !!currentItem && currentItem.name || '--' } trigger = 'hover' >
						<span style = {{ width : '150px' }}>{ !!currentItem && currentItem.name || '--' }</span>
					</Popover>
				</div>
				<div className = { styles.detail_content_item }>
					所属课程 :&nbsp;
					<Popover placement = 'topLeft' content = { !!currentItem && currentItem.title || '--' } trigger = 'hover' >
						<span style = {{ width : '150px' }}>{ !!currentItem && currentItem.title || '--' }</span>
					</Popover>
				</div>
				<div className = { styles.detail_content_item }>
					主教 :&nbsp;
					<Popover placement = 'topLeft' content = { mainTeacherStr || '--' } trigger = 'hover' >
						<span style = {{ width : '100px' }}>
							{ mainTeacherStr || '--' }
						</span>
					</Popover>
				</div>
				<div className = { styles.detail_content_item }>
					助教 :&nbsp;
					<Popover placement = 'topLeft' content = { assiTeacherStr || '--' } trigger = 'hover' >
						<span style = {{ width : '100px' }}>
							{ assiTeacherStr || '--' }
						</span>
					</Popover>
				</div>
			</div>
			<ButtonGroup className = { styles.button_group } >
				<Button style = {{ width : '80px' }} type= 'primary' onClick = { updateClasses } >编辑</Button>
			</ButtonGroup>
		</div>
    )
};

export default DetailHeader;
