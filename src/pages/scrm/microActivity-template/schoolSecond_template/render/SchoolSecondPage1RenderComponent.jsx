import React from 'react';
import styles from '../schoolSecond_template.less';

let ChildrenDayPage1RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		let header_url = `url(${detailData.imgUrl || ''})`;

		return (
			<div className="base_school_would_be_starting_second">
				<div className={styles.background_page1_image}>
					<div className={styles.pageOneKaixueImage}></div>
					<div className={styles.pageOneHornImage}></div>
					<div className={styles.pageOnePersonImage}></div>
					<div className={styles.pageOneHouseImage}></div>
					<div className={styles.pageOneCarImage}></div>
					<div className={styles.pageOneHederImage} style={{backgroundImage : header_url}}></div>
					<div className={styles.pageOneContentText}>{detailData.title || ''}</div>
				</div>
			</div>
		)
	}
});

export default ChildrenDayPage1RenderComponent;
