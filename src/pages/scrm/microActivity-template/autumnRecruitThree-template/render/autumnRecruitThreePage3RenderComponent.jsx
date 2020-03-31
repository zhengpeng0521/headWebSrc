import React from 'react';
import styles from '../autumnRecruitThree_template.less';

let ChildrenDayPage3RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		
		let cover1  = detailData.img_intro&&detailData.img_intro.length > 0 ? detailData.img_intro[0].imgurl : '';
		let cover2 = detailData.img_intro&&detailData.img_intro.length > 1 ? detailData.img_intro[1].imgurl : '';
		
		return (
			<div className="three_autumn_recruit_phone">
				<div className={styles.page3_background}>
					<div className={styles.common_top_title}>{detailData.title || ''}</div>
					<div className={styles.page3_letter}></div>
					<div className={styles.page3_hat}></div>
					<div className={styles.page3_cover_left} style={{backgroundImage :  `url(${cover1})`}}></div>
					<div className={styles.page3_text_left}>{detailData.title1 || ''}</div>
					<div className={styles.page3_text_right}>{detailData.title2 || ''}</div>
					<div className={styles.page3_cover_right} style={{backgroundImage : `url(${cover2})`}}></div>
				</div>
			</div>
		)
	}
});

export default ChildrenDayPage3RenderComponent;
