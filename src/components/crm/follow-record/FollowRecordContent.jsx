import React from 'react';
import { Form, Button, Input, Select, Icon, Pagination, Popconfirm } from 'antd';
import { NullData } from '../../common/new-component/NewComponent';
import styles from './FollowRecordContent.less';

function FollowRecordContent({
	dataSource,
	pageSize,
	pageIndex,
	resultCount,

	selectedId,
	selectedItem,

	pageIndexChange,
	changeListItem,

}) {

	let pagination = {
		total: resultCount,
		pageIndex: pageIndex,
		pageSize: pageSize,
		onChange: pageIndexChange
	}

	let sex = !!selectedItem && selectedItem.sex;
	let cardList = [];
	!!dataSource && dataSource.length > 0 && dataSource.map(function (item, index) {
		cardList.push(
			<div
				key={'card_list_' + item.id}
				className={item.id == selectedId ? 'follow_record_list_item follow_record_list_item_selected' : 'follow_record_list_item'}
				onClick={() => changeListItem(item)}
			>
				<div className='follow_record_img'>
					<img src={!!item && item.sex == '1' ? 'https://img.ishanshan.com/gimg/img/d75fdb312bbaca043a97d24c5453a337' : item.sex == '2' ? 'https://img.ishanshan.com/gimg/img/ad8cc625441146bdf8e373dec1cd600f' : 'https://img.ishanshan.com/gimg/img/e51c6060b326c9cf12ddb4f1c4e12443'} />
					{/* <span className= { item.id == selectedId ? 'active_span' : 'span_name' }>潜在学员 </span> */}
					{item.sourceType == '0' ? <span className={item.id == selectedId ? 'active_span' : 'span_name'}>潜在学员 </span> : item.sourceType == '1' ? <span className={item.id == selectedId ? 'active_span' : 'span_name'}>在读学员 </span> : <span className={item.id == selectedId ? 'active_span' : 'span_name'}>往期学员 </span>}
				</div>
				<div className='follow_record_text follow_record_name'>
					{item.stuName || '暂无'}
				</div>
				<div className='follow_record_text follow_record_time'>
					{item.createTime || '暂无'}
				</div>
				<div className='follow_record_text follow_record_person'>
					{'跟进人 : ' + (item.uname || '暂无')}
				</div>
				<div className='follow_record_text follow_record_parent'>
					{'跟进家长 : ' + (item.parentName || '暂无')}
				</div>
			</div>
		)
	})

	return (
		<div className='follow_record_content'>
			<div className='follow_record_content_left'>
				{cardList && cardList.length > 0 ?
					<div style={{ padding: '20px', overflowX: 'hidden', overflowY: 'auto', maxHeight: 'calc(100% - 50px)' }}>
						{cardList}
					</div>
					:
					<NullData height='inherit' />
				}
				{cardList && cardList.length > 0 &&
					<div className='card_pagination'>
						<Pagination {...pagination} current={parseInt(pageIndex) + 1} />
					</div>
				}
			</div>
			<div className='follow_record_content_right'>
				<div className='follow_record_right_img'>
					<img src={sex == '1' ? 'https://img.ishanshan.com/gimg/img/d75fdb312bbaca043a97d24c5453a337' : sex == '2' ? 'https://img.ishanshan.com/gimg/img/ad8cc625441146bdf8e373dec1cd600f' : 'https://img.ishanshan.com/gimg/img/e51c6060b326c9cf12ddb4f1c4e12443'} />
				</div>
				<div className='right_name'>
					{!!selectedItem && selectedItem.stuName || '暂无'}
					{sex == '1' ? <Icon className='right_sex' type='boy' style={{ color: '#5d9cec' }} /> : sex == '2' ?
						<Icon className='right_sex' type='girl' style={{ color: '#ff7f75' }} /> : null
					}
				</div>
				<ul className='right_detail'>
					<li>
						<span className='right_detail_title'>跟进时间 : </span>
						<span className='right_detail_content'>{!!selectedItem && selectedItem.createTime || '暂无'}</span>
					</li>
					<li>
						<span className='right_detail_title'>跟进家长 : </span>
						<span className='right_detail_content'>{!!selectedItem && selectedItem.parentName || '暂无'}</span>
					</li>
					<li>
						<span className='right_detail_title'>跟进方式 : </span>
						<span className='right_detail_content'>{!!selectedItem && selectedItem.typeValue || '暂无'}</span>
					</li>
					<li>
						<span className='right_detail_title'>所属校区 : </span>
						<span className='right_detail_content'>{!!selectedItem && selectedItem.orgName || '暂无'}</span>
					</li>
					<li>
						<span className = 'right_detail_title'>收集人 : </span>
						<span className = 'right_detail_content'>{ !!selectedItem && selectedItem.collectName || '暂无' }</span>
					</li>
				</ul>
				<div className='card_detail_line'></div>
				<div className='card_detail_record'>
					{!!selectedItem && selectedItem.content || '暂无'}
				</div>
			</div>
		</div>
	)
}

export default FollowRecordContent;
