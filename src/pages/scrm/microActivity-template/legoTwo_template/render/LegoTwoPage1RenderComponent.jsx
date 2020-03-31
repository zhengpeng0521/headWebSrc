import React from 'react';
import styles from '../LegoTwo_tenmplate.less';

let ChildrenDayPage1RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className="lego_one">
					<div className={styles.page1_background}>
					<div className={styles.pageOneArtTextImage}></div>
					<div className={styles.pageOneOrgNameText}>{detailData.org_name || ''}</div>
					<div className={styles.pageOneTitleText}>{detailData.title || ''}</div>
					<div className={styles.pageOneJimuImage}></div>
				</div>
			</div>
		)
	}
});

export default ChildrenDayPage1RenderComponent;
