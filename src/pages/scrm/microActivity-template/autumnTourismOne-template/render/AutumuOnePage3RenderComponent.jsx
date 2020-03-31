import React from 'react';
import styles from '../AutumuOne_tenmplate.less';

let ChildrenDayPage3RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		let textArr = detailData.content.length > 0 ? detailData.content.split('\n') : '';

		return (
			<div className="autumn_one">
				<div className={styles.page3_background}>
					<div className={styles.commonBox}>
						<div className={styles.commonTitle}>{detailData.title || ''}</div>
						{
							textArr&&textArr.map((item, index) => {
								return <p key={index} className={styles.pageThreeContentItem}>{item}</p>
							})
						}
					</div>
					<div className={styles.pageThreeBottomImage}></div>
					<div className={styles.commonClouds1Image}></div>
					<div className={styles.commonClouds2Image}></div>
					<div className={styles.commonClouds3Image}></div>
				</div>
			</div>
		)
	}
});

export default ChildrenDayPage3RenderComponent;
