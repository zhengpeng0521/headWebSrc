import React from 'react';
import styles from '../leaflets_template.less';

let LeafletsPage7RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		let contentTextArr = detailData.content&&detailData.content.length > 0 ? detailData.content.split('\n') : '';

		return (
			<div className = 'page-render-design leaflets_page2_render' >
				<div className={styles.page5_bg}>
					<div>
						<div className={styles.page2_image}>{detailData.title}</div>
						<div className={styles.page7_content}>
							<div className={styles.page7_content_title}>{detailData.subTitle || ''}</div>
							<img src={detailData.qrImgUrl || ''} className={styles.page7_code}/>
							<div className={styles.page7_content_text}>
								{
									contentTextArr&&contentTextArr.map((item, index) => {
										return <p className={styles.page7_content_text_item}>{item}</p>
									})
								}
							</div>
						</div>
						<div className={styles.page7_person1}></div>
						<div className={styles.page7_person2}></div>
						<div className={styles.page7_image1}></div>
					</div>
				</div>
			</div>
		)
	}
});

export default LeafletsPage7RenderComponent;

