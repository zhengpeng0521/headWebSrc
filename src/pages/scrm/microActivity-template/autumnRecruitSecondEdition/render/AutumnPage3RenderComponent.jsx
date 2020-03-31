import React from 'react';
import styles from '../autumn_template.less';

let ChildrenDayPage3RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		let cover1  = detailData.img_intro&&detailData.img_intro.length > 0 ? `url(${detailData.img_intro[0].imgurl})` : '';
		let cover2 = detailData.img_intro&&detailData.img_intro.length > 1 ? `url(${detailData.img_intro[1].imgurl})`: '';

		let contentArr = detailData.content&&detailData.content.length > 0 ? detailData.content.split('\n') : '';

		return (
			<div className="call_phone">
				<div className={styles.page3_background}>
					<div className={styles.page3_tio_image}></div>
					<div className={styles.common_top_title}>{detailData.title || ''}</div>
					<div className={styles.page3_content}>
					{
						contentArr&&contentArr.map((item, index) => {
							return <p key={index} className={styles.pageThreeTextItem}>{item}</p>
						})
					}
					</div>
				</div>
			</div>
		)
	}
});

export default ChildrenDayPage3RenderComponent;
