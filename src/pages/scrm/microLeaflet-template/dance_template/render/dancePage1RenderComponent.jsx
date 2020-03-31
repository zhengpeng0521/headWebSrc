import React from 'react';
import styles from '../dance_template.less';

let MusicPage1RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className = "dance">
				<div className={styles.background_page1_image}>
					<div className={styles.layou_header_image} style={{backgroundImage : `url(${detailData.head_imgUrl || ''})`}}></div>
					<div className={styles.page1_sub_title}>{detailData.sub_title || ''}</div>
					<div className={styles.layou_zhaosheng_img}></div>
					<div className={styles.page1_title}>{detailData.title || ''}</div>
					<div className={styles.common_clouds_img}></div>
					<div className={styles.common_clouds_img1}></div>
					<div className={styles.common_bubble_img_static}></div>
					<div className={styles.common_plane_img}></div>
					<div className={styles.layou_baby_img}></div>
				</div>
			</div>
		)
	}
});

export default MusicPage1RenderComponent;
