import React from 'react';
import styles from '../AutumuOne_tenmplate.less';

let ChildrenDayPage2RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		let cover = detailData.img_intro&&detailData.img_intro.length > 0 ? `url(${detailData.img_intro[0].imgurl})` : '';
		let textArr = detailData.intro.length > 0 ? detailData.intro.split('\n') : '';

		return (
			<div className="autumn_one">
				<div className={styles.page2_background}>
					<div className={styles.commonBox}>
						<div className={styles.commonTitle}>{detailData.title || ''}</div>
						<div className={styles.pageTwoCover} style={{backgroundImage : cover}}></div>
						{
							textArr&&textArr.map((item, index) => {
								return <p key={index} className={styles.pageTwoText}>{item}</p>
							})
						}
					</div>
					<div className={styles.pageTwoBottomPersonImage}></div>
					<div className={styles.pageTwoBottomImage}></div>
					<div className={styles.commonClouds1Image}></div>
					<div className={styles.commonClouds2Image}></div>
					<div className={styles.commonClouds3Image}></div>
				</div>
			</div>
		)
	}
});

export default ChildrenDayPage2RenderComponent;
