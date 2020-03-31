import React from 'react';
import styles from '../LegoTwo_tenmplate.less';

let ChildrenDayPage4RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){

		let { detailData } = this.props;

		let textArr = detailData.content&&detailData.content.length > 0 ? detailData.content.split('\n') : [];

		return (
			<div className="lego_one">
				<div className={styles.page4_background}>
					<div className={styles.pageFourTitleText}>{detailData.title || ''}</div>
					<div className={styles.pageFourBgbox}>
						<div className={styles.pageFourTextbox}>
							{
								textArr&&textArr.map((item, index) => {
									return <div key={index} className={styles.pageFourContentItem}>{item}</div>
								})
							}
						</div>
					</div>
				</div>
				<div className={styles.pageFourLegoGif2Image}></div>
				<div className={styles.pageFourLegoGif1Image}></div>
			</div>
		)
	}
});

export default ChildrenDayPage4RenderComponent;
