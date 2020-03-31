import React from 'react';
import styles from '../dance_template.less';

let MusicPage6RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){

		let { detailData } = this.props;
		return (
			<div className = "dance">
				<div className={styles.background_page6_image}>
					<div className={styles.page6_title}>{detailData.title || ''}</div>
					<div className={styles.page6_sub_title}>{detailData.subTitle || ''}</div>
					<div className={styles.page2_baby_img}></div>
					<p className = {styles.input1}>学员姓名</p>
					<p className = {styles.input2}>手机号码</p>
					<p className = {styles.input3}>学员生日</p>
					<p className = {styles.input_submit}>提交</p>
				</div>
			</div>
		)
	}
});

export default MusicPage6RenderComponent;
