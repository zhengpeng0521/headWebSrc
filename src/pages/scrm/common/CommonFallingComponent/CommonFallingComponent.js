/*
 * imageArr 		: [],	数组 需要飘落的不同图片链接 如果是一样的图片，传入一张即可
 * number  		 	: 20, 	imageArr数组图片只有一张的时候默认遍历20次进行飘落， 超过一张时候按照数长度进行飘落
 * isCustomNumber	: false,是否自定义设置飘落次数，如果设置true. 1.如果imageArr数组只有一张，根据自定义的number图片进行飘落，如果是多张，会对图片进行随机抽样number张进行飘落
 * itemImageStyle 	: {}
 */
import React, {PropTypes} from 'react';
import styles from './CommonFallingComponent.less';

function FallingComponent({

	number,
	imageArr,
	isCustomNumber,
	itemImageStyle,

}) {

	if(imageArr === undefined || imageArr.length === 0) {
		return <p>{console.info('请传入图片链接')}</p>
	}

	number 			= number || 20;
	isCustomNumber	= isCustomNumber || false;
	itemImageStyle  = itemImageStyle || {};
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
				imageContainerArray.push(imageArr[i]);
			}
		} else {
			imageContainerArray = getNewArr();
		}
	} else {
		imageContainerArray = getNewArr();
	}

	let screenW = 326;
	let screenH = 525;

	return(
		<div style={{position: 'absolute', zIndex: 100}}>
			{
				imageContainerArray&&imageContainerArray.map((item, index) => {
					let item_url = 'url(' + item +')';
					let duration = Math.random()*6+4 + 's';
					let left = Math.random()*screenW + 1;
					let delay 	 = Math.random()*2;
					let aniName  = delay > 0.5 ? styles.item_image_counterclockwiseSpinAndFlip : styles.item_image_clockwiseSpin;

					return (
						<div key={index} className={styles.item_box}
							 style={{
								animationDuration : duration,
								animationDelay : delay,
								marginLeft : left,
							 }}>
							 <div className={aniName}
								  style={{
									...itemImageStyle,
									backgroundImage : item_url,
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
