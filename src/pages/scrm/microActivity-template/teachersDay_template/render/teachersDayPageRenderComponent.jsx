import React from 'react';
import styles from '../teachersDay_template.less';

let SummerCampPageRenderComponent = React.createClass({

	render(){
		let { detailData } = this.props;
		
		let content1Arr = !!detailData && !!detailData.twoContent && detailData.twoContent.split('\n');
		let content2Arr = !!detailData && !!detailData.threeContent && detailData.threeContent.split('\n');
		
		return (
			<div className = 'teachers_day'>
				<div className={styles.layoutBlackboard}>
					<div className={styles.layoutArtWords}></div>
					<div className={styles.layoutPieceChalk}></div>
					<div className={styles.layoutTitleText}>{detailData.oneTitle || ''}</div>
				</div>
				<div className={styles.layoutSubTitleText}>{detailData.oneSubTitle || ''}</div>
				{
					detailData.intro&&detailData.intro.map((item, index) => {
						return <div className={styles.layoutSubtime}>{item.label}:{item.value}</div>
					})
				}
				<div className={styles.layoutTeacherImage}></div>
				<div className={styles.layoutStudentImage}></div>
				<div className={styles.layoutFloorImage}></div>
				{/*第二页布局*/}
				<div className={styles.layoutTwoBlackboard}>
					<div className={styles.layoutTwoTopleftImage}></div>
					<div className={styles.layoutTwoTitleText}>{detailData.twoTitle || ''}</div>
					<div className={styles.layoutTwoTitleline}></div>
					<div className={styles.layoutTwoSubTitleText}>{detailData.twosubTitle || ''}</div>
					<div className={styles.layoutTwoContentText}>
						{
							content1Arr&&content1Arr.map((item, index) => {
								return <p key={index} className={styles.layoutTwoContentTextItem}>{item}</p>
							})
						}
					</div>
				</div>
				<div className={styles.layoutTwoAlarmClockImage}></div>
				<div className={styles.layoutTwoPersonImage}></div>
				{/*第三页布局*/}
				<div className={styles.layoutThreeBlackboard}>
					<div className={styles.layoutThreeYuanguiImage}></div>
					<div className={styles.layoutThreeTitleText}>{detailData.threeTitle || ''}</div>
					<div className={styles.layoutThreeTitleline}></div>
					<div className={styles.layoutTwoContentText}>
						{
							content2Arr&&content2Arr.map((item, index) => {
								return <p key={index} className={styles.layoutTwoContentTextItem}>{item}</p>
							})
						}
					</div>
				</div>
				<div className={styles.layoutThreePersonImage}></div>
				{/*第四页*/}
				<div className={styles.layoutFourBlackboard}>
					<div className={styles.layoutFourTitleText}>{detailData.forTitle || ''}</div>
					<div className={styles.layoutFourTitleline}></div>
					<div className={styles.layoutFourInoutBox}>
						<div className={styles.inputName}>学员姓名</div>
						<div className={styles.inputMobile}>联系方式</div>
						<div className={styles.inputBirthday}>学员生日</div>
						<div className={styles.inputSubmit}>提交</div>
					</div>
				</div>
				<div className={styles.layoutFourPersonImage}></div>
			</div>
		)
	}
});

export default SummerCampPageRenderComponent;
