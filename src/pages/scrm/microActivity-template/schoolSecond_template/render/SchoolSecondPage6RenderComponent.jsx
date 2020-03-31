import React from 'react';
import styles from '../schoolSecond_template.less';

let ChildrenDayPage4RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){

		let { detailData } = this.props;

		let textArr = detailData.content.length > 0 ? detailData.content.split('\n') : '';

		return (
			<div className="base_school_would_be_starting_second">
				<div className={styles.background_page6_image}>
					<div className={styles.commonTitleImage}>
						<div className={styles.pageTwoBookBoxTitle}>{detailData.title || ''}</div>
					</div>
					<div className={styles.pageTwoContentBoxImage}>
						<div className={styles.pageSixeBoxContent}>
							{
								textArr&&textArr.map((item, index) => {
									return <div key={index} className={styles.pageSixBoxContentItem}>{item}</div>
								})
							}
						</div>
					</div>
					<div className={styles.PageSixGrassImage}></div>
					<div className={styles.PageSixGirlImage}></div>
					<div className={styles.PageSixboyImage}></div>
					<div className={styles.pageThreePlaneImage}></div>
				</div>
			</div>
		)
	}
});

export default ChildrenDayPage4RenderComponent;
