/*
 *	打印页面
 *  type : 1.缴费 2.退费 3.充值
 *	data : 数据源
 */
import React from 'react';
import {Modal} from 'antd';

function Print ({
	
	data,
	
 }) {

	
	let paymentItemlayoutArr = [];
	let type 			= data&&data.type;
	let totalMoney 		= data&&data.totalMoney || 0;
	let balanceMoney 	= data&&data.balance || 0;
	let money 			= data&&data.money || 0;
	totalMoney 			= totalMoney.toFixed(2);
	balanceMoney 		= balanceMoney.toFixed(2);
	money 				= money.toFixed(2);
	
	//Header布局
	let headerLayout = (
		<div style = {{
				height : 30, 
				border : '1px solid #ad9f9f', 
				marginLeft : 10,
				marginTop : 10}}
		>
			<div style={{
					lineHeight: '30px', 
					width: 'calc(50% - 21px)',
					paddingLeft : 10,
					paddingRight : 10,
					float: 'left', 
					textAlign : 'center', 
					borderRight : '1px solid #ad9f9f'}}
			>交易内容</div>
			<div style={{
					lineHeight: '30px', 
					width: 'calc(10% - 1px)', 
					float: 'left', 
					textAlign : 'center', 
					borderRight : '1px solid #ad9f9f'}}
			>数量</div>
			<div style={{
					lineHeight: '30px',
					width: 'calc(27% - 21px)',
					float: 'left', 
					paddingLeft : 10, 
					paddingRight : 10,
					textAlign : 'center',
					borderRight : '1px solid #ad9f9f'}}
			>优惠</div>
			<div style={{
					lineHeight: '30px', 
					width: 'calc(13% - 1px)',
					float: 'left', 
					textAlign : 'center'}}
			>实收</div>
		</div>
	)
	
	//content布局
	data&&data.content.length>0?data.content.map(function(item,index) {
		
		let money = item.money;
		money = money.toFixed(2);
		
		return paymentItemlayoutArr.push(
			  		<div key={index} 
						style={{
							height : 40,
							borderBottom : '1px solid #ad9f9f',
							borderLeft : '1px solid #ad9f9f', 
							borderRight : '1px solid #ad9f9f', 
							marginLeft : 10,
							fontSize : 12}}
					>
						<div style={{
							paddingLeft : 10,
							paddingRight : 10,
							width : 'calc(50% - 21px)',
							height : '100%',
							borderRight : '1px solid rgb(173, 159, 159)',
							textAlign:'left',
							overflow : 'hidden',
							float: 'left',
							display : '-webkit-box',
							WebkitBoxAlign : 'center',
							MozBoxPack	: 'center',
							lineHeight : '19px',
						}}>
							{item.content}
						</div>
				
						<div style={{
							lineHeight: '40px', 
							width: 'calc(10% - 1px)', 
							float: 'left', 
							textAlign : 'center', 
							borderRight : '1px solid #ad9f9f'}}
						>{item.amount}</div>
				
						<div style={{
							width: 'calc(27% - 21px)', 
							display : '-webkit-box', 
							WebkitBoxPack : 'center',
							WebkitBoxAlign : 'center',
							MozBoxPack	: 'center',
							MozBoxPAlign	: 'center',
							height: '100%',
							float: 'left', 
							textAlign:'center', 
							borderRight : '1px solid #ad9f9f', 
							overflow : 'hidden',
							lineHeight : '19px',
							paddingLeft : 10,
							paddingRight : 10,}}
						>{item.discount&&item.discount.length > 0 ? item.discount : '--'}</div>
				
						<div style={{
							lineHeight: '40px', 
							width: 'calc(13% - 10px)',
							float: 'left', 
							textAlign : 'right'}}
						>￥{money}</div>
					</div>
		)
	}) : '';
	
	//fooder布局
	let fooderLayout = (
		<div style={{
				height : 40, 
				borderBottom : '1px solid #ad9f9f', 
				borderLeft : '1px solid #ad9f9f',
				borderRight : '1px solid #ad9f9f',
				marginLeft : 10, 
				marginBottom: 20
			}}
		>
			<div style={{
					lineHeight: '40px', 
					width: 'calc(87% - 43px)',
					paddingLeft : 10,
					paddingRight : 30, 
					float: 'left', 
					borderRight : '1px solid #ad9f9f'
				}}
			>总计</div>
			<div style={{
					lineHeight: '40px',
					width: 'calc(13% - 10px)',
					float: 'left', 
					textAlign : 'right'
				}}
			>￥{totalMoney}</div>
		</div>
	)
	
	//退费布局
	let refundLayout = (
		<div>
			<div style={{
					height : 40, 
					border : '1px solid #ad9f9f', 
					marginLeft : 10,
					marginTop : 20}}
			>
				<div style={{
						lineHeight: '40px', 
						width: 'calc(87% - 42px)',
						paddingLeft : 10,
						paddingRight : 30, 
						float: 'left', 
						borderRight : '1px solid #ad9f9f'}}
				>剩余</div>
				
				<div style={{
						lineHeight: '40px',
						width: 'calc(13% - 10px)',
						float: 'left', 
						textAlign : 'right'}}
				>45课时</div>
			</div>
			
			<div style={{
					height : 40, 
					marginLeft : 10,
					marginBottom : 20,
					borderRight : '1px solid #ad9f9f',
				    borderLeft: '1px solid #ad9f9f',
    				borderBottom: '1px solid #ad9f9f'}}
			>
				<div style={{
						lineHeight: '40px', 
						width: 'calc(87% - 42px)',
						paddingLeft : 10,
						paddingRight : 30, 
						float: 'left', 
						borderRight : '1px solid #ad9f9f'}}
				>总计:1000000.00</div>
				
				<div style={{
						lineHeight: '40px',
						width: 'calc(13% - 10px)',
						float: 'left', 
						textAlign : 'right'}}
				>￥200000.00</div>
			</div>
		</div>
	)

	let topUpLayout = (
		<div>
			<div style = {{
					height : 35,
					border : '1px solid #ad9f9f',
					marginLeft : 10,
					marginTop : 10,
				width : 'calc(100% - 42px)'}}
			>
				<div style={{
						lineHeight: '35px',
						width: 'calc(70% - 21px)',
						paddingLeft : 10,
						paddingRight : 10,
						float: 'left',
						textAlign : 'center',
						borderRight : '1px solid #ad9f9f'
					}}
				>交易内容</div>
				<div style={{
						lineHeight: '35px',
						width: 'calc(30% - 21px)',
						paddingLeft : 10,
						paddingRight : 10,
						float: 'left',
						textAlign : 'center',
					}}
				>实收</div>
			</div>
			<div style={{
					height : 35,
					borderLeft : '1px solid #ad9f9f',
					borderBottom : '1px solid #ad9f9f',
					borderRight : '1px solid #ad9f9f',
					marginLeft : 10,
					width : 'calc(100% - 42px)'
				}}
			>
				<div style={{
						lineHeight: '35px',
						width: 'calc(70% - 21px)',
						paddingLeft : 10,
						paddingRight : 10,
						float: 'left',
						textAlign : 'left',
						borderRight : '1px solid #ad9f9f'
					}}
				>充值</div>
				<div style={{
						lineHeight: '35px',
						width: 'calc(30% - 21px)',
						paddingLeft : 10,
						paddingRight : 10,
						float: 'left',
						textAlign : 'center',
						marginBottom : 10,
					}}
				>¥1000.00元</div>
			</div>
		</div>
	)

	//融合布局
	let layout = (	
		<div id="js_pay_cost" style={{width: '90%', marginLeft: '5%'}}>
			<p style={{textAlign : 'center', fontSize: 18}}>{data.organName}</p>
			<p style={{textAlign : 'center', fontSize: 15, marginTop: 5}}>缴费单</p>
			<p style={{marginLeft: 10}}>学员姓名：{data.stuName}</p>
			{
				type == 1
					?
					<div>
						{headerLayout}
						{paymentItemlayoutArr}
						{fooderLayout}
					</div>
					:
				type == 2
					?
					<div>
						{headerLayout}
						{paymentItemlayoutArr}
						{fooderLayout}
					</div>
					 :
				type == 3
					?
						topUpLayout
					:
					''
			}

			<p style={{marginLeft: 10, float : 'left', width : '200px'}}>账户变动：{money} 元</p>
			<p style={{marginLeft: 10, float : 'left'}}>课时变动：+{data.classChange}</p>
			<p style={{marginLeft: 10, float : 'left', clear:'left', width : '200px'}}>当前余额：{balanceMoney} 元</p>
			<p style={{marginLeft: 10, float : 'left'}}>当前课时：{data.nowClass}</p>
			<p style={{marginLeft: 10, float : 'left', clear: 'left', width : '200px'}}>经办人：{data.operator}</p>
			<p style={{marginLeft: 10, float : 'left'}}>经办日期：{data.createTime}</p>
			<p style={{marginLeft: 10, clear: 'left', float: 'left', width: '200px'}}>电话：{data.tel}</p>
			<p style={{marginLeft: 10, float : 'left'}}>地址：{data.address}</p>
			<p style={{marginLeft: 10, marginTop: 30, clear: 'left', float: 'left'}}>经办人签字：</p>
			<p style={{marginRight: 150, marginTop: 30, float : 'right'}}>客户签字：</p>
		</div>
	)


	return (
		layout
    );
}

export default Print;

//			<p style={{marginLeft: 10, float : 'left', width : '200px', height : '25px'}}>账户变动：-660</p>
//			<p style={{marginLeft: 10, float : 'left'}}>课时变动：+{data.classChange}</p>
//			<p style={{marginLeft: 10, float : 'left', clear:'left', width : '200px', height : '25px'}}>当前余额：1600元</p>
//			<p style={{marginLeft: 10, float : 'left'}}>当前课时：{data.nowClass}</p>
//			<p style={{marginLeft: 10, float : 'left', clear: 'left', width : '200px'}}>经办人：{data.operator}</p>
//			<p style={{marginLeft: 10, float : 'left'}}>经办日期：{data.createTime}</p>
//			<p style={{marginLeft: 10, marginTop: 10, clear: 'left', float: 'left', width: '200px'}}>电话：{data.tel}</p>
//			<p style={{marginLeft: 10, marginTop: 10, float : 'left'}}>地址：{data.address}</p>
//			<p style={{marginLeft: 10, marginTop: 30, clear: 'left', float: 'left'}}>经办人签字：</p>
//			<p style={{marginRight: 150, marginTop: 30, float : 'right'}}>客户签字：</p>
