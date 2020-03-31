/*
 *	首页上半部分底部侧按钮
 * 	buttomData : 所有数据
 */
import React from 'react';
import { Button, Icon } from 'antd';
import styles from './BottomLayout.less';
function BottomDataComponent ({

	bottomData,

}) {

	function touchEvent(tag) {
		bottomData.callbackFunction(tag);
	}

	return (
		<div className={styles.bottom_base} >
			<div className={styles.bottom_base_left} onClick={() => touchEvent(bottomData.tag - 3)}>
				<Icon className={styles.bottom_b_img_bg} style={{color : '#5d9cec'}}  type={bottomData.icon}></Icon>
				<div className={styles.bottom_b_title}>
					<p className={styles.bottom_b_title_p1}>{bottomData.num}</p>
					<p className={styles.bottom_num}>{bottomData.unit}</p>
					<p className={styles.bottom_b_title_p2}>{bottomData.title}</p>
				</div>
			</div>
			<Button
				className={styles.bottom_base_btn}
				type="primary"
				onClick={() => touchEvent(bottomData.tag)}
			>
			{bottomData.buttonText}
			</Button>
		</div>
	)
}
export default BottomDataComponent;
