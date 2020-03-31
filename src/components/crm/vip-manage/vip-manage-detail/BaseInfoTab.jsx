import React from 'react';
import { Modal, Button, Rate, Popover } from 'antd';
import moment from 'moment';
import styles from './BaseInfoTab.less';

function VipCardTab({
	baseInfo
}){
	let results = baseInfo.results || [];
	let data = baseInfo.data || {};
    return (
		<div>
			<div className = { styles.vip_card_info } >
				<div className = { styles.vip_card_id }>
					<span style = {{ color : '#999' }}>会员卡号 : </span>
					<span>{ !!data.cardId && data.cardId || '--' }</span>
				</div>
				<div className = { styles.vip_card_time }>
					<span style = {{ color : '#999' }}>创建时间 : </span>
					<span>{ data.createTime }</span>
				</div>
			</div>
			<div className = { styles.vip_card_money }>
				<span style = {{ color : '#999' }}>余额 : </span>
				<span>{ data.balance || '0.00' }</span>
			</div>
			<div className = { styles.class_compose_table }>
				<div className = { styles.table_header }>
					<p className = { styles.table_header_item }>课时类型</p>
					<p className = { styles.table_header_item }>剩余课时</p>
					<p className = { styles.table_header_item }>已预约课时</p>
					<p className = { styles.table_header_item }>可用课时</p>
				</div>
				{ !!results && results.map( function( item, index ){
					return (
						<div key = { 'table_content_item_' + index } className = { styles.table_content_item }>
							<p className = { styles.table_header_item }>
                                <Popover placement = 'left' content = { item.courseName || '--' }>{ item.courseName || '--' }</Popover>
                            </p>
							<p className = { styles.table_header_item }>
                                <Popover placement = 'left' content = { !!( item.periodPackage + item.periodExt ) && ( item.periodPackage + item.periodExt ).toFixed(2) || 0.00 }>
                                    { !!( item.periodPackage + item.periodExt ) && ( item.periodPackage + item.periodExt ).toFixed(2) || 0.00 }
                                </Popover>
                            </p>
							<p className = { styles.table_header_item }>
                                <Popover placement = 'left' content = { !!item.periodFreeze && item.periodFreeze.toFixed(2) || 0.00 }>{ !!item.periodFreeze && item.periodFreeze.toFixed(2) || 0.00 }</Popover>
                            </p>
							<p className = { styles.table_header_item }>
                                <Popover placement = 'left' content = { !!item.periodLeft && item.periodLeft.toFixed(2) || 0.00 }>{ !!item.periodLeft && item.periodLeft.toFixed(2) || 0.00 }</Popover>
                            </p>
						</div>
					)
				})}
			</div>
		</div>
    );
}

export default VipCardTab;
