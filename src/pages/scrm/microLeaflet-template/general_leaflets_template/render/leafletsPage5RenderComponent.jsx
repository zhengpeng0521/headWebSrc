import React from 'react';
import styles from '../leaflets_template.less';

let LeafletsPage5RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		let imageArr = [
			{url : `url(${detailData.img_intro.length > 0 ? detailData.img_intro[0].imgurl : ''})`, text : detailData.sub_title2 || ''},
			{url : `url(${detailData.img_intro.length > 1 ? detailData.img_intro[1].imgurl : ''})`, text : detailData.sub_title3 || ''},
			{url : `url(${detailData.img_intro.length > 2 ? detailData.img_intro[2].imgurl : ''})`, text : detailData.sub_title4 || ''}
		]

		return (
			<div className = 'page-render-design leaflets_page2_render' >
				<div className={styles.page5_bg}>
					<div>
						<div className={styles.page2_image}>{detailData.title || ''}</div>
						{
							imageArr&&imageArr.map((item, index) => {
								return <div key={index}>
											<div className={styles.page5_cover}
												style={{
													backgroundImage : item.url,
													animationDelay : 300 * index++ + 'ms'
												}}
											>
											</div>
											<div className={styles.page5_text}
												style={{animationDelay : 150 * index++ + 'ms'}}
											>
												{item.text}
											</div>
										</div>
							})
						}
						<div className={styles.page5_person1}></div>
						<div className={styles.page5_person2}></div>
					</div>
				</div>
			</div>
		)
	}
});

export default LeafletsPage5RenderComponent;
