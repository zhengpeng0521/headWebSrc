import React from 'react';
import styles from '../school_template.less';

let ChildrenDayPage3RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		let textArr = detailData.content.length > 0 ? detailData.content.split('\n') : '';

		return (
			<div className="base_school_would_be_starting">
				<div className={styles.background_page3_image}>
					<div className={styles.pageThreeBookBoxTitle}>{detailData.title || ''}</div>
					<div className={styles.pageThreeBoxContent}>
						{
							textArr&&textArr.map((item, index) => {
								return <p key={index} className={styles.pageThreeBoxContentItem}>{item}</p>
							})
						}
					</div>
					<div className={styles.pageThreePersonImage}></div>
					<div className={styles.pageThreePencilImage}></div>
					<div className={styles.pageThreepaintingImage}></div>
				</div>
			</div>
		)
	}
});

export default ChildrenDayPage3RenderComponent;
