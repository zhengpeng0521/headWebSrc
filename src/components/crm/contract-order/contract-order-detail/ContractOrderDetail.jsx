import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Icon, Popover, Button, Modal, Input } from 'antd';
import styles from './ContractOrderDetail.less';

function ContractOrderDetail({
	currentItem,
	contractOrderDetail
}){

	let type = !!contractOrderDetail && contractOrderDetail.type;
	let stuOldNew = !!contractOrderDetail && contractOrderDetail.stuOldNew;
	let stuInfo = contractOrderDetail.stuInfo;
	let classpkg = contractOrderDetail.classpkg;
	let teachTools = contractOrderDetail.teachTools;
	let saleUser = contractOrderDetail.saleUser;

	function openContractPic( url ){
		window.open( url )
	}

    return (
        <div className = { styles.contract_order_wrap }>
			<p className = { styles.p }>
				<span className = { styles.item_label }>所属校区 : </span>
				<span className = { styles.item_text }>{ !!contractOrderDetail && contractOrderDetail.orgName || '' }</span>
			</p>
            <p className = { styles.p }>
				<span className = { styles.item_label }>合同编号 : </span>
				<span className = { styles.item_text }>{ !!contractOrderDetail && contractOrderDetail.orderNum || '' }</span>
			</p>
            <p className = { styles.p }>
				<span className = { styles.item_label }>学员姓名 : </span>
				{ !!stuInfo && stuInfo.map(function( item, index ){
					return ( <span key = { 'order_detail_stu' + index } style = {{ marginRight : '5px' }} className = { styles.item_text }>{ item.stuName || '' }</span> )
				})}

			</p>
            {!!type && type != '3' ? <p className = { styles.p }>
				<span className = { styles.item_label }>会员卡号 : </span>
				<span className = { styles.item_text }>{ !!contractOrderDetail && contractOrderDetail.stuCardId || '' }</span>
			</p> : null}
			<p className = { styles.p }>
				<span className = { styles.item_label }>签约家长 : </span>
				<span className = { styles.item_text }>{ !!contractOrderDetail && contractOrderDetail.parentName || '' }</span>
			</p>

		    <p className = { styles.p }>
				<span className = { styles.item_label }>合同期限 : </span>
				<span className = { styles.item_text }>{ !!contractOrderDetail && contractOrderDetail.startTime && contractOrderDetail.endTime && contractOrderDetail.startTime + ' ~ ' + contractOrderDetail.endTime }</span>
			</p>
            {!!type && type != '3' ? <p className = { styles.p }>
				<span className = { styles.item_label }>是否过期 : </span>
				<span className = { styles.item_text }>{ !!contractOrderDetail && contractOrderDetail.expireInvalid=='1'?'是': '否' }</span>
			</p> : null}
			<p className = { styles.p }>
				<span className = { styles.item_label }>签订日期 : </span>
				<span className = { styles.item_text }>{ !!contractOrderDetail && contractOrderDetail.signTime }</span>
			</p>
			<p className = { styles.p }>
				<span className = { styles.item_label }>合同类型 : </span>
				<span className = { styles.item_text }>{ !!type && type == '1' ? '充值' : type == '2' ? '课时套餐' : type == '3' ? '托班套餐' : '' }</span>
			</p>
			<p className = { styles.p }>
				<span className = { styles.item_label }>购买类型 : </span>
				<span className = { styles.item_text }>{ !!stuOldNew && stuOldNew == '0' ? '新签约' : stuOldNew == '1' ? '续约' : '' }</span>
			</p>
			{ !!classpkg && classpkg.length > 0 &&
				<div className = { styles.class_package }>
					<span className = { styles.item_label } style = {{ verticalAlign : 'top' }}>商品 : </span>
						<ul className = { styles.class_package_item }>
							<li>
								<p style = {{ width : '140px' }}>{!!type && type != '3' ? '课时套餐' : '托班套餐'}</p>
								<p style = {{ width :  '100px' }}>标准价格</p>
								<p style = {{ width : '70px' }}>数量</p>
								<p style = {{ width : '100px' }}>合计价格</p>
								<p style = {{ width : '120px' }}>优惠</p>
								<p style = {{ width : '120px' }}>实收价格</p>
							</li>
					{ classpkg.map( function(item, index ){
						return ( <li key = { 'order_detail_class_' + index }>
									<p style = {{ width : '140px' }}>{ item.name }</p>
									<p style = {{ width :  '100px' }}>{ item.price }</p>
									<p style = {{ width : '70px' }}>{ item.amount }</p>
									<p style = {{ width : '100px' }}>{ item.totalPrice }</p>
									<p style = {{ width : '120px' }}>{ item.preferentialPrice }</p>
									<p style = {{ width : '120px' }}>{ item.money }</p>
								</li>)
					})}
						</ul>
				</div>
			}
			{ !!teachTools && teachTools.length > 0 &&
				<div className = { styles.class_package }>
					<span className = { styles.item_label } style = {{ verticalAlign : 'top' }}></span>
					<ul className = { styles.class_package_item }>
						<li>
							<p style = {{ width : '140px' }}>物资</p>
							<p style = {{ width :  '100px' }}>标准价格</p>
							<p style = {{ width : '70px' }}>数量</p>
							<p style = {{ width : '100px' }}>合计价格</p>
							<p style = {{ width : '120px' }}>优惠</p>
							<p style = {{ width : '120px' }}>实收价格</p>
						</li>
						{ teachTools.map(function( item, index ){
							return ( <li key = { 'order_detail_teach_' + index }>
										<p style = {{ width : '140px' }}>{ item.name }</p>
										<p style = {{ width :  '100px' }}>{ item.price }</p>
										<p style = {{ width : '70px' }}>{ item.amount }</p>
										<p style = {{ width : '100px' }}>{ item.totalPrice }</p>
										<p style = {{ width : '120px' }}>{ item.preferentialPrice }</p>
										<p style = {{ width : '120px' }}>{ item.money }</p>
									</li>)
						})}
					</ul>
				</div>
			}
			{ !!classpkg && !!teachTools &&
				<div className = { styles.class_package }>
					<span className = { styles.item_label } style = {{ verticalAlign : 'top' }}>汇总 : </span>
					<ul className = { styles.class_package_item }>
						<li>
							<p style = {{ width : '310px' }}>总合计</p>
							<p style = {{ width : '100px' }}>{ !!contractOrderDetail && contractOrderDetail.totalOriMoney && contractOrderDetail.totalOriMoney.toFixed(2) }</p>
							<p style = {{ width : '120px' }}>总实收</p>
							<p style = {{ width : '120px' }}>{ !!contractOrderDetail && contractOrderDetail.totalMoney && contractOrderDetail.totalMoney.toFixed(2) }</p>
						</li>
					</ul>
				</div>
			}
			{
				!!currentItem && currentItem.oriMoney &&
				<p className = { styles.p }>
					<span className = { styles.item_label }>充值金额 : </span>
					<span className = { styles.item_text }>{ !!contractOrderDetail && contractOrderDetail.oriMoney }</span>
				</p>
			}
			{ !!saleUser &&
				<div className = { styles.class_package }>
					<span className = { styles.item_label } style = {{ verticalAlign : 'top' }}>关联销售 : </span>
					<ul className = { styles.class_package_item }>
						<li>
							<p style = {{ width : '310px' }}>销售</p>
							<p style = {{ width : '120px' }}>占比</p>
						</li>
						{ saleUser.map(function( item, index ){
							return ( <li key = { 'order_detail_sale_' + index }>
										<p style = {{ width : '310px' }}>{ item.userName }</p>
										<p style = {{ width : '120px' }}>{ item.rate + '%' }</p>
									</li>)
						})}
					</ul>
				</div>
			}
            { !!contractOrderDetail && contractOrderDetail.extType && !!type && type != '3' &&
				<p className = { styles.p }>
					<span className = { styles.item_label }>赠课类型 : </span>
                    {   contractOrderDetail.extType =='1' ?
                            <span className = { styles.item_text }>通用课时</span>
                       : contractOrderDetail.extType =='2' ?
                            <span className = { styles.item_text }>专用课时</span>
                       : null
                    }

				</p>
			}
            { !!contractOrderDetail && contractOrderDetail.extType=='2' && !!type && type != '3' &&
				<p className = { styles.p }>
					<span className = { styles.item_label }>课程名称 : </span>
					<span className = { styles.item_text }>{ contractOrderDetail.courseName }</span>
				</p>
			}

			{ !!contractOrderDetail && !!type && type != '3' &&
				<p className = { styles.p }>
					<span className = { styles.item_label }>赠送课时 : </span>
					<span className = { styles.item_text }>{ !!contractOrderDetail && contractOrderDetail.extPeriod }</span>
				</p>
			}
			{ !!contractOrderDetail && !!type && type != '3' &&
				<p className = { styles.p }>
					<span className = { styles.item_label }>赠课成本 : </span>
					<span className = { styles.item_text }>{ !!contractOrderDetail && contractOrderDetail.extPeriodMoney }</span>
				</p>
			}
			{ !!contractOrderDetail && !!type && type != '3' &&
				<p className = { styles.p }>
					<span className = { styles.item_label }>赠课原因 : </span>
					<span className = { styles.item_text }>{ !!contractOrderDetail && contractOrderDetail.extPeriodReason }</span>
				</p>
			}
			{ !!contractOrderDetail && !!type && type == '3' &&
				<p className = { styles.p }>
					<span className = { styles.item_label }>赠送天数 : </span>
					<span className = { styles.item_text }>{ !!contractOrderDetail && contractOrderDetail.extNursery || '0' }</span>
				</p>
			}
			<p className = { styles.p }>
				<span className = { styles.item_label }>合同附件 : </span>
				{ !!contractOrderDetail && !!contractOrderDetail.imgUrl && contractOrderDetail.imgUrl.split(',').map(function( item, index ){
					return ( <div key = { 'contract_pic_' + index } className = { styles.item_img } style = {{ backgroundImage : `url(${ item })` }} onClick = { () => openContractPic( item ) }></div> )
				}) }
			</p>
			<p className = { styles.p }>
				<span className = { styles.item_label }>备注 : </span>
				<span style = {{ display : 'inline-block', width : '734px', verticalAlign : 'top' }} className = { styles.item_text }>{ !!contractOrderDetail && contractOrderDetail.remark }</span>
			</p>
		</div>
    )
};

export default ContractOrderDetail;
