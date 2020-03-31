import React from 'react';
import styles from '../LegoOne_tenmplate.less';

let ChildrenDayPage2RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		let cover = detailData.img_intro&&detailData.img_intro.length > 0 ? `url(${detailData.img_intro[0].imgurl})` : '';
		let textArr = detailData.intro&&detailData.intro.length > 0 ? detailData.intro.split('\n') : '';

		return (
			<div className="lego_one">
				<div className={styles.page2_background}>
					<div className={styles.pageTwoTitleBox}>
						<div className={styles.pageTwoTitleText}>{detailData.title || ''}</div>
					</div>
					<div className={styles.pageTwoCoverBox}>
						<div className={styles.pageTwoCover} style={{backgroundImage : cover}}></div>
					</div>
					<div className={styles.pageTwoText}>
					{
						textArr&&textArr.map((item, index) => {
							return <p key={index} className={styles.pageTwoTextItem}>{item}</p>
						})
					}
					</div>
					<div className={styles.pageTwoIronManImage}></div>
					<div className={styles.pageTwoBottomImage}></div>
				</div>
			</div>
		)
	}
});

export default ChildrenDayPage2RenderComponent;
