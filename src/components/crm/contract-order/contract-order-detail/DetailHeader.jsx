import React from 'react';
import QueueAnim from 'rc-queue-anim';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Icon, Popover, Button, Menu, Dropdown, Popconfirm , Radio } from 'antd';
import styles from './DetailHeader.less';
const ButtonGroup = Button.Group;
const MenuItem = Menu.Item;

function DetailHeader({
	closeDetail,
	currentItem,

	printContractOrder,            //打印合同订单
	checkContractOrder,            //审核合同订单
	receiptContractOrder,          //收款合同订单
	deleteContractOrder,           //删除合同订单

	updateContractOrder            //编辑合同订单

}){
	let orderState = !!currentItem && currentItem.orderState || undefined;
	let receiptStatus = !!currentItem && currentItem.receiptStatus || undefined;
	let disabled = !!currentItem && ( currentItem.orderState == '1' || currentItem.orderState == '3');
	function onSelect( key ){
		if( key == '1' ){
			printContractOrder();
		}
	}

//	const menu = (
//		<Menu
//			onSelect = { onSelect }
//			style = {{ width: 100 }}
//			selectedKeys = { [] }
//		>
//			{ !!currentItem && currentItem.receiptStatus == '1' && currentItem.orderState == '4' &&
//				<MenuItem key = '1' >打印</MenuItem>
//			}
//			{ !!currentItem && currentItem.orderState == '1' && currentItem.receiptStatus == '0' &&
//				<MenuItem key = '2' >
//					<Popconfirm title = '确认删除么?' onConfirm = { deleteContractOrder } okText = '确认' cancelText = '取消' >
//						<div>删除</div>
//					</Popconfirm>
//				</MenuItem>
//			}
//		</Menu>
//	);
    return (
        <div className = { styles.header_wrap } >
            <div className = { styles.header_wrap_top }>
                <div className={ styles.header_wrap_top_left }>
                    <img src='https://img.ishanshan.com/gimg/img/eb51ca21d2b7cee45a97df5a24faf1fd' className={styles.header_wrap_top_left_img}/>
                    <div className = { styles.header_wrap_top_left_title } >合同订单</div>
                </div>
                <div className={ styles.header_wrap_top_right }>
                    <Icon type="close" onClick = { closeDetail }/>
                </div>
            </div>
			<div className = { styles.detail_content } >
				<p>
                    <span>合同编号：</span>
					<Popover placement = 'left' content = { !!currentItem && currentItem.orderNum } trigger = 'hover' >
						{ !!currentItem && currentItem.orderNum || '' }
					</Popover>
				</p>
				<p>
					<span>审核状态：</span>
					<span style = {{ width : '40px' }}>
						{ ( orderState == '0' ? '无效' : orderState == '1' ? '未审核' : orderState == '3' ? '未通过' : orderState == '4' ? '已审核' : '暂无') || '暂无' }
					</span>
				</p>
				<p>
					<span>收款状态：</span>
					<span style = {{ width : '40px' }}>
						{ ( receiptStatus == '0' ? '未收款' : receiptStatus == '1' ? '已收款' : '暂无' ) || '暂无' }
					</span>
				</p>
				<p>
					<span>创建人：</span>
					<Popover placement = 'left' content = { !!currentItem && currentItem.orderCreatePerson } trigger = 'hover' >
				        { !!currentItem && currentItem.orderCreatePerson }
					</Popover>
				</p>
			</div>
		</div>
    )
};

export default DetailHeader;
