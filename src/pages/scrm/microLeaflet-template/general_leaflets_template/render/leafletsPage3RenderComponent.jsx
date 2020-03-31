import React from 'react';
import styles from '../leaflets_template.less';

let LeafletsPage3RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className = 'page-render-design leaflets_page3_render' >
				<div className={styles.page3_bg}>
					<div>
						<div className={styles.page2_image}>{detailData.title || ''}</div>
						<div className={styles.page3_content}>
							<div className={styles.page3_content_text}>
								{detailData.content || ''}
							</div>
						</div>
						<div className={styles.page3_image_brush}></div>
						<div className={styles.page3_image_person_female}></div>
						<div className={styles.page3_image_person_man}></div>
						<div className={styles.page3_image_red}></div>
						<div className={styles.page3_image_yellow}></div>
						<div className={styles.page3_image_blue}></div>
					</div>
				</div>
			</div>
		)
	}
});

export default LeafletsPage3RenderComponent;
