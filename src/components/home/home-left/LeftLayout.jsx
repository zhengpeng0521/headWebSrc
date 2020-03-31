/*
 *	首页上部左侧按钮
 * 	leftData : 所有数据
 */
import React from 'react';
import { Icon } from 'antd';
import styles from './LeftLayout.less';
function LeftDataComponent ({

	leftData,

}) {

	return (
		<div>
			<div className={styles.left_img_bg}>
				<Icon
					className={styles.left_img}
					style={{color : 'white'}}
					type={leftData.icon}>
				</Icon>
			</div>
			<div className={styles.left_title}>
				<p className={styles.left_title_p1}>{leftData.num}</p>
				<p className={styles.left_title_p2}>{leftData.title}</p>
			</div>
		</div>
	)
}

export default LeftDataComponent;
