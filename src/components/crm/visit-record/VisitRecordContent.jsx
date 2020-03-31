import React from 'react';
import { Form, Button, Input, Select, Icon, Pagination, Popconfirm } from 'antd';
import { StatusFlag , NullData } from '../../common/new-component/NewComponent';

function VisitRecordContent({
	dataSource,
	pageSize,
	pageIndex,
	resultCount,

	selectedId,
	selectedItem,

	pageIndexChange,
	changeListItem,

}){

	let sex = !!selectedItem && selectedItem.sex;

	let pagination = {
		total            : resultCount,
		pageIndex        : pageIndex,
		pageSize         : pageSize,
		onChange         : pageIndexChange
	}

	let status = undefined;
	if( !!selectedItem ){
		status = selectedItem.status;
	}

	let cardList = [];
	!!dataSource && dataSource.length > 0 && dataSource.map(function( item, index ){
		cardList.push(
			<div
				key = { 'card_list_visit_' + item.id }
				className = { item.id == selectedId ? 'follow_record_list_item follow_record_list_item_selected' : 'follow_record_list_item' }
				onClick = { () => changeListItem( item ) }
			>
				<div className = 'follow_record_img'>
					<img src = { !!item && item.sex == '1' ? 'https://img.ishanshan.com/gimg/img/d75fdb312bbaca043a97d24c5453a337' : item.sex == '2' ? 'https://img.ishanshan.com/gimg/img/ad8cc625441146bdf8e373dec1cd600f' :  'https://img.ishanshan.com/gimg/img/e51c6060b326c9cf12ddb4f1c4e12443'}  />
			    {item.sourceType == '0'? <span className= { item.id == selectedId ? 'active_span' : 'span_name' }>潜在学员 </span> :item.sourceType == '1'?<span  className= { item.id == selectedId ? 'active_span' : 'span_name' }>在读学员 </span> : <span  className= { item.id == selectedId ? 'active_span' : 'span_name' }>往期学员 </span> }
				</div>
				<div className = 'follow_record_text follow_record_name'>
					{ item.stuName || '暂无' }
				</div>
				<div className = 'follow_record_text follow_record_time'>
					{ item.visitTime || '暂无' }
				</div>
				<div className = 'follow_record_text follow_record_person'>
					{ '跟进人 : ' + ( item.sellerName || '暂无' ) }
				</div>
			</div>
		)
	})
	return (
		<div className = 'follow_record_content'>
			<div className = 'follow_record_content_left'>
                { cardList && cardList.length > 0 ?
					<div style = {{ padding : '20px', overflowX : 'hidden', overflowY : 'auto', maxHeight: 'calc(100% - 50px)' }}>
						{ cardList }
					</div>
                    :
                    <NullData height = 'inherit'/>
                }
				{ cardList && cardList.length > 0 &&
					 <div className = 'card_pagination'>
                            <Pagination { ...pagination } current = { pageIndex + 1 } />
                        </div>
				}
			</div>
			<div className = 'follow_record_content_right'>
				<div className = 'follow_record_right_img'>
					<img src = { sex == '1' ? 'https://img.ishanshan.com/gimg/img/d75fdb312bbaca043a97d24c5453a337' : sex == '2' ? 'https://img.ishanshan.com/gimg/img/ad8cc625441146bdf8e373dec1cd600f' : 'https://img.ishanshan.com/gimg/img/6f1436b4c39b3afb25e5ac00509a5e64' } />
				</div>
				<div className = 'right_name'>
					{ !!selectedItem && selectedItem.stuName || '暂无' }
					{ sex == '1' ? <Icon className = 'right_sex' type = 'boy' style = {{ color : '#5d9cec' }} /> : sex == '2' ?
																	<Icon className = 'right_sex' type = 'girl' style = {{ color : '#ff7f75' }} /> : null
					}
				</div>
				<ul className = 'right_detail'>
					<li>
						<span className = 'right_detail_title'>到访时间 : </span>
						<span className = 'right_detail_content'>{ !!selectedItem && selectedItem.visitTime || '暂无' }</span>
					</li>
					<li>
						<span className = 'right_detail_title'>到访状态 : </span>
						<span className = 'right_detail_content'>{ status == '0' ? '已关闭' : status == '1' ? '已到访' : status == '2' ? '待跟进' : '暂无' }</span>
					</li>
					<li>
						<span className = 'right_detail_title'>跟进人 : </span>
						<span className = 'right_detail_content'>{ !!selectedItem && selectedItem.sellerName || '暂无' }</span>
					</li>
					<li>
						<span className = 'right_detail_title'>所属校区 : </span>
						<span className = 'right_detail_content'>{ !!selectedItem && selectedItem.orgName || '暂无' }</span>
					</li>
				</ul>
				<div className = 'card_detail_line'></div>
				<div className = 'card_detail_record'>
					{ !!selectedItem && selectedItem.content || '暂无' }
				</div>
			</div>
		</div>
	)
}

export default VisitRecordContent;
