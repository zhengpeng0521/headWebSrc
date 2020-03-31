import React from 'react';
import styles from '../autumn_template.less';

let ChildrenDayPage1RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		let header_url = `url(${detailData.imgUrl || ''})`;

		return (
			<div className="call_phone">
				<div className={styles.page1_background}>
				<div className={styles.page1_header} style={{backgroundImage : header_url}}></div>
				<div className={styles.page1_org_name}>{detailData.title || ''}</div>
				<div className={styles.page1_agreed}></div>
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
