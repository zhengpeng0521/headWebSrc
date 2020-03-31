import React from 'react';
import styles from '../ARC_template.less';

let ChildrenDayPage4RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		let img_left  = detailData.img_intro&&detailData.img_intro.length > 0 ? detailData.img_intro[0].imgurl : '';
		let img_right = detailData.img_intro&&detailData.img_intro.length > 1 ? detailData.img_intro[1].imgurl : '';
		let img_bottom = detailData.img_intro&&detailData.img_intro.length > 2 ? detailData.img_intro[2].imgurl : '';

		return (
			<div className="call_phone">
				<div className={styles.page4_background}>
					<div className={styles.common_top_img}>
						<div className={styles.common_top_title}>{detailData.title || ''}</div>
					</div>
					<div className={styles.page4_cover_image1} style={{backgroundImage : `url(${img_left})`}}></div>
					<div className={styles.page4_cover_image2} style={{backgroundImage : `url(${img_right})`}}></div>
					<div className={styles.page4_cover_image3} style={{backgroundImage : `url(${img_bottom})`}}></div>
				</div>
			</div>
		)
	}
});

export default ChildrenDayPage4RenderComponent;
