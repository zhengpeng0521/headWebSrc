import React from 'react';
import styles from '../leaflets_template.less';

let LeafletsPage2RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className = 'page-render-design leaflets_page2_render' >
				<div className={styles.page2_bg}>
					<div>
						<div className={styles.page2_image}>{detailData.title || ''}</div>
						{
							detailData.img_intro&&detailData.img_intro.map((item, index)=> {
								return  <div className={styles.page2_image_div} key={index}>
											<div className={styles.page2_image_content} style={{backgroundImage : `url(${item.imgurl || ''})`}}>
												<div className={styles.page2_image_content_border}
													 style={(index != 1 || index != 2) ? {animationDelay : 0.5} : {animationDelay : 0}}>
												</div>
											</div>
										</div>
							})
						}
						<div className={styles.page2_image_star}></div>
						<div className={styles.page2_image_person_female}></div>
						<div className={styles.page2_image_person_man}></div>
						<div className={styles.page2_image_applause}></div>
						<div className={styles.page2_image_book}></div>
						<div className={styles.page2_image_potted}></div>
					</div>
				</div>
			</div>
		)
	}
});

export default LeafletsPage2RenderComponent;
