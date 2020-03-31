import React from 'react';
import styles from '../AutumuOne_tenmplate.less';

let ChildrenDayPage1RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className="autumn_one">
				<div className={styles.page1_background}>
					<div className={styles.pageOneArtTextImage}></div>
					<div className={styles.pageOneTextBox}>
						<div className={styles.pageOneSubTitleText}>{detailData.sub_title || ''}</div>
						<div className={styles.pageOneTitleText}>{detailData.title || ''}</div>
						<div className={styles.pageOneOrgNameText}>{detailData.org_name || ''}</div>
					</div>
					<div className={styles.pageOneBottomImage}></div>
					<div className={styles.pageOneballoonbigImage}></div>
					<div className={styles.pageOneballoonSmallImage}></div>
				</div>
			</div>
		)
	}
});

export default ChildrenDayPage1RenderComponent;
