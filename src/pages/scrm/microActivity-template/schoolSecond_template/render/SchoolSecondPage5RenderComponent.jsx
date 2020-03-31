import React from 'react';
import styles from '../schoolSecond_template.less';

let ChidlrenDayPage5RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		let textArr = detailData.content.length > 0 ? detailData.content.split('\n') : '';

		return (
			<div className="base_school_would_be_starting_second">
				<div className={styles.background_page5_image}>
					<div className={styles.pageFourBaseImage}></div>
					<div className={styles.commonTitleImage}>
						<div className={styles.pageTwoBookBoxTitle}>{detailData.title || ''}</div>
					</div>
					<div className={styles.pageTwoContentBoxImage}>
						<div className={styles.pageFiveBoxContent}>
							{
								textArr&&textArr.map((item, index) => {
									return <p key={index} className={styles.pageFiveBoxContentItem}>{item}</p>
								})
							}
						</div>
					</div>
					<div className={styles.pageFiveBoxPersonImage}></div>
					<div className={styles.pageFiveBoxLabaImage}></div>
				</div>
			</div>
		)
	}
});

export default ChidlrenDayPage5RenderComponent;
