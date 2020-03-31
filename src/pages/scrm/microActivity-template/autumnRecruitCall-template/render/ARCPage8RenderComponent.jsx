import React from 'react';
import styles from '../ARC_template.less';

let ChidlrenDayPage5RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className="call_phone">
				<div className={styles.page8_background}>
					<div className={styles.common_top_img}>
						<div className={styles.common_top_title}>{detailData.title || ''}</div>
					</div>
					<p className = {styles.name}>学员姓名</p>
					<p className = {styles.phone}>手机号码</p>
					<p className = {styles.birthday}>学员生日</p>
					<p className = {styles.btn}>提交</p>
				</div>
			</div>
		)
	}
});

export default ChidlrenDayPage5RenderComponent;
