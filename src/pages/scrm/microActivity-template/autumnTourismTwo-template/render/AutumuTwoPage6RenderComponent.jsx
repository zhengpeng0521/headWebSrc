import React from 'react';
import styles from '../AutumuTwo_tenmplate.less';

let ChidlrenDayPage5RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className="autumn_two">
				<div className={styles.page5_background}>

					<div className={styles.pageOneTopLeftImage}></div>
					<div className={styles.pageOneTopRightImage}></div>
					<div className={styles.pageSixTitleText}>{detailData.title || ''}</div>
					<div className={styles.pageSixinputBox}>
						<p className = {styles.name}>学员姓名</p>
						<p className = {styles.phone}>手机号码</p>
						<p className = {styles.birthday}>学员生日</p>
						<p className = {styles.btn}>提交</p>
					</div>
					<div className={styles.pageSixBottomRightImage}></div>
				</div>
			</div>
		)
	}
});

export default ChidlrenDayPage5RenderComponent;
