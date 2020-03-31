import React from 'react';
import styles from '../ARC_template.less';

let ChildrenDayPage2RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className="call_phone">
				<div className={styles.page2_background}>
					<div className={styles.page2_top_image}></div>
					<div className={styles.page2_content}>{detailData.title || ''}</div>
				</div>
			</div>
		)
	}
});

export default ChildrenDayPage2RenderComponent;
