import React from 'react';
import styles from '../dance_template.less';

let MusicPage4RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		let image1 = detailData.img_intro&&detailData.img_intro.length > 0 ? (detailData.img_intro[0].imgurl.length > 0 ? `url(${detailData.img_intro[0].imgurl}!s300)` : '') : '';
		let image2 = detailData.img_intro&&detailData.img_intro.length > 1 ? (detailData.img_intro[1].imgurl.length > 0 ? `url(${detailData.img_intro[1].imgurl}!s300)` : '') : '';
		let image3 = detailData.img_intro&&detailData.img_intro.length > 2 ? (detailData.img_intro[2].imgurl.length > 0 ? `url(${detailData.img_intro[2].imgurl}!s300)` : '') : '';
		let image4 = detailData.img_intro&&detailData.img_intro.length > 3 ? (detailData.img_intro[3].imgurl.length > 0 ? `url(${detailData.img_intro[3].imgurl}!s300)` : '') : '';


		return (
			<div className = "dance">
				<div className={styles.background_page4_image}>
					<div className={styles.page4_title}>{detailData.title || ''}</div>
					<div className={styles.common_clouds_img}></div>
					<div className={styles.common_bubble_img_static}></div>

					<div className={styles.page4_spacecraft_img}></div>
					<div className={styles.page4_baby_img}></div>

					<div className={styles.page4_image_box}>
						<div className={styles.page4_cover} style={{backgroundImage : image1}}></div>
						<div className={styles.page4_cover} style={{backgroundImage : image2}}></div>
						<div className={styles.page4_cover} style={{backgroundImage : image3}}></div>
						<div className={styles.page4_cover} style={{backgroundImage : image4}}></div>
					</div>
				</div>
			</div>
		)
	}
});

export default MusicPage4RenderComponent;
