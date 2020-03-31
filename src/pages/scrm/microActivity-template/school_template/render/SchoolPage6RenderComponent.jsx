import React from 'react';
import styles from '../school_template.less';

let ChildrenDayPage4RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){

		let { detailData } = this.props;

		let textArr = detailData.content.length > 0 ? detailData.content.split('\n') : '';

		return (
			<div className="base_school_would_be_starting">
				<div className={styles.background_page6_image}>
					<div className={styles.pageSixeBoxPersonImage}></div>
					<div className={styles.pageSixeBoxPersonhandImage}></div>
					<div className={styles.pageSixeBoxEarthJiaziImage}></div>
					<div className={styles.pageSixeBoxEarthImage}></div>
					<div className={styles.pageSixBoxTitle}>{detailData.title || ''}</div>
					<div className={styles.pageSixeBoxContent}>
						{
							textArr&&textArr.map((item, index) => {
								return <p key={index} className={styles.pageSixBoxContentItem}>{item}</p>
							})
						}
					</div>
				</div>
			</div>
		)
	}
});

export default ChildrenDayPage4RenderComponent;
