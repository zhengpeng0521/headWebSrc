import React from 'react';
import styles from '../school_template.less';

let ChildrenDayPage2RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		let textArr = detailData.content.length > 0 ? detailData.content.split('\n') : '';

		return (
			<div className="base_school_would_be_starting">
				<div className={styles.background_page2_image}>
					<div className={styles.pageTwoPerson}></div>
					<div className={styles.pageTwoPersonEyes}></div>
					<div className={styles.pageTwoBookBoxImage}>
						<div className={styles.pageTwoBookBoxTitle}>{detailData.title || ''}</div>
						<div className={styles.pageTwoBoxContent}>
							{
								textArr&&textArr.map((item, index) => {
									return <p key={index} className={styles.pageTwoBoxContentItem}>{item}</p>
								})
							}
						</div>
					</div>
				</div>
			</div>
		)
	}
});

export default ChildrenDayPage2RenderComponent;
