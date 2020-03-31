import React from 'react';
import styles from '../school_template.less';

let ChidlrenDayPage5RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		let textArr = detailData.content.length > 0 ? detailData.content.split('\n') : '';

		return (
			<div className="base_school_would_be_starting">
				<div className={styles.background_page5_image}>
					<div className={styles.pageFiveBoxTitle}>{detailData.title || ''}</div>
					<div className={styles.pageFiveBoxContent}>
						{
							textArr&&textArr.map((item, index) => {
								return <p key={index} className={styles.pageFiveBoxContentItem}>{item}</p>
							})
						}
					</div>
					<div className={styles.pageFiveBoxPersonImage}></div>
					<div className={styles.pageFiveBoxPersonLegImage}></div>
					<div className={styles.pageFiveBoxPersonBallImage}></div>
				</div>
			</div>
		)
	}
});

export default ChidlrenDayPage5RenderComponent;
