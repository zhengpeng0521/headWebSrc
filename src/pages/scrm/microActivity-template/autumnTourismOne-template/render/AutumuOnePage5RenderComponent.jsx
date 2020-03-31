import React from 'react';
import styles from '../AutumuOne_tenmplate.less';

let ChidlrenDayPage5RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		let cover1  = detailData.img_intro&&detailData.img_intro.length > 0 ? `url(${detailData.img_intro[0].imgurl})` : '';
		let cover2 = detailData.img_intro&&detailData.img_intro.length > 1 ? `url(${detailData.img_intro[1].imgurl})` : '';

		return(
			<div className="autumn_one">
				<div className={styles.page4_background}>
					<div className={styles.commonBox}>
						<div className={styles.commonTitle}>{detailData.title || ''}</div>
						<div className={styles.pageFourCoverImage} style={{backgroundImage : cover1}}></div>
						<div className={styles.pageFourCoverImage} style={{backgroundImage : cover2}}></div>
					</div>
					<div className={styles.pageFourBottomLeftImage}></div>
					<div className={styles.pageFourBottomRightImage}></div>
					<div className={styles.commonClouds1Image}></div>
					<div className={styles.commonClouds2Image}></div>
					<div className={styles.commonClouds3Image}></div>
				</div>
			</div>
		);
	}
});

export default ChidlrenDayPage5RenderComponent;
