import React from 'react';
import styles from '../ARC_template.less';

let ChildrenDayPage4RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		let contentArr = detailData.content&&detailData.content.length > 0 ? detailData.content.split('\n') : '';

		return (
			<div className="call_phone">
				<div className={styles.page7_background}>
					<div className={styles.common_top_img}>
						<div className={styles.common_top_title}>{detailData.title || ''}</div>
					</div>
					<div className={styles.page7_content_box}>
						<div className={styles.page7_leaves}></div>
						{
							contentArr&&contentArr.map((item, index) => {
								return <div key={index} className={styles.page7_text}>{item}</div>
							})
						}
					</div>
					<img src={detailData.qrImgUrl || ''} className={styles.page7_qr_code_image} />
					<div className={styles.page7_qr_remark}>扫码关注我们哦</div>
				</div>
			</div>
		)
	}
});

export default ChildrenDayPage4RenderComponent;
