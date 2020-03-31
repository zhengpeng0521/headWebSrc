import React from 'react';
import styles from './HomeLayout.less';
import { Row, Col, Button, Icon } from 'antd';
import BannerComponent from '../home-banner/BannerLayout';
import LeftComponent from '../home-left/LeftLayout';
import RightComponent from '../home-right/RightLayout';
import BottomComponent from '../home-bottom/BottomLayout';
import ClassSchedule from '../../../pages/erp/class-schedule/ClassSchedule';
import StuSignPage from '../../../pages/erp/stu-sign/StuSignPage';

function HomeComponent ({

	obj, //存储所有数据

 }) {

	let blockData = [{ title : '已上架课程', num : '30'},
					 { title : '已上架活动', num : '30'},
					 { title : '今日新增订单', num : '30'},
					 { title : '待核销商品', num : '30'}
					];
	
	let rightData = [{ title : '今日新增预约', num : '30'},
					 { title : '待处理预约', num : '30'}
					];
	
	let BottomData = [{ title : '今日签到', num : '30'},
					 { title : '待分班学员', num : '30'},
					 { title : '云盘剩余空间', num : '30'}
					];

	//点击事件
	function callbackFunction(tag) {
		obj.touchButtonJumpFunction(tag);
	}

	//传入banner数据
	let bannerData = {
		bannerData: {
			autoPlay	: true,
 			autoPlaySpeed : 3000,
		}
	}

	//左侧布局
	let leftLayoutArr = [], bottomLayoutArr = [];

	let LeftLayout = (
		blockData&&blockData.length?blockData.map(function(item,index) {
			let icon = index == 0 ? 'home-kc' : index==1 ? 'home-hd' : index == 2 ? 'menu-yyguanli' : 'home-ddhx';
			let LeftData = {
				leftData : {
					num : item.num,
					title : item.title,
					icon,
				}
			};
			return leftLayoutArr.push(
						<Col className="gutter-row" span={12} key={index}>
								<div className={styles.gutter_box_left} onClick={() => callbackFunction(index + 1)}>
									<LeftComponent {...LeftData} />
								</div>
						</Col>
			)}) : ''
	)

	//下侧布局
	let BottomLayout = (
		BottomData&&BottomData.length ? BottomData.map(function(item,index) {
			let icon		 = index == 0 ? 'home-jrqd' : index == 1 ? 'home-dfbxy' : 'home-yp';
			let buttonText 	 = index == 0 ? '学员签到' : index == 1 ? '学员分班' : '空间升级';
			let unit		 = index == 0 ? '次':index == 1 ? '名' : 'G';
			let tag			 = index == 0 ? 11 : index == 1 ? 12 : 13;
			let BottomData 	 = {
				bottomData : {
					num : item.num,
					title : item.title,
					buttonText,
					icon,
					unit,
					tag,
					callbackFunction,
				}
			};

			return bottomLayoutArr.push(
				<Col className="gutter-row" span={8} key={index}>
					<div className={styles.gutter_box_bottom}>
						<BottomComponent
							{...BottomData}
						/>
					</div>
				</Col>
			)}) : ''
	)

	return (

  		<div className="home_base">
			<div className="home_banner">
				<BannerComponent {...bannerData} />
			</div>

			<div className="home_content_left">
				<div className="gutter-example"><Row gutter={5}>{leftLayoutArr}</Row></div>
			</div>

			<div className="home_content_right">
				<div className="gutter-example">
					<Row gutter={0}>
					  	<Col className="gutter-row" span={24} >
							<div className={styles.gutter_box_right} onClick={() => callbackFunction(5)}
								style={{borderRadius: '10px 0px 0px 10px'}}>
								<RightComponent rightData={rightData[0]} icon_name="home-xzyy" />
							</div>

							<div className={styles.left_line} />

							<div className={styles.gutter_box_right} onClick={() => callbackFunction(6)}>
								<RightComponent rightData={rightData[1]} icon_name="home-dclyy" />
							</div>

							<div className={styles.right_line} />

							<div className={styles.gutter_box_right} onClick={() => callbackFunction(7)}
								style={{borderRadius: '0px 10px 10px 0px'}}>
								<div className={styles.appointment_img}>
									<Icon type="home-jia"style={{fontSize: 70, marginTop: 20, color: 'rgb(217,217,217)'}}></Icon>
								</div>
								<p className={styles.appointment_p}>预约信息设置</p>
							</div>
					  	</Col>
					</Row>
				 </div>
			</div>

			<div className="home_content_bottom">
				<div className="gutter-example">
					<Row gutter={10}>{bottomLayoutArr}</Row>
				 </div>
			</div>
			<div className={styles.home_class_schedule_cont}>
                <ClassSchedule filterType={['org', 'class', 'course', 'teacher', 'sutdent']} />
            </div>
			<StuSignPage />
		</div>
  	)
}

export default HomeComponent;
