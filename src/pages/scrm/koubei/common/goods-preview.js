/**
 * 口碑商品编辑时预览
 * @author yujq
 */

import React from 'react';
import {Carousel} from 'antd';

import './css/goods-preview.css';

let KoubeiGoodsPreview = React.createClass({
	getInitialState() {
		return {

		}
	},

	render () {

		let koubeiGoods = this.props.koubeiGoods || {};

		let bannerImgArr = [];
		let fengmian = koubeiGoods.fengmian || BASE_URL + '/resources/images/koubei/goods-preview/empty.jpg';
		bannerImgArr.push(fengmian);

		let pictureDetails = koubeiGoods.detailImg || '';

		if(pictureDetails && pictureDetails.length > 0) {
			let pictureDetailsArr = pictureDetails.split(',');
			pictureDetailsArr && pictureDetailsArr.length > 0 && pictureDetailsArr.map(function(item) {
				bannerImgArr.push(item);
			});
		}

		return (
		<div className="koubei-goods-preview-cont">
			<div className="koubei-goods-preview-content">

				<div className="pre-goods-banner">
					 <Carousel autoplay dots={false}>
					 	{bannerImgArr && bannerImgArr.length > 0 && bannerImgArr.map(function(item) {
					 		return (<div className="pre-goods-banner-img-cont"><img src={item} width="100%" /></div>);
					 	}) }
					  </Carousel>
				</div>

				<div className="pre-goods-cont1">

					<div className="pre-goods-title">
						<span className="org-name">商家名称</span>
						<span className="goods-subject">{this.props.koubeiGoodsType == 'course' ? (koubeiGoods.courseName || '商品名称') : (koubeiGoods.activityName || '商品名称' )}</span>
					</div>

					<div className="pre-goods-priceandcount">
						<span className="pre-goods-price">
							<span className="xianjia-price">{koubeiGoods.price || '现价'}</span><span className="xianjia-price-unit">元</span>
							<span className="yuanjia-price"><s>{koubeiGoods.yuanjia || '原价'}</s></span><span className="yuanjia-price-unit">元</span>
						</span>

						<span className="pre-goods-count">
							<span className="all-count">仅售{koubeiGoods.kucun || '库存'}份</span><span className="hassale-count">已售0份</span>
						</span>
					</div>

					<div className="pre-goods-other">
						<span className="pre-goods-other-item">
							<img src={BASE_URL + '/resources/images/koubei/goods-preview/right.png'} />
							<span className="pre-goods-other-item-text">随时退</span>
						</span>
						<span className="pre-goods-other-item">
							<img src={BASE_URL + '/resources/images/koubei/goods-preview/right.png'} />
							<span className="pre-goods-other-item-text">过期退</span>
						</span>
					</div>
				</div>

				<div style={{display : 'none'}} className="pre-goods-orgs">
					<div className="pre-goods-orgs-item border-item">
						<span>适用门店</span>
					</div>

					<div className="pre-goods-orgs-item border-item org-detail-item">
						<div className="org-detail">
							<p>门店名称</p>
							<div className="org-detail-score">
								<div className="org-detail-stars">
									<img src={BASE_URL + '/resources/images/koubei/goods-preview/star.png'} />
									<img src={BASE_URL + '/resources/images/koubei/goods-preview/star.png'} />
									<img src={BASE_URL + '/resources/images/koubei/goods-preview/star.png'} />
									<img src={BASE_URL + '/resources/images/koubei/goods-preview/star.png'} />
									<img src={BASE_URL + '/resources/images/koubei/goods-preview/star.png'} />
									<span className="org-detail-stars-text">5.0</span>
								</div>

								<div className="org-detail-range">
									0.2km
								</div>
							</div>
						</div>

						<div className="call">
							<img src={BASE_URL + '/resources/images/koubei/goods-preview/phone.png'} />
						</div>
					</div>

					<div className="pre-goods-orgs-item ore-goods-addr-cont">
						<img src={BASE_URL + '/resources/images/koubei/goods-preview/location.png'} />
						<span className="org-addr">门店详细地址</span>
						<span className="right-arrow">></span>
					</div>

				</div>

				{this.props.koubeiGoodsType == 'course' ?

				<div className="pre-goods-desc">
					<p className="cont-title">详细内容</p>

					<p className="cont-sub-title">课程简介</p>
					<p className="cont-content"><li>{koubeiGoods.courseIntro || '课程简介'}</li></p>

					<p className="cont-sub-title">课程类型</p>
					<p className="cont-content"><li>{koubeiGoods.courseType || '课程类型'}</li></p>

					<p className="cont-sub-title">适合年龄</p>
					<p className="cont-content"><li>{koubeiGoods.age || '适合年龄'}</li></p>

					<p className="cont-sub-title">课时数</p>
					<p className="cont-content"><li>{koubeiGoods.keshishu ? koubeiGoods.keshishu + '-课时' : '课时数'}</li></p>

					<p className="cont-sub-title">课程时长</p>
					<p className="cont-content"><li>{koubeiGoods.courseLong ? koubeiGoods.courseLong + '-分钟' : '课程时长'}</li></p>
				</div>

				: this.props.koubeiGoodsType == 'activity' ?

				<div className="pre-goods-desc">
					<p className="cont-title">详细内容</p>

					<p className="cont-sub-title">活动简介</p>
					<p className="cont-content"><li>{koubeiGoods.activityIntro || '活动简介'}</li></p>

					<p className="cont-sub-title">活动时间</p>
					<p className="cont-content"><li>{koubeiGoods.activityTime || '活动时间'}</li></p>

					<p className="cont-sub-title">活动地址</p>
					<p className="cont-content"><li>{koubeiGoods.activityAddr || '活动地址'}</li></p>

					<p className="cont-sub-title">适合年龄</p>
					<p className="cont-content"><li>{koubeiGoods.age || '适合年龄'}</li></p>

				</div>

				: ''}

				<div className="pre-goods-desc">
					<p className="cont-title">购买须知</p>

					<p className="cont-sub-title">有效期</p>
					<p className="cont-content"><li>{koubeiGoods.youxiao ? `购买后${koubeiGoods.youxiao}天内有效` : '有效期'}</li></p>

					<p className="cont-sub-title">预约信息</p>
					<p className="cont-content"><li>{koubeiGoods.maaInfo || '预约信息'}</li></p>

					<p className="cont-sub-title">试用人群</p>
					<p className="cont-content"><li>{koubeiGoods.availablePeople || '试用人群'}</li></p>

					<p className="cont-sub-title">规则提醒</p>
					<p className="cont-content"><li>{koubeiGoods.ruleWarn || '规则提醒'}</li></p>
				</div>

			</div>
		</div>
		);
	}
});

export default KoubeiGoodsPreview;
