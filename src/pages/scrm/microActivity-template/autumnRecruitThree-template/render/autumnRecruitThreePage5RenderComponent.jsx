import React from 'react';
import styles from '../autumnRecruitThree_template.less';

let ChidlrenDayPage5RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className="three_autumn_recruit_phone">
				<div className={styles.page5_background}>
					<div className={styles.common_top_title}>{detailData.title || ''}</div>
					<div className={styles.page5_girl_image}></div>
					<div className={styles.page5_bool_image}></div>
					<div className={styles.page5_num_image}></div>
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
