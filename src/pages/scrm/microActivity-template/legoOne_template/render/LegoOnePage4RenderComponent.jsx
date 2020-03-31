import React from 'react';
import styles from '../LegoOne_tenmplate.less';

let ChildrenDayPage4RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){

		let { detailData } = this.props;

		let cover1 = detailData.img_intro&&detailData.img_intro.length > 0 ? `url(${detailData.img_intro[0].imgurl})` : '';
		let cover2 = detailData.img_intro&&detailData.img_intro.length > 1 ? `url(${detailData.img_intro[1].imgurl})` : '';

		let textArr = detailData.content&&detailData.content.length > 0 ? detailData.content.split('\n') : [];

		return (
			<div className="lego_one">
				<div className={styles.page4_background}>
					<div className={styles.pageFourTitleText}>{detailData.title || ''}</div>
					<div className={styles.pageFourBgbox}>
						<div className={styles.pageFourTextbox}>
							{
								textArr&&textArr.map((item, index) => {
									return <p key={index} className={styles.pageFourContentItem}>{item}</p>
								})
							}
						</div>
					</div>
				</div>
				<div className={styles.pageFourBatmanImage}></div>
				<div className={styles.pageFourBottomImage}></div>
			</div>
		)
	}
});

export default ChildrenDayPage4RenderComponent;
