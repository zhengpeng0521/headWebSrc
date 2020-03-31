import React from 'react';
import styles from '../dance_template.less';

let MusicPage5RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		let contentArr = !!detailData && !!detailData.content && detailData.content.split('\n');

		return (
			<div className = "dance">
				<div className={styles.background_page5_image}>
					<div className={styles.page5_title}>{detailData.title || ''}</div>
					<div className={styles.page2_box_img}>
						<img src={detailData.qrUrl || ''} className={styles.page5_qr_code} />
						{
							contentArr&&contentArr.map((item, index) => {
								return <p key={index} className={styles.page2_content}>{item}</p>
							})
						}
					</div>
					<div className={styles.page5_person_image}></div>
				</div>
			</div>
		)
	}
});

export default MusicPage5RenderComponent;
