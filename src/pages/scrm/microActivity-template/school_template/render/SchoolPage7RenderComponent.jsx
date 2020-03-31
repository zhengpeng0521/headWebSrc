import React from 'react';
import styles from '../school_template.less';

let ChidlrenDayPage7RenderComponent = React.createClass({

	getInitialState() {return {}},

	render() {

		let { detailData } = this.props;

		return (
			<div className="base_school_would_be_starting">
				<div className={styles.background_page7_image}>
					<div className={styles.pageSevenBoxTitle}>{detailData.title || ''}</div>
					<div className={styles.pageSevenBoxLunziLeft}></div>
					<div className={styles.pageSevenBoxLunziRight}></div>
					<p className = {styles.name}>学员姓名</p>
					<p className = {styles.phone}>手机号码</p>
					<p className = {styles.birthday}>学员生日</p>
					<p className = {styles.birthday}>备注</p>
					<p className = {styles.btn}>提交</p>
				</div>
			</div>
		)
	}
});

export default ChidlrenDayPage7RenderComponent;
