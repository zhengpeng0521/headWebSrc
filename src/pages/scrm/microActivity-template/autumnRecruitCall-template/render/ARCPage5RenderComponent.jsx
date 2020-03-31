import React from 'react';
import styles from '../ARC_template.less';

let ChidlrenDayPage5RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className="call_phone">
				<div className={styles.page5_background}>
					<div className={styles.common_top_img}>
						<div className={styles.common_top_title}>{detailData.title || ''}</div>
					</div>
					{
						detailData.intro&&detailData.intro.map((item, index) => {
							return <div key={index} >
										<div className={styles.page5_header_icon}></div>
										<div className={styles.page5_info}>{item.value}</div>
									</div>
						})
					}
				</div>
			</div>
		)
	}
});

export default ChidlrenDayPage5RenderComponent;
