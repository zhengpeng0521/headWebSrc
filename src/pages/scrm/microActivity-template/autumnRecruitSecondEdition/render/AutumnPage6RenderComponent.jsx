import React from 'react';
import styles from '../autumn_template.less';

let ChildrenDayPage3RenderComponent = React.createClass({

	getInitialState() {
		return {

		}
	},

	render(){

		let { detailData } = this.props;
		return (
			<div className="call_phone">
				<div className={styles.page6_background}>
					<div className={styles.page5_top_image}></div>
					<div className={styles.page5_common_top_title}>{detailData.title || ''}</div>
					{
						detailData.img_intro&&detailData.img_intro.map((item, index) => {
							let url = `url(${item.imgurl})`;
							return  <div key={index} className={styles.page6_image}
										style={{
											backgroundImage : url,
										}}>
									</div>
						})
					}
				</div>
			</div>
		)
	}
});

export default ChildrenDayPage3RenderComponent;
