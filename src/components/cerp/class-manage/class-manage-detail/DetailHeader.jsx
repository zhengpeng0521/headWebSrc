import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover, Button, Menu, Dropdown } from 'antd';
import styles from './DetailHeader.less';
const ButtonGroup = Button.Group;
const MenuItem = Menu.Item;

function DetailHeader({
	currentItem,

	closeDetail,          //关闭详情
	editClass,            //编辑班级
	deleteClassItem       //删除班级
}){

	function onSelect( key ){
		if( key == '1' ){
			deleteClassItem( currentItem.clsId, currentItem.orgId )
		}
	}

	const menu = (
		<Menu
			onSelect = { onSelect }
			style = {{ width: 100 }}
			selectedKeys = { [] }
		>
			<MenuItem key = '1' >删除此班级</MenuItem>
		</Menu>
	);
    return (
        <div className = { styles.header_wrap } >
            <div className = { styles.header_wrap_top }>
                <div className={ styles.header_wrap_top_left }>
                    <img src='https://img.ishanshan.com/gimg/img/eb51ca21d2b7cee45a97df5a24faf1fd' className={styles.header_wrap_top_left_img}/>
                    <div className = { styles.header_wrap_top_left_title } >班级</div>
                </div>
                <div className={ styles.header_wrap_top_right }>
                    <Button type= 'primary' onClick = { editClass } style = {{ width : 68 , marginRight : 20 }}>编辑</Button>
                    <ButtonGroup style = {{ marginRight : 20 , color : '#5d9cec' }} >
                        <Button className={ styles.radio_button_group } style = {{ width : 60 }} onClick = {() => onSelect('1')}>删除</Button>
                    </ButtonGroup>
                    <Icon type="close" onClick = { closeDetail }/>
                </div>
            </div>
			<div className = { styles.detail_content } >
				<p>
                    <span>班级名称：</span>
					<Popover placement = 'left' content = { currentItem.name || '--' } trigger = 'hover' >
						{ currentItem.name || '--' }
					</Popover>
				</p>
				<p>
					<span>所属课程：</span>
					<Popover placement = 'left' content = { currentItem.courseName || '--' } trigger = 'hover' >
				        { currentItem.courseName || '' }
					</Popover>
				</p>
				<p>
					<span>主教：</span>
					<Popover placement = 'left' content = { currentItem.mainTeacherNames || '--' } trigger = 'hover' >
				        { currentItem.mainTeacherNames || '--' }
					</Popover>
				</p>
				<p>
					<span>助教：</span>
					<Popover placement = 'left' content = { currentItem.assistanTeacherNames || '--' } trigger = 'hover' >
				        { currentItem.assistanTeacherNames || '--' }
					</Popover>
				</p>
				<p>
					<span>人数：</span>
					<span style = {{ width : '50px' }}>
						{ currentItem.classStuNum + '/' + currentItem.maxNum }
					</span>
				</p>
            </div>
		</div>
    )
};

export default DetailHeader;
