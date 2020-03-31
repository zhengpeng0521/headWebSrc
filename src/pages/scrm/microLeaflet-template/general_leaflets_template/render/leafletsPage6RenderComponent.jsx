import React from 'react';
import styles from '../leaflets_template.less';

let LeafletsPage6RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className = 'page-render-design leaflets_page2_render' >
				<div className={styles.page6_bg}>
					<div className={styles.page2_image}>{detailData.title}</div>
					<div className={styles.baby_name} style={{animationDelay : '200ms'}}>学员姓名</div>
					<div className={styles.baby_phone} style={{animationDelay : '400ms'}}>联系方式</div>
					<div className={styles.baby_birthday} style={{animationDelay : '600ms'}}>学员生日</div>
					<div className={styles.baby_submit}>提  交</div>
					<div className={styles.page6_image1} ></div>
					<div className={styles.page6_image2_l}></div>
					<div className={styles.page6_image2_r}></div>
					<div className={styles.page6_image3}></div>
					<div className={styles.page6_image4}></div>
					<div className={styles.page6_image5}></div>
					<div className={styles.page6_image6}></div>
				</div>
			</div>
		)
	}
});

export default LeafletsPage6RenderComponent;
