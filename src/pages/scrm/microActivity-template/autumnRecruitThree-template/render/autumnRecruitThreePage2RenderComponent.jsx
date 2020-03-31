import React from 'react';
import styles from '../autumnRecruitThree_template.less';

let ChildrenDayPage2RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className="three_autumn_recruit_phone">
				<div className={styles.page2_background}>
					<div className={styles.page2_title_imgae}></div>
					<div className={styles.page2_person_image}></div>
					<div className={styles.page2_bicycle_image}></div>
					<div className={styles.page2_content}>{detailData.title || ''}</div>
				</div>
			</div>
		)
	}
});

export default ChildrenDayPage2RenderComponent;
