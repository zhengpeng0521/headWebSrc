import React from 'react';
import styles from '../autumnRecruitThree_template.less';

let ChildrenDayPage1RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className="three_autumn_recruit_phone">
				<div className={styles.page1_background}>
					<div className={styles.page1_header} style={{backgroundImage : `url(${detailData.imgUrl})`}}></div>
					<div className={styles.page1_org_name}>{detailData.title || ''}</div>
					<div className={styles.page1_img_1}></div>
					<div className={styles.page1_img_2}></div>
					<div className={styles.page1_agreed} onClick={() => next()}></div>
					<div className={styles.page1_agreed_left_arc_line}></div>
					<div className={styles.page1_agreed_left_arc_line_second}></div>
					<div className={styles.page1_agreed_right_arc_line}></div>
					<div className={styles.page1_agreed_right_arc_line_second}></div>
				</div>
			</div>
		)
	}
});

export default ChildrenDayPage1RenderComponent;
