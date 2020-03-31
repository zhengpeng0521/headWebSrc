import React from 'react';
import styles from '../LegoOne_tenmplate.less';

let ChildrenDayPage3RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		let cover1  = detailData.img_intro&&detailData.img_intro.length > 0 ? `url(${detailData.img_intro[0].imgurl})` : '';
		let cover2 = detailData.img_intro&&detailData.img_intro.length > 1 ? `url(${detailData.img_intro[1].imgurl})` : '';

		return (
			<div className="lego_one">
				<div className={styles.page3_background}>
					<div className={styles.commonTitleBoxImage}>
						<div className={styles.pageThreeTitleBox}>
							<div className={styles.pageThreeTitleText}>{detailData.title || ''}</div>
						</div>
					</div>
					<div className={styles.pageThreeCoverImage} style={{backgroundImage : cover1}}></div>
					<div className={styles.pageThreeCoverImage} style={{backgroundImage : cover2}}></div>
					<div className={styles.pageThreeBottomImage}></div>
					<div className={styles.pageThreeChaorenImage}></div>
					<div className={styles.pageThreeChaorenPifengImage}></div>
				</div>
			</div>
		)
	}
});

export default ChildrenDayPage3RenderComponent;
