/*
 *	首页上部右侧按钮
 * 	rightData : 所有数据
 *	icon_name : 图片名称
 */
import React from 'react';
import { Icon } from 'antd';
import styles from './RightLayout.less';
function RightDataComponent ({

	rightData,
	icon_name,

}) {

	return (
		<div>
			<div className={styles.right_img_bg}>
				<Icon className={styles.right_img} style={{color : 'rgb(234,118,156)', fontSize : 60}} type={icon_name}></Icon>
			</div>
			<div className={styles.right_title}>
				<p className={styles.right_title_p1}>{rightData&&rightData.num}</p>
				<p className={styles.right_title_p2}>{rightData&&rightData.title}</p>
			</div>
		</div>

	)
}

export default RightDataComponent;
