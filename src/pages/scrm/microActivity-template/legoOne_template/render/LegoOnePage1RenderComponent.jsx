import React from 'react';
import styles from '../LegoOne_tenmplate.less';

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
					<div className={styles.pageOneTextBoxImage}>
						<div className={styles.pageOneOrgNameText}>{detailData.org_name || ''}</div>
						<div className={styles.pageOneTitleText}>{detailData.title || ''}</div>
					</div>
					<div className={styles.pageOneSpiderManImage}></div>
					<div className={styles.pageOneBottomImage}></div>
				</div>
			</div>
		)
	}
});

export default ChildrenDayPage1RenderComponent;
