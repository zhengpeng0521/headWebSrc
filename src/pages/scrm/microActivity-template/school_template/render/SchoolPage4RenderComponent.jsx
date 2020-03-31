import React from 'react';
import styles from '../school_template.less';

let ChildrenDayPage4RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		let url1 = detailData.img_intro&&detailData.img_intro.length > 0 ? `url(${detailData.img_intro[0].imgurl}!s300)` : '';
		let url2 = detailData.img_intro&&detailData.img_intro.length > 1 ? `url(${detailData.img_intro[1].imgurl}!s300)` : '';


		return (
			<div className="base_school_would_be_starting">
				<div className={styles.background_page4_image}>
					<div className={styles.pageFourBoxPerson}></div>
					<div className={styles.pageFourBoxPersonArm}></div>
					<div className={styles.pageFourBoxTitle}>{detailData.title || ''}</div>
					<div className={styles.pageFourBoxCover1Image} style={{backgroundImage : url1}}></div>
					<div className={styles.pageFourBoxCover2Image} style={{backgroundImage : url2}}></div>
				</div>
			</div>
		)
	}
});

export default ChildrenDayPage4RenderComponent;
