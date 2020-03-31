import React from 'react';
import styles from '../autumn_template.less';

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
					<div className={styles.page5_top_image}></div>
					<div className={styles.page5_common_top_title}>{detailData.title || ''}</div>
					{
						detailData.intro&&detailData.intro.map((item, index) => {
							return <div key={index} >
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
