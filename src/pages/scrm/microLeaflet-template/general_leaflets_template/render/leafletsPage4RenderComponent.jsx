import React from 'react';
import styles from '../leaflets_template.less';

let LeafletsPage4RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		let stringArr = [];
		for(let i = 0; i < Object(detailData.content).length; i++) {
			stringArr.push(Object(detailData.content)[i]);
		}

		return (
			<div className = 'page-render-design leaflets_page4_render'>
				<div className={styles.page4_bg}>
					<div>
						<div className={styles.page2_image}>{detailData.title || ''}</div>
						<div className={styles.page4_text_div}>
							{
								stringArr&&stringArr.map((item, index) => {
									return <div key={index}
												className={styles.page4_print_text}
												style={{animationDelay : index * 100 + 'ms'}}
											>
											{item}
											</div>
								})
							}
						</div>
						<div className={styles.page4_qiqiu}></div>
						<div className={styles.page4_pencil1}></div>
						<div className={styles.page4_pencil2}></div>
						<div className={styles.page4_book}></div>
					</div>
				</div>
			</div>
		)
	}
});

export default LeafletsPage4RenderComponent;
