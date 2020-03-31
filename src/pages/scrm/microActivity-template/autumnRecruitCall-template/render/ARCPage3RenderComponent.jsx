import React from 'react';
import styles from '../ARC_template.less';

let ChildrenDayPage3RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		let img_left  = detailData.img_intro&&detailData.img_intro.length > 0 ? detailData.img_intro[0].imgurl : '';
		let img_right = detailData.img_intro&&detailData.img_intro.length > 1 ? detailData.img_intro[1].imgurl : '';

		return (
			<div className="call_phone">
				<div className={styles.page3_background}>
					<div className={styles.common_top_img}>
						<div className={styles.common_top_title}>{detailData.title || ''}</div>
					</div>
					<div className={styles.page3_cover_left} style={{backgroundImage : `url(${img_left})`}}></div>
					<div className={styles.page3_text_left}>{detailData.title1 || ''}</div>
					<div className={styles.page3_text_right}>{detailData.title2 || ''}</div>
					<div className={styles.page3_cover_right} style={{backgroundImage : `url(${img_right})`}}></div>
				</div>
			</div>
		)
	}
});

export default ChildrenDayPage3RenderComponent;
