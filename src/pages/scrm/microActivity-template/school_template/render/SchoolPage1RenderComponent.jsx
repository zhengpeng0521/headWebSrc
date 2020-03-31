import React from 'react';
import styles from '../school_template.less';

let ChildrenDayPage1RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		let header_url = `url(${detailData.imgUrl || ''})`;

		return (
			<div className="base_school_would_be_starting">
				<div className={styles.background_page1_image}>
					<div className={styles.pageOneHederImageBox}>
						<div className={styles.pageOneZipperImage}></div>
					</div>
					<div className={styles.pageOneHederImage} style={{backgroundImage : header_url}}></div>
					<div className={styles.pageOneKaixueImage}></div>
					<div className={styles.pageOneBGShenImage}></div>
					<div className={styles.pageOneBGImage}></div>
					<div className={styles.pageOneContent}>
						<div className={styles.pageOneContentText}>{detailData.title || ''}</div>
					</div>
					<div className={styles.pageOneBookImage}></div>
					<div className={styles.pageOneGrilImage}></div>
					<div className={styles.pageOnePocketImage}></div>
				</div>
			</div>
		)
	}
});

export default ChildrenDayPage1RenderComponent;
