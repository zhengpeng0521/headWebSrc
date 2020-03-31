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

	deleteParent,            //删除家长
	leaderTurnRecord,        //名单转化记录

	updateParent,            //编辑家长详情

}){

	//操作
	function onSelect( item, key, selectedKeys ){
		if( item.key == '1' ){
			deleteParent();
		}else if( item.key == '2' ){
			leaderTurnRecord();
		}
	}

	const menu = (
		<Menu
			onSelect = { onSelect }
			style = {{ width: 100 }}
			selectedKeys = { [] }
		>
		</Menu>
	);

	let bandStatus = !!currentItem && currentItem.bandStatus;

    return (
        <div className = { styles.header_wrap } >
            <div className = { styles.header_wrap_top }>
                <div className={ styles.header_wrap_top_left }>
                    <img src='https://img.ishanshan.com/gimg/img/6ba0a7a868a2bb02d6c3aaa299d1fd04' className={styles.header_wrap_top_left_img}/>
                    <div className = { styles.header_wrap_top_left_title }>家长</div>
                </div>
                <div className={ styles.header_wrap_top_right }>
                    <Button type = 'primary' style = {{ marginRight : 20 , width : 68 }} onClick = { updateParent }>编辑</Button>
                    <Icon type="close" onClick={closeDetail}/>
                </div>
            </div>
			<div className = { styles.detail_content } >
				<p>
                    <span>家长姓名：</span>
					<Popover placement = 'left' content = { !!currentItem && currentItem.name || '--' } trigger = 'hover' >
						{ !!currentItem && currentItem.name || '--' }
					</Popover>
				</p>
				<p>
					<span>联系手机：</span>
					<Popover placement = 'left' content = { !!currentItem && currentItem.mobile || '--' } trigger = 'hover' >
						{ !!currentItem && currentItem.mobile || '--' }
					</Popover>
				</p>
				<p>
					<span>单位：</span>
					<Popover placement = 'left' content = { !!currentItem && currentItem.workUnit } trigger = 'hover' >
				        { !!currentItem && currentItem.workUnit || '--' }
					</Popover>
				</p>
				<p>
					<span>邮箱：</span>
					<Popover placement = 'left' content = { !!currentItem && currentItem.email } trigger = 'hover' >
                         { !!currentItem && currentItem.email || '--' }
					</Popover>
				</p>
				<p>
					<span>绑定微信：</span>
					<span>
						{ bandStatus == '0' ? '未绑定' : bandStatus == '1' ? '已绑定' : '' }
					</span>
				</p>
			</div>
		</div>
    )
};

export default DetailHeader;
