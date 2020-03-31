import React from 'react';
import styles from '../AutumuTwo_tenmplate.less';

let ChildrenDayPage2RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		let textArr = detailData.intro.length > 0 ? detailData.intro.split('\n') : '';

		let cover  = detailData.img_intro&&detailData.img_intro.length > 0 ? `url(${detailData.img_intro[0].imgurl})` : '';

		return (
			<div className="autumn_two">
				<div className={styles.page2_background}>
					<div className={styles.pageTwoTopImage1}></div>
					<div className={styles.pageTwoTopImage2}></div>
					<div className={styles.pageTwoTopImage3}></div>
					<div className={styles.pageTwoTopImage4}></div>

					<div className={styles.pageTwoTitleText}>{detailData.title || ''}</div>
					<div className={styles.pageTwoCover} style={{backgroundImage : cover}}></div>
					<div className={styles.pageTwoText}>
					{
						textArr&&textArr.map((item, index) => {
							return <p key={index} className={styles.pageTwoTextItem}>{item}</p>
						})
					}
					</div>
				</div>
				<div className={styles.pageTwoBottomRabbitImage}></div>
				<div className={styles.pageTwoBottomDragonflyImage}></div>
				<div className={styles.pageTwoBottomImage}></div>
			</div>
		)
	}
});

export default ChildrenDayPage2RenderComponent;
