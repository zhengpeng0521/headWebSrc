import React from 'react';
import styles from '../AutumuTwo_tenmplate.less';

let ChildrenDayPage3RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		let textArr = detailData.content.length > 0 ? detailData.content.split('\n') : '';

		return (
			<div className="autumn_two">
				<div className={styles.page3_background}>
					<div className={styles.pageThreeTitleText}>{detailData.title || ''}</div>
					<div className={styles.pageThreeTextbox}>
						{
							textArr&&textArr.map((item, index) => {
								return <p key={index} className={styles.pageThreeContentItem}>{item}</p>
							})
						}
						<div className={styles.pageThreeArrowImage}></div>
						<div className={styles.pageThreeLoveImage}></div>
					</div>
				</div>
				<div className={styles.pageThreeBottomImage}></div>
			</div>
		)
	}
});

export default ChildrenDayPage3RenderComponent;
