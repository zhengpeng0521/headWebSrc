/*
 *	所有数据
 * 	bannerData {
 *		autoPlay 		： 是否自动播放
 *		autoPlaySpeed 	： 自动播放下一页时间
 * 	}
 */
import React from 'react';
import BannerAnim, { Element } from 'rc-banner-anim';
import TweenOne from 'rc-tween-one';
import 'rc-banner-anim/assets/index.css';
const BgElement = Element.BgElement;

function BannerComponent ({

	bannerData,

 }) {

	let bannerDataTemp = [{bgurl : 'url(https://zos.alipayobjects.com/rmsportal/gGlUMYGEIvjDOOw.jpg)'},
						  {bgurl : 'url(https://zos.alipayobjects.com/rmsportal/hzPBTkqtFpLlWCi.jpg)'}];

	return (
		<BannerAnim
			prefixCls="banner-user"
			arrow={false}
			autoPlay={bannerData&&bannerData.autoPlay}
			autoPlaySpeed={bannerData&&bannerData.autoPlaySpeed}
										   style={{borderRadius : 10, backgroundPosition : 'center',}}
		>
			{
				bannerDataTemp&&bannerDataTemp.map(function(item,index){
					return <Element
								prefixCls="banner-user-elem"
								key={index}
							>
								 <BgElement
									key="bg"
									className="bg"
									style={{
										height : '100%',
										backgroundImage : item.bgurl,
										backgroundSize : 'cover',
										borderRadius : 10,
										backgroundPosition : 'center',
									}}
								  />
							</Element>
				})
			}
		</BannerAnim>
	)
}

export default BannerComponent;
