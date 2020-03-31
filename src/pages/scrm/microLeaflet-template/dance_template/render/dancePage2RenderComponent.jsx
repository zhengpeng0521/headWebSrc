import React from 'react';
import styles from '../dance_template.less';

let MusicPage2RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		let contentArr = !!detailData && !!detailData.content && detailData.content.split('\n');

		return (
			<div className = "dance">
				<div className={styles.background_page2_image}>
					<div className={styles.common_clouds_img}></div>
					<div className={styles.common_plane_img}></div>
					<div className={styles.common_bubble_img_static}></div>

					<div className={styles.page2_title}>{detailData.title || ''}</div>
					<div className={styles.page2_box_img}>
						{
							contentArr&&contentArr.map((item, index) => {
								return <p key={index} className={styles.page2_content}>{item}</p>
							})
						}
					</div>
					<div className={styles.page2_baby_img}></div>
				</div>
			</div>
		)
	}
});

export default MusicPage2RenderComponent;
