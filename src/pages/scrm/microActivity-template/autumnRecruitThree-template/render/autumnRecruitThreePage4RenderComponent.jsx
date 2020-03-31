import React from 'react';
import styles from '../autumnRecruitThree_template.less';

let ChildrenDayPage4RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		let cover1  = detailData.img_intro&&detailData.img_intro.length > 0 ? detailData.img_intro[0].imgurl : '';
		let cover2 = detailData.img_intro&&detailData.img_intro.length > 1 ? detailData.img_intro[1].imgurl : '';
		let cover3 = detailData.img_intro&&detailData.img_intro.length > 2 ? detailData.img_intro[2].imgurl : '';

		return (
			<div className="three_autumn_recruit_phone">
				<div className={styles.page4_background}>
					<div className={styles.common_top_title}>{detailData.title || ''}</div>
					<div className={styles.page4_cover_image1} style={{backgroundImage : `url(${cover1})`}}></div>
					<div className={styles.page4_cover_image2} style={{backgroundImage : `url(${cover2})`}}></div>
					<div className={styles.page4_cover_image3} style={{backgroundImage : `url(${cover3})`}}></div>
					<div className={styles.page4_boy_image}></div>
					<div className={styles.page4_number_image}></div>
					<div className={styles.page4_jiangbei_image}></div>
				</div>
			</div>
		)
	}
});

export default ChildrenDayPage4RenderComponent;
