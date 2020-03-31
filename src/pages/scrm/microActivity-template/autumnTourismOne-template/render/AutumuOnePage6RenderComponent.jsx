import React from 'react';
import styles from '../AutumuOne_tenmplate.less';

let ChidlrenDayPage5RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className="autumn_one">
				<div className={styles.page6_background}>
					<div className={styles.commonBox}>
						<div className={styles.commonTitle}>{detailData.title || ''}</div>
						<p className = {styles.name}>学员姓名</p>
						<p className = {styles.phone}>手机号码</p>
						<p className = {styles.birthday}>学员生日</p>
						<p className = {styles.btn}>提交</p>
					</div>
					<div className={styles.pageSixBottomLeftImage}></div>
					<div className={styles.pageSixBottomRightImage}></div>
					<div className={styles.commonClouds1Image}></div>
					<div className={styles.commonClouds2Image}></div>
					<div className={styles.commonClouds3Image}></div>
				</div>
			</div>
		)
	}
});

export default ChidlrenDayPage5RenderComponent;
