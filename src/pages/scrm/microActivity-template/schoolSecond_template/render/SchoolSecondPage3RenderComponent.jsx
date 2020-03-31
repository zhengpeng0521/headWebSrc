import React from 'react';
import styles from '../schoolSecond_template.less';

let ChildrenDayPage3RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		let textArr = detailData.content.length > 0 ? detailData.content.split('\n') : '';

		return (
			<div className="base_school_would_be_starting_second">
				<div className={styles.background_page3_image}>
					<div className={styles.commonTitleImage}>
						<div className={styles.pageTwoBookBoxTitle}>{detailData.title || ''}</div>
					</div>

					<div className={styles.pageTwoContentBoxImage}>
						<div className={styles.pageTwoBoxContent}>
							{
								textArr&&textArr.map((item, index) => {
									return <p key={index} className={styles.pageTwoBoxContentItem}>{item}</p>
								})
							}
						</div>
					</div>
					<div className={styles.pageThreeCarImage}></div>
					<div className={styles.pageThreePlaneImage}></div>
				</div>
			</div>
		)
	}
});

export default ChildrenDayPage3RenderComponent;
