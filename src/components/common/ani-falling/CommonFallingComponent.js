/**
 * @description			一个图片飘落的动画
 * 
 * @param {number}		weatherType		天气类型 0.默认 1.下雨 2.下雪 3.下冰雹 4.雨夹雪	
 * @param {number}		weatherDegreeOf	天气等级程度 0.默认 1.小 2.中 3.大 4.超大
 * @param {number} 		isCustomNumber 	如果是true.在imageArr数组只有一张的情况下，会根据自定义或默认的number图片进行飘落，如果是多张，会对除了imageArr包含的图片外对图片进行随机抽样(number减imageArr个数)张进行飘落
 * @param {number} 		itemImageStyle  自定义样式
 * @param {string} 		direction 		①.default ②.vertical ③.left ④.right

 * 
 * @param {private} 	speenArr 		掉落速度 示例[3，6] 索引0必须比索引1大, 只会取前两个，超出不取 此示例会取出3-6秒的随机值
 * @param {private} 	number 			数量 imageArr数组图片只有一张的时候默认遍历20次进行飘落， 超过一张时候按照数长度进行飘落
 * @param {private} 	imageArr		数据源 需要飘落的不同图片链接 如果是一样的图片，传入一张即可
 * @return ANI
 */

// let props = {
// 	weatherType: 1,
// 	weatherDegreeOf: 2,
// 	        direction: 'left',
// 	        isCustomNumber: true,
// 	        itemImageStyle: {
// 		height: '10px',
// 		width: '10px',
// 	},
// }


import React, {PropTypes} from 'react';
import { message } from 'antd';
import styles from './CommonFallingComponent.less';
import JsonData from './CommonFallingComponent.json';

function FallingComponent({

	weatherType,
	weatherDegreeOf,
	isCustomNumber,
	itemImageStyle,
	direction,
	
}) {

	let imageArr = [], speenArr = [], number = 0;

	switch (weatherType) {
		case 0:
			imageArr = [...JsonData.rain];
			break;
		case 1:
			imageArr = [...JsonData.rain];
			break;
		case 2:			
			imageArr = [...JsonData.snow];
			break;
		case 3:			
			imageArr = ["//img.ishanshan.com/gimg/img/28a1f90883dc95337edfa5e10229c100"];
			break;
		case 4:			
			imageArr = [...JsonData.rain, ...JsonData.snow];
			break;
		default:
			imageArr = [...JsonData.rain];
			break;
	}

	switch (weatherDegreeOf) {
		case 0:
			number = 20;
			speenArr = [8, 13];
			break;
		case 1:
			number = 30;
			speenArr = [6, 10];
			break;
		case 2:
			number = 40;
			speenArr = [5, 8];
			break;
		case 3:
			number = 60;
			speenArr = [3, 5];
			break;
		case 4:
			number = 80;
			speenArr = [1, 3];
			break;
		default:
			number = 20;
			speenArr = [8, 13];
			break;
	}

	if(imageArr&&imageArr.length === 0) {
		return <p>{message.info('请设置imageArr属性')}</p>
	}

	isCustomNumber	= isCustomNumber || false;
	itemImageStyle  = itemImageStyle || {};
	direction		= direction || 'default';
	
	if(imageArr&&imageArr.length >= number) {
		number = imageArr.length;
	}
	
	function getNewArr() {
		let tempArr = [];
		if(number != imageArr.length) {
			let remaining = number - imageArr.length;
			tempArr = imageArr;
			for(let i = 0; i < remaining; i++) {
				var index = Math.floor((Math.random() * imageArr.length)); 
				tempArr.push(imageArr[index]);
			}
		} else {
			tempArr = imageArr;			
		}
		return tempArr;
	}
	
	let imageContainerArray = [];

	if(isCustomNumber) {
		if(imageArr&&imageArr.length  === 1) {
			for(let i = 0; i < number; i++) {
				imageContainerArray.push(imageArr[0]);
			}
		} else {
			imageContainerArray = getNewArr();
		}
	} else {
		imageContainerArray = imageArr;
	}
	
	let screenW 	= document.body.clientWidth;
	let screenH 	= document.body.clientHeight;
	let beganTime 	= undefined;	//开始时间
	let overTime 	= undefined;	//结束时间
	
	if(speenArr.length > 0) {
	   	beganTime 	= speenArr.length > 0 ? speenArr[0] : 4;
		overTime 	= speenArr.length > 1 ? speenArr[1] : 6;
		if(beganTime > overTime) {
			return <p>{message.info('速度设置错误')}</p>   
		}
	}
			
	return(
		<div style={{position: 'absolute', zIndex: 10000}}>
			{
				imageContainerArray&&imageContainerArray.map((item, index) => {
					let item_url 	= 'url(' + item +')';
					let duration 	= 0;
					if(beganTime != undefined && overTime != undefined) {								
						duration = Math.random() * overTime+beganTime + 's';
					} else {
						duration = Math.random() * 6 + 4 + 's';
					}
					let left 		= Math.random() * screenW + 1;
					let delay 	 	= Math.random() * 2;
					let aniName		= '';
					let boxStyle 	= '';
		
					switch(direction) {
						case 'vertical':
							boxStyle = styles.itemBoxVertical;
							break;
						case 'left':
							boxStyle = styles.itemBoxLeftOblique;
							left += 200;
							break;
						case 'right':
							boxStyle = styles.itemBoxRightOblique;
							left -= 200;
							break;
						default :
							boxStyle = styles.itemBox;
							break;
					}
						
					aniName  = delay > 0.5 ? styles.item_image_counterclockwiseSpinAndFlip : styles.item_image_clockwiseSpin;

					return (						
						<div key={index} className={boxStyle}
							 style={{
								animationDuration : duration,
								animationDelay : delay,
								left : left,
							 }}>
							 <div className={aniName}
								  style={{
									width : '10px',
									height: '10px',
									...itemImageStyle,
									backgroundImage : item_url,
									backgroundSize : '100% 100%',
									animationDuration : duration,
									animationDelay : delay,
								  }}>
							 </div>
						</div>
					)
				})
			}
		</div>
    );
}

export default FallingComponent;