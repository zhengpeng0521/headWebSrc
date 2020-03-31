import React from 'react';
import styles from '../autumn_template.less';

let ChildrenDayPage4RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		let cover1  = detailData.img_intro&&detailData.img_intro.length > 0 ? `url(${detailData.img_intro[0].imgurl})` : '';
		let cover2 = detailData.img_intro&&detailData.img_intro.length > 1 ? `url(${detailData.img_intro[1].imgurl})` : '';
		let cover3 = detailData.img_intro&&detailData.img_intro.length > 2 ? `url(${detailData.img_intro[2].imgurl})` : '';

		return (
			<div className="call_phone">
				<div className={styles.page4_background}>
					<div className={styles.page3_tio_image}></div>
					<div className={styles.common_top_title}>{detailData.title || ''}</div>
					<div className={styles.page4_cover_image1} style={{backgroundImage : cover1}}></div>
					<div className={styles.page4_cover_image2} style={{backgroundImage : cover2}}></div>
				</div>
			</div>
		)
	}
});

export default ChildrenDayPage4RenderComponent;
