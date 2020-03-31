/**
 * 模板实例编辑窗口
 * @author yhwu
 */
import React from 'react';
import { Modal , Button } from 'antd';

import '../microLeaflet-template/template-instance-form.less';

//圣诞模板
let ChristmasRenderComponent = require('./christmas_template/render/ChristmasRenderComponent');
let ChristmasDesignComponent = require('./christmas_template/design/ChristmasDesignComponent');

//招生通用模板
let EnrollmentRenderComponent = require('./enrollment_template/render/enrollmentRenderComponent');
let EnrollmentDesignComponent = require('./enrollment_template/design/enrollmentDesignComponent');

//春节活动模板
let NewYearDesignComponent = require('./newYear_template/design/newYearDesignComponent');
let NewYearRenderComponent = require('./newYear_template/render/newYearRenderComponent');

//元宵节模板
let YuanxiaoDesignComponent = require('./yuanxiao_template/design/yuanxiaoDesignComponent');
let YuanxiaoRenderComponent = require('./yuanxiao_template/render/yuanxiaoRenderComponent');

//春游活动模板
let SpringDesignComponent = require('./spring_template/design/springDesignComponent');
let SpringRenderComponent = require('./spring_template/render/springRenderComponent');

//劳动节通用模板
let LabourDesignComponent = require('./labour_template/design/labourDesignComponent');
let LabourRenderComponent = require('./labour_template/render/labourRenderComponent');

//端午节通用模板
let DoanngoDesignComponent = require('./doanngo_template/design/doanngoDesignComponent');
let DoanngoRenderComponent = require('./doanngo_template/render/doanngoRenderComponent');

//母亲节通用模板
let MothersDayDesignComponent = require('./mothersDay_template/design/mothersDayDesignComponent');
let MothersDayRenderComponent = require('./mothersDay_template/render/mothersDayRenderComponent');

//六一儿童节模板
let ChildrenDayDesignComponent = require('./childrenDay_template/design/childrenDayDesignComponent');
let ChildrenDayRenderComponent = require('./childrenDay_template/render/childrenDayRenderComponent');

//父亲节
let FathersDayDesignComponent = require('./fathersDay_template/design/fathersDayDesignComponent');
let FathersDayRenderComponent = require('./fathersDay_template/render/fathersDayRenderComponent');

//暑期活动
let SummerDesignComponent = require('./summer_template/design/summerDesignComponent');
let SummerRenderComponent = require('./summer_template/render/summerRenderComponent');

//暑期培训模板
let SummerCultivateDesignComponent = require('./summer_cultivate_template/design/summerCultivateDesignComponent');
let SummerCultivateRenderComponent = require('./summer_cultivate_template/render/summerCultivateRenderComponent');

//夏令营活动模板
let SummerCampDesignComponent = require('./summer_camp_template/design/summerCampDesignComponent');
let SummerCampRenderComponent = require('./summer_camp_template/render/summerCampRenderComponent');

//秋招活动模板
let AutumnRecruitCallDesignComponent = require('./autumnRecruitCall-template/design/ARCDesignComponent');
let AutumnRecruitCallRenderComponent = require('./autumnRecruitCall-template/render/ARCRenderComponent');

//秋招活动第二版模板
let AutumnRecruitSecondCallDesignComponent = require('./autumnRecruitSecondEdition/design/AutumnDesignComponent');
let AutumnRecruitSecondCallRenderComponent = require('./autumnRecruitSecondEdition/render/AutumnRenderComponent');

//秋招活动第三版模板
let AutumnRecruitThreeCallDesignComponent = require('./autumnRecruitThree-template/design/autumnRecruitThreeDesignComponent');
let AutumnRecruitThreeCallRenderComponent = require('./autumnRecruitThree-template/render/autumnRecruitThreeRenderComponent');

//开始季模板
let SchoolDesignComponent = require('./school_template/design/SchoolDesignComponent');
let SchoolRenderComponent = require('./school_template/render/SchoolRenderComponent');

//秋游第一版模板
let AutumnOneDesignComponent = require('./autumnTourismOne-template/design/AutumuOneDesignComponent');
let AutumnOneRenderComponent = require('./autumnTourismOne-template/render/AutumuOneRenderComponent');

//秋游第二版模板
let AutumnTwoDesignComponent = require('./autumnTourismTwo-template/design/AutumuTwoDesignComponent');
let AutumnTwoRenderComponent = require('./autumnTourismTwo-template/render/AutumuTwoRenderComponent');

//开始季模板
let SchoolSecondDesignComponent = require('./schoolSecond_template/design/SchoolSecondDesignComponent');
let SchoolSecondRenderComponent = require('./schoolSecond_template/render/SchoolSecondRenderComponent');

//乐高第一版模板
let LegoDesignComponent = require('./legoOne_template/design/LegoOneDesignComponent');
let LegoRenderComponent = require('./legoOne_template/render/LegoOneRenderComponent');

//乐高第二版模板
let LegoTwoDesignComponent = require('./legoTwo_template/design/LegoTwoDesignComponent');
let LegoTwoRenderComponent = require('./legoTwo_template/render/LegoTwoRenderComponent');

//教师节模板
let TeachersDesignComponent = require('./teachersDay_template/design/teachersDayDesignComponent');
let TeachersRenderComponent = require('./teachersDay_template/render/teachersDayRenderComponent');

let TemplateInstanceForm = React.createClass({
	getInitialState() {
		return {
			initFlag        : true,
			currentPage     : '',
			mainData        : '',           //分享页面配置项
			detailData      : '',           //模板页面配置项
			activityTypeId  : this.props.activityTypeId || '',
		}
	},

	componentDidMount() {
		this.props.title == "新建微活动" ? this.initData() : '';
	},
	//修改初始化数据
	updateInit( activityId ){
		let me = this;
		serviceRequest( BASE_URL+"/microActivity/getActivity", { id : activityId }, function(res) {
			let mainData = res.data.activityData.mainData;
			let detailData = res.data.activityData.detailData;
			let activityTypeId = res.data.activityData.activityId;
			mainData = JSON.parse(mainData);
			detailData = JSON.parse(detailData);
			me.setState({
				currentPage : '',
				mainData : mainData,
				detailData : detailData,
				activityTypeId : activityTypeId
			})
		});
	},
	//初始化数据
	initData(activityTypeId){
		let me = this;
		setTimeout(function(){
			if( activityTypeId == 1 ){
				me.setState({
					mainData : {
						name : "美吉姆圣诞活动",
						bg_music : "http://saas.ishanshan.com/upload/1484105085475.mp3",
						bg_name : 'Jingle Bells.mp3',
						share_config : {
							title : '美吉姆邀您闹圣诞',
							imgurl: 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
							intro : '圣诞到，祝福到，美吉姆邀您一起闹圣诞。现在报名即可领取圣诞节大礼包，数量有限，先到先得'
						}
					}
				})
			} else if ( activityTypeId == 2 ){
				me.setState({
					//分享页面配置项
					mainData : {
						name : "美吉姆寒假班招生",
						bg_music : "http://saas.ishanshan.com/upload/1484105138583.mp3",
						bg_name : 'Depapepe-いい日だったね.mp3',
						share_config : {
							title : '美吉姆疯狂招生活动',
							imgurl: 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
							intro : '还在为孩子的寒假兴趣班发愁？赶快加入闪闪早教吧~现在报名可享8折优惠，名额有限，先到先得'
						}
					}
				})
			} else if ( activityTypeId == 3 ){
				me.setState({
					//分享页面配置项
					mainData     : {
						name     : "美吉姆春节活动",
						bg_music : "http://saas.ishanshan.com/upload/1484105179837.mp3",
						bg_name  : '喜气洋洋 共贺春年.mp3',
						share_config : {
							title  : '美吉姆邀您闹春节',
							imgurl : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
							intro  : '春节到，祝福到，美吉姆邀您一起闹春节。现在报名即可领取春节大礼包，数量有限，先到先得'
						}
					},
				})
			} else if ( activityTypeId == 4 ){
				me.setState({
					//分享页面配置项
					mainData : {
						name : "美吉姆元宵活动",
						bg_music : "http://saas.ishanshan.com/upload/1484105237942.mp3",
						bg_name : '正月十五是元宵.mp3',
						share_config : {
							title : '美吉姆邀您闹元宵',
							imgurl: 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
							intro : '元宵到，祝福到，美吉姆邀您一起闹元宵。现在报名即可领取元宵节大礼包，数量有限，先到先得。'
						}
					},
				})
			} else if ( activityTypeId == 5 ){
				me.setState({
					//分享页面配置项
					mainData : {
						name : "美吉姆春季郊游",
						bg_music : "http://saas.ishanshan.com/upload/1487242242384.mp3",
						bg_name : 'One day in spring.mp3',
						share_config : {
							title : '美吉姆邀您踏春出游',
							imgurl: 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
							intro : '我正在参加由美吉姆主办的春季郊游活动，超多同龄孩子，各类亲子活动High到停不下来'
						}
					},
				})
			} else if ( activityTypeId == 6 ){
				me.setState({
					//分享页面配置项
					mainData : {
						name : "美吉姆五一活动",
						bg_music : "http://saas.ishanshan.com/upload/1487242400213.mp3",
						bg_name : 'Valentin - A Little Story.mp3',
						share_config : {
							title : '美吉姆劳动节活动',
							imgurl: 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
							intro : '劳动最光荣，美吉姆邀请您和您的孩子一起体验不一样的亲子活动'
						}
					},
				})
			} else if ( activityTypeId == 7 ){
				me.setState({
					//分享页面配置项
					mainData : {
						name : "美吉姆端午活动",
						bg_music : "http://saas.ishanshan.com/upload/1487242363950.mp3",
						bg_name : 'Anan Ryoko - Refrain.mp3',
						share_config : {
							title : '美吉姆端午节活动',
							imgurl: 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
							intro : '祭奠伟大爱国诗人屈原，给孩子一个更有意义的端午'
						}
					},
				})
			} else if ( activityTypeId == 8 ){
				me.setState({
					//分享页面配置项
					mainData : {
						name : "母亲节特别活动",
						bg_music : "http://saas.ishanshan.com/upload/1494033518005.mp3",
						bg_name : 'Raimond Lap - Baby Loves Blues.mp3',
						share_config : {
							title : '美吉姆母亲节活动',
							imgurl: 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
							intro : '感恩母亲，让爱永恒。美吉姆邀您参加母亲节特别活动'
						}
					},
				})
			} else if ( activityTypeId == 9 ){
				me.setState({
					//分享页面配置项
					mainData : {
						name : "快乐六一",
						bg_music : "http://saas.ishanshan.com/upload/1494475167365.mp3",
						bg_name : '久石譲 - (cut)“千と千寻の神隠し”~いつも何度でも.mp3',
						share_config : {
							title : '美吉姆儿童节特别活动',
							imgurl: 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
							intro : '快乐六一，我的节日我做主。童心大作战、小小梦想家等活动等你来玩~'
						}
					},
				})
			} else if ( activityTypeId == 10 ){
				me.setState({
					//分享页面配置项
					mainData : {
						name : "父亲节特别活动",
						bg_music : "http://saas.ishanshan.com/upload/1494475167365.mp3",
						bg_name : '久石譲 - (cut)“千と千寻の神隠し”~いつも何度でも.mp3',
						share_config : {
							title : '美吉姆父亲节活动',
							imgurl: 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
							intro : '父爱无言，巍峨如山。美吉姆邀您参加父亲节特别活动'
						}
					},
				})
			} else if( activityTypeId == 11 ){
				me.setState({
					//分享页面配置项
					mainData : {
						name     : "暑期招生活动模板",
						bg_music : "http://saas.ishanshan.com/upload/1495709225434.mp3",
						bg_name  : 'Foxtail-Grass Studio.mp3',
						share_config : {
							title : '安妮花暑期火热招生',
							imgurl: 'https://img.ishanshan.com/gimg/img/3cd7ca247a056d187c98f6c0fbb82e17',
							intro : '安妮花将一直秉持创新、开放、分享的核心价值观，打造国内规模最大、专业性最高的儿童教育平台。'
						}
					},
				})
			} else if( activityTypeId == 12 ){
				me.setState({
					//分享页面配置项
					mainData : {
						name     : "暑期培训班活动模板",
						bg_music : "http://saas.ishanshan.com/upload/1496372916871.mp3",
						bg_name  : 'Oare Cat.mp3',
						share_config : {
							title  : '启明星暑期培训班招生',
							imgurl : 'https://img.ishanshan.com/gimg/img/8f9995e27bd9d9483a977087d4bcecb8',
							intro  : '启明星国学教育致力于0~8岁宝宝的教育培训，丰富的课程体系，雄厚的师资力量，让孩子赢在起跑线上'
						}
					},
				})
			} else if( activityTypeId == 13 ){
				me.setState({
					//分享页面配置项
					mainData : {
						name     : "暑期夏令营活动模板",
						bg_music : "http://saas.ishanshan.com/upload/1496807903491.mp3",
						bg_name  : 'Oare Cat.mp3',
						share_config : {
							title  : '哈喽贝比性格早教中心',
							imgurl : 'https://img.ishanshan.com/gimg/img/1863d6826f186c6d57bc53d4da46b534',
							intro  : '哈喽贝比因爱而生，我们的理想就是打造中华特色的宝贝领跑世界，传承创新中华文化，铸就教育行业巨擘!'
						}
					},
				})
			} else if( activityTypeId == 14 ){
				me.setState({
					//分享页面配置项
					mainData : {
						name     : "秋季招生模板",
						bg_music : "http://saas.ishanshan.com/upload/1500631315286.mp3",
						bg_name  : 'G大调第一大提琴组曲.mp3',
						share_config : {
							title  : '秋季招生！',
							imgurl : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
							intro  : '美吉姆致力于0~3岁宝宝的早教培训，丰富的课程体系，雄厚的师资力量，让孩子赢在起跑线上。'
						}
					},
				})
			} else if( activityTypeId == 15 ){
				me.setState({
					//分享页面配置项
					mainData : {
						name     : "秋季招生清新模板",
						bg_music : "http://saas.ishanshan.com/upload/1500631862684.mp3",
						bg_name  : '森林.mp3',
						share_config : {
							title  : '秋季招生清新模板',
							imgurl : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
							intro  : '美吉姆致力于0~3岁宝宝的早教培训，丰富的课程体系，雄厚的师资力量，让孩子赢在起跑线上。'
						}
					},
				})
			} else if( activityTypeId == 16 ){
				me.setState({
					//分享页面配置项
					mainData : {
						name     : "开学季招生模板",
						bg_music : "http://saas.ishanshan.com/upload/1501121804449.mp3",
						bg_name  : '开学季.mp3',
						share_config : {
							title  : '美吉姆秋季开学啦',
							imgurl : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
							intro  : '美吉姆致力于0~3岁宝宝的早教培训，丰富的课程体系，雄厚的师资力量，让孩子赢在起跑线上。'
						}
					},
				})
			} else if( activityTypeId == 17 ){
				me.setState({
					//分享页面配置项
					mainData : {
						name     : "秋日出游模板",
						bg_music : "http://saas.ishanshan.com/upload/1501235480330.mp3",
						bg_name  : '秋游.mp3',
						share_config : {
							title  : '秋日出游',
							imgurl : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
							intro  : '秋季出游，美丽秋天，美吉姆带您与爱同行。'
						}
					},
				})
			} else if( activityTypeId == 18 ){
				me.setState({
					//分享页面配置项
					mainData : {
						name     : "秋日出游模板",
						bg_music : "http://saas.ishanshan.com/upload/1501235480330.mp3",
						bg_name  : '秋游.mp3',
						share_config : {
							title  : '秋日出游',
							imgurl : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
							intro  : '秋季出游，美丽秋天，美吉姆带您与爱同行。'
						}
					},
				})
			} else if( activityTypeId == 19 ){
				me.setState({
					//分享页面配置项
					mainData : {
						name     : "开学季招生模板",
						bg_music : "http://saas.ishanshan.com/upload/1501480457441.mp3",
						bg_name  : '开学季.mp3',
						share_config : {
							title  : '美吉姆秋季开学啦',
							imgurl : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
							intro  : '美吉姆致力于0~3岁宝宝的早教培训，丰富的课程体系，雄厚的师资力量，让孩子赢在起跑线上。'
						}
					},
				})
			} else if( activityTypeId == 20 ){
				me.setState({
					//分享页面配置项
					mainData : {
						name     : "乐高超级英雄模板",
						bg_music : "http://saas.ishanshan.com/upload/1501580347180.mp3",
						bg_name  : '乐高.mp3',
						share_config : {
							title  : '棒棒贝贝招生啦',
							imgurl : 'https://img.ishanshan.com/gimg/img/021f8616de2d6a6aeb41c051de5fe18a',
							intro  : '棒棒贝贝始终致力于儿童科技启蒙和创造力的培养。'
						}
					},
				})
			} else if( activityTypeId == 21 ){
				me.setState({
					//分享页面配置项
					mainData : {
						name     : "乐高通用模板",
						bg_music : "http://saas.ishanshan.com/upload/1501588881445.mp3",
						bg_name  : '乐高.mp3',
						share_config : {
							title  : '棒棒贝贝招生啦',
							imgurl : 'https://img.ishanshan.com/gimg/img/021f8616de2d6a6aeb41c051de5fe18a',
							intro  : '棒棒贝贝始终致力于儿童科技启蒙和创造力的培养。'
						}
					},
				})
			} else if( activityTypeId == 22 ){
				me.setState({
					//分享页面配置项
					mainData : {
						name     : "秋季招生啦",
						bg_music : "http://saas.ishanshan.com/upload/1502187262728.mp3 ",
						bg_name  : '余日秋山.mp3',
						share_config : {
							title  : '秋季招生啦',
							imgurl : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
							intro  : '美吉姆致力于0~3岁宝宝的早教培训，丰富的课程体系，雄厚的师资力量，让孩子赢在起跑线上。'
						}
					},
				})
			} else if( activityTypeId == 23 ){
				me.setState({
					//分享页面配置项
					mainData : {
						name     : "教师节快乐",						
						bg_music : "http://saas.ishanshan.com/upload/1502963563982.mp3",
						bg_name  : '老师.mp3',
						share_config : {
							title  : '美吉姆早教中心',
							imgurl : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
							intro  : '美吉姆向天下老师致敬，诚邀您参加美吉姆教师节活动。'
						}
					},
				})
			} 
		},100);

		if( activityTypeId == 1 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name : "美吉姆圣诞活动",
					bg_music : "http://saas.ishanshan.com/upload/1484105085475.mp3",
					bg_name : 'Jingle Bells.mp3',
					share_config : {
						title : '美吉姆邀您闹圣诞',
						imgurl: 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
						intro : '圣诞到，祝福到，美吉姆邀您一起闹圣诞。现在报名即可领取圣诞节大礼包，数量有限，先到先得'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type : 'Page1Component',
						seqNo : 1,
						title : '圣诞邀请函',
					},{
						type : 'Page2Component'  ,
						seqNo : 2 ,
						title : '缤纷圣诞PA' ,
						sub_title : '这个圣诞一起来做活动吧',
						intro : [
							{ label : '活动时间', value : '12月24日（周六19：00-20:30）' },
							{ label : '活动地点', value : '早教机构' },
							{ label : '活动费用', value : '扣课一节' },
							{ label : '活动费用', value : '20组会员家庭' },
							{ label : '活动费用', value : '缤纷圣诞PA，各类活动层出不穷，现场更有圣诞终极抽奖' },
						]
					},{
						type : 'Page3Component',
						seqNo : 3,
						title : '圣诞PA活动详情' ,
						sub_title : '这个圣诞一起',
						intro : [
							{ label : '提示一', value : '请小朋友自备圣诞礼服，出席活动' },
							{ label : '提示二', value : '请每组家庭自备小礼品一份，用于现场交换礼物环节' },
							{ label : '提示三', value : '如需请假，请提前一周说明' },
						]

					},{
						type : 'Page4Component',
						seqNo : 4,
						title : '好礼互赠' ,
						img_intro : [
							{ imgurl : 'http://115.29.172.104/gimg/img/af3b051c316f0fe59f3e7d2860b0067e' },
							{ imgurl : 'http://115.29.172.104/gimg/img/12f06aba716dc87b53b05d05321cc1da' },
							{ imgurl : 'http://115.29.172.104/gimg/img/40d11d94f19691643bf670fc36d9d991' },
							{ imgurl : 'http://115.29.172.104/gimg/img/c1c67d68bc74e3ccec1e449f789a7bd7' }
						]
					},{
						type : 'Page5Component',
						seqNo : 5,
						title : '关于美吉姆' ,
						img_intro : [
							{ imgurl : 'https://img.ishanshan.com/gimg/img/fb36e04bca5a21cf163441a8f0eaa888' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/d5b8a251499d228c2f32b38f6f730b51' }
						],
						intro : '美吉姆早教中心致力于成为中国儿童早期素质教育实践者，为0-6岁的儿童提供一站式高端早教教育服务。'
					},{
						type : 'Page6Component',
						seqNo : 6,
						title : '参与报名' ,
						form_data : [
							{ field_label : '', field_value : '' }
						]
					},
				]
			})
		} else if ( activityTypeId == 2 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name : "美吉姆寒假班招生",
					bg_music : "http://saas.ishanshan.com/upload/1484105138583.mp3",
					bg_name : 'Depapepe-いい日だったね.mp3',
					share_config : {
						title : '美吉姆疯狂招生活动',
						imgurl: 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
						intro : '还在为孩子的寒假兴趣班发愁？赶快加入闪闪早教吧~现在报名可享8折优惠，名额有限，先到先得'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type : 'Page1Component',
						seqNo : 1,
						title : '美吉姆寒假班',
						sub_title :'10年早教经验，专注于开发宝宝智力，培养兴趣爱好!'
					},{
						type : 'Page2Component'  ,
						seqNo : 2 ,
						title : '优惠详情' ,
						intro : [
							{ label : '优惠一', value : '前10名报名者，每一门课程均可享受8折优惠' },
							{ label : '优惠二', value : '前50名报名者，任选一门课程享受8折优惠' },
							{ label : '优惠三', value : '前100名报名者，任选一门课程享受9折优惠' },
						]
					},{
						type : 'Page4Component',
						seqNo : 3,
						title  : '优惠课程',
						title1 : '创意手工课：适合1~5岁孩子，培养孩子自主动手能力' ,
						title2 : '音乐启蒙课：适合1~4岁孩子，让孩子在艺术的熏陶中成长',
						title3 : '语言入门课：适合1~6岁孩子，从小培养孩子的语言沟通能力',
						img_intro : [
							{ imgurl : 'http://115.29.172.104/gimg/img/ef8050ac0f28a47f16ce970e5b110b16' },
							{ imgurl : 'http://115.29.172.104/gimg/img/8626b2c5c734214db324e71c2f3bdab6' },
							{ imgurl : 'http://115.29.172.104/gimg/img/4183cad58248926d4e532ddb1021f923' },
						]
					},{
						type : 'Page5Component',
						seqNo : 4,
						title : '关于美吉姆' ,
						img_intro : [
							{ imgurl : 'https://img.ishanshan.com/gimg/img/fbcb131f1c1bf7f9c8148e3818b06798' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/0b19eb34e9f34b0e1bf110a6613eae32' }
						],
						intro : '美吉姆早教中心致力于成为中国儿童早期素质教育实践者，为0-6岁的儿童提供一站式高端早教教育服务'
					},{
						type : 'Page6Component',
						seqNo : 5,
						title : '参与报名',
						form_data : [
							{ field_label : '', field_value : '' }
						]
					},
				]
			})
		} else if ( activityTypeId == 3 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name     : "美吉姆春节活动",
					bg_music : "http://saas.ishanshan.com/upload/1484105179837.mp3",
					bg_name  : '喜气洋洋 共贺春年.mp3',
					share_config : {
						title  : '美吉姆邀您闹春节',
						imgurl : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
						intro  : '春节到，祝福到，闪闪邀您一起闹春节。现在报名即可领取春节大礼包，数量有限，先到先得'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type : 'Page1Component',
						seqNo : 1,
						title : '美吉姆春节活动',
						sub_title :'最不一样的新年活动，带给孩子更多的欢乐!',
						imgUrl : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
					},{
						type : 'Page2Component'  ,
						seqNo : 2 ,
						title : '春节活动介绍' ,
						intro : [
							{ label : '活动时间', value : '2016.12.31-2017.01.01' },
							{ label : '活动地点', value : '杭州市海威大厦18楼1808室' },
							{ label : '参与人数', value : '10人' },
							{ label : '注意事项', value : '请自行保管好个人财务' },
						]
					},{
						type : 'Page4Component',
						seqNo : 3,
						title  : '活动详情',
						title1 : '活动一：舞狮活动，每位宝宝必须由一位家长陪同参与' ,
						title2 : '活动二：包饺子活动，让孩子体验动手的快乐',
						title3 : '活动三：幸运抽奖，每位参加活动的宝宝均可获得一次抽奖机会',
						img_intro : [
							{ imgurl : 'http://115.29.172.104/gimg/img/2b6f15a68686a5d83ddae28639a0108e' },
							{ imgurl : 'http://115.29.172.104/gimg/img/28e9749a214ef4e62399ec8e75459073' },
							{ imgurl : 'http://115.29.172.104/gimg/img/bb0056b7ad05fcf24a4a746659ec424c' },
						]
					},{
						type : 'Page5Component',
						seqNo : 4,
						title : '关于美吉姆' ,
						img_intro : [
							{ imgurl : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9' },
							{ imgurl : 'http://115.29.172.104/gimg/img/deb2030967930b51aa03bfe5268fb7bd' }
						],
						intro : '美吉姆早教中心致力于成为中国儿童早期素质教育实践者，为0-6岁的儿童提供一站式高端早教教育服务。'
					},{
						type : 'Page6Component',
						seqNo : 5,
						title : '参与报名',
						form_data : [
							{ field_label : '', field_value : '' }
						]
					},
				]
			})
		} else if ( activityTypeId == 4 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name : "美吉姆元宵活动",
					bg_music : "http://saas.ishanshan.com/upload/1484105237942.mp3",
					bg_name : '正月十五是元宵.mp3',
					share_config : {
						title : '美吉姆邀您闹元宵',
						imgurl: 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
						intro : '元宵到，祝福到，闪闪邀您一起闹元宵。现在报名即可领取元宵节大礼包，数量有限，先到先得。'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type : 'Page1Component',
						seqNo : 1,
						title : '美吉姆元宵活动',
					},{
						type : 'Page2Component'  ,
						seqNo : 2 ,
						title : '活动介绍' ,
						sub_title : '猜灯谜，闹元宵',
						intro : [
							{ label : '活动一', value : '猜灯谜活动，一样的游戏，给你不一样的体验' },
							{ label : '活动二', value : '汤圆大作战，享受动手的乐趣' },
							{ label : '活动三', value : '元宵“球”团圆，全新亲子游戏' },
						]
					},{
						type : 'Page3Component',
						seqNo : 3,
						title : '活动详情' ,
						sub_title : '这个元宵一起',
						intro : [
							{ label : '活动时间', value : '2017.03.12 10:00~19:00' },
							{ label : '活动地点', value : '杭州市滨江区海威大厦18楼' },
							{ label : '活动对象', value : '3~8岁孩子（需有一名家长陪同）' },
							{ label : '注意事项', value : '请保管好自己的财物' },
						]

					},{
						type : 'Page4Component',
						seqNo : 4,
						title : '往期回顾' ,
						img_intro : [
							{ imgurl : 'http://115.29.172.104/gimg/img/a3fb9d3e4e2edc9b292551b313c82ec1' },
							{ imgurl : 'http://115.29.172.104/gimg/img/43afa45fabd55b03de24e3a9292133f8' },
							{ imgurl : 'http://115.29.172.104/gimg/img/5564bac3c1d5703c77a3e6bb48f60885' },
							{ imgurl : 'http://115.29.172.104/gimg/img/430a3f317991560c6da40bc000a8f6d4' }
						]
					},{
						type : 'Page5Component',
						seqNo : 5,
						title : '关于美吉姆' ,
						img_intro : [
							{ imgurl : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9' },
							{ imgurl : 'http://115.29.172.104/gimg/img/deb2030967930b51aa03bfe5268fb7bd' }
						],
						intro : '美吉姆早教中心致力于成为中国儿童早期素质教育实践者，为0-6岁的儿童提供一站式高端早教教育服务。'
					},{
						type : 'Page6Component',
						seqNo : 6,
						title : '参与报名' ,
						form_data : [
							{ field_label : '', field_value : '' }
						]
					},
				]
			})
		} else if( activityTypeId == 5 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name : "美吉姆春季郊游",
					bg_music : "http://saas.ishanshan.com/upload/1487242242384.mp3",
					bg_name : 'One day in spring.mp3',
					share_config : {
						title : '美吉姆邀您踏春出游',
						imgurl: 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
						intro : '我正在参加由美吉姆主办的春季郊游活动，超多同龄孩子，各类亲子活动High到停不下来'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type : 'Page1Component',
						seqNo : 1,
						title : '美吉姆春季郊游',
						sub_title :'相约西子湖畔，体验不一样的亲子活动',
					},{
						type : 'Page2Component'  ,
						seqNo : 2 ,
						title : '活动详情' ,
						intro : [
							{ label : '活动时间', value : '2016.12.26~2016.12.30' },
							{ label : '活动地点', value : '西湖文化广场' },
							{ label : '活动人数', value : '50人' },
							{ label : '活动费用', value : '100元/位，宝宝必须指定一名家长陪同参与（家长免费）' },
							{ label : '注意事项', value : '请自行保管好个人财务' },
						]
					},{
						type : 'Page4Component',
						seqNo : 3,
						title  : '活动介绍',
						title1 : '活动一：桃花山赏桃花，看漫山遍野桃花朵朵开' ,
						title2 : '活动二：放风筝，亲子活动，孩子需家长陪同',
						title3 : '野餐，由主办方提供，在大自然中享受美食',
						img_intro : [
							{ imgurl : 'http://115.29.172.104/gimg/img/3ca72a9dd66bc7a6f85737d4119e76de' },
							{ imgurl : 'http://115.29.172.104/gimg/img/0e536804f5ad4028e7d36a812d77eae6' },
							{ imgurl : 'http://115.29.172.104/gimg/img/4c9a45a087c5524fc7352a1126f2dd20' },
						]
					},{
						type : 'Page5Component',
						seqNo : 4,
						title : '关于美吉姆' ,
						img_intro : [
							{ imgurl : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9' },
							{ imgurl : 'http://115.29.172.104/gimg/img/deb2030967930b51aa03bfe5268fb7bd' }
						],
						intro : '美吉姆于1983年由威廉凯普林和雅可夫、苏西 谢尔曼夫妇共同努力合作创立，旨在通过每周一次的结构性课程，帮助孩子构建强健的体魄，培养良好的社交能力，同时树立自尊心和自信心'
					},{
						type : 'Page6Component',
						seqNo : 5,
						title : '我要报名',
						form_data : [
							{ field_label : '', field_value : '' }
						]
					},
				]
			})
		} else if( activityTypeId == 6 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name : "美吉姆五一活动",
					bg_music : "http://saas.ishanshan.com/upload/1487242400213.mp3",
					bg_name : 'Valentin - A Little Story.mp3',
					share_config : {
						title : '美吉姆劳动节活动',
						imgurl: 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
						intro : '劳动最光荣，美吉姆邀请您和您的孩子一起体验不一样的亲子活动'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type : 'Page1Component',
						seqNo : 1,
						title : '美吉姆五一活动',
						sub_title :'非常5.1，欢乐嘉年华',
						imgUrl : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
					},{
						type : 'Page2Component'  ,
						seqNo : 2 ,
						title : '活动介绍' ,
						intro : [
							{ label : '活动一', value : '最美劳动人，给孩子一次亲子动手的机会' },
							{ label : '活动二', value : '户外亲子活动，默契与智力的大考验' },
							{ label : '活动三', value : '当地敬老院来一次卫生大扫除' },
						]
					},{
						type : 'Page3Component',
						seqNo : 3,
						title : '活动详情' ,
						intro : [
							{ label : '活动时间', value : '2017.05.01上午10:00~下午17:00' },
							{ label : '活动地点', value : '杭州市滨江区海威大厦18楼' },
							{ label : '活动对象', value : '3~8岁孩子（需有一名家长陪同参与)' },
							{ label : '注意事项', value : '请保管好自己的财物' },
						]

					},{
						type : 'Page4Component',
						seqNo : 4,
						title : '往期回顾' ,
						img_intro : [
							{ imgurl : 'http://115.29.172.104/gimg/img/fd8b3245e0abe0313fa27f6c8e8a10a1' },
							{ imgurl : 'http://115.29.172.104/gimg/img/416caf848d3ac618668bc405b373e5e8' },
							{ imgurl : 'http://115.29.172.104/gimg/img/9de2f76753d9a6787d37229e5f9c30c8' },
							{ imgurl : 'http://115.29.172.104/gimg/img/426ed9d76c2b0381968e577902b32e75' }
						]
					},{
						type : 'Page5Component',
						seqNo : 5,
						title : '关于美吉姆' ,
						img_intro : [
							{ imgurl : 'http://115.29.172.104/gimg/img/e17c525c7c5f50e3e99b21c494699ec0' },
							{ imgurl : 'http://115.29.172.104/gimg/img/4c772675c07ee20740fcfa1e4a7bdc13' }
						],
						intro : '美吉姆早教中心致力于成为中国儿童早期素质教育实践者，为0-6岁的儿童提供一站式高端早教教育服务。'
					},{
						type : 'Page6Component',
						seqNo : 6,
						title : '参与报名' ,
					},
				]
			})
		} else if ( activityTypeId == 7 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name : "美吉姆端午活动",
					bg_music : "http://saas.ishanshan.com/upload/1487242363950.mp3",
					bg_name : 'Anan Ryoko - Refrain.mp3',
					share_config : {
						title : '美吉姆端午节活动',
						imgurl: 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
						intro : '祭奠伟大爱国诗人屈原，给孩子一个更有意义的端午'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type : 'Page1Component',
						seqNo : 1,
						title : '美吉姆端午活动',
						sub_title :'在这个传统节日，带孩子认识爱国诗人—屈原',
					},{
						type : 'Page2Component'  ,
						seqNo : 2 ,
						title : '活动介绍' ,
						intro : [
							{ label : '活动时间', value : '2017.05.01 上午10:00~下午17:00' },
							{ label : '活动地点', value : '杭州市滨江区海威大厦18楼' },
							{ label : '活动对象', value : '3~8岁孩子（需有一名家长陪同参与）' },
							{ label : '注意事项', value : '请保管好自己的财物' },
						]
					},{
						type : 'Page4Component',
						seqNo : 3,
						title  : '活动详情',
						title1 : '活动一：追随伟人的脚步，观看短片《屈原，屈原！》' ,
						title2 : '活动二：粽子大比拼，孩子们自己动手包粽子',
						title3 : '活动三：亲子默契大比拼，家长和孩子两两一组，比拼默契',
						img_intro : [
							{ imgurl : 'http://115.29.172.104/gimg/img/8f1346e8908ee3083594e385c6be7724' },
							{ imgurl : 'http://115.29.172.104/gimg/img/d47827cfd556b1bb43589ce6de1847d6' },
							{ imgurl : 'http://115.29.172.104/gimg/img/84b9f73eb53cd5d68a3f4d80afe50ab4' },
						]
					},{
						type : 'Page5Component',
						seqNo : 4,
						title : '关于美吉姆' ,
						img_intro : [
							{ imgurl : 'http://115.29.172.104/gimg/img/84b9f73eb53cd5d68a3f4d80afe50ab4' },
							{ imgurl : 'http://115.29.172.104/gimg/img/4c772675c07ee20740fcfa1e4a7bdc13' }
						],
						intro : '美吉姆早教中心致力于成为中国儿童早期素质教育实践者，为0-6岁的儿童提供一站式高端早教教育服务。'
					},{
						type : 'Page6Component',
						seqNo : 5,
						title : '我要报名',
					},
				]
			})
		}else if ( activityTypeId == 8 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name : "母亲节特别活动",
					bg_music : "http://saas.ishanshan.com/upload/1494033518005.mp3",
					bg_name : 'Raimond Lap - Baby Loves Blues.mp3',
					share_config : {
						title : '美吉姆母亲节活动',
						imgurl: 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
						intro : '感恩母亲，让爱永恒。美吉姆邀您参加母亲节特别活动'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type : 'Page1Component',
						seqNo : 1,
						title : '母亲节特别活动',
						sub_title :'感恩母亲,让爱永恒。不一样的亲子活动,让孩子从小学会感恩',
						imgUrl : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
					},{
						type : 'Page2Component'  ,
						seqNo : 2 ,
						title : '活动介绍' ,
						intro : [
							{ label : '活动时间', value : '2017.03.12 10:00~19:00' },
							{ label : '活动地点', value : '杭州市滨江区海威大厦18楼' },
							{ label : '活动对象', value : '3~8岁孩子(需有一名家长陪同)' },
							{ label : '注意事项', value : '请保管好自己的财物' },
						]
					},{
						type : 'Page4Component',
						seqNo : 3,
						title  : '活动详情',
						title1 : '活动一：感恩母亲，勇敢对妈妈说出爱' ,
						title2 : '活动二：手工康乃馨，孩子自己动手制作康乃馨，赠送给母亲',
						title3 : '活动三：《我的妈妈》绘画，用画笔刻画妈妈的样子',
						img_intro : [
							{ imgurl : 'http://115.29.172.104/gimg/img/1863eb7c2b9b902e71cf807b2eca8646' },
							{ imgurl : 'http://115.29.172.104/gimg/img/31a9019babb3f5c17a8c86874c957327' },
							{ imgurl : 'http://115.29.172.104/gimg/img/a5f6afa3eb42ff1aa144188db5d7d598' },
						]
					},{
						type : 'Page5Component',
						seqNo : 4,
						title : '关于美吉姆' ,
						img_intro : [
							{ imgurl : 'http://115.29.172.104/gimg/img/84b9f73eb53cd5d68a3f4d80afe50ab4' },
							{ imgurl : 'http://115.29.172.104/gimg/img/4c772675c07ee20740fcfa1e4a7bdc13' }
						],
						intro : '美吉姆早教中心致力于成为中国儿童早期素质教育实践者，为0-6岁的儿童提供一站式高端早教教育服务。'
					},{
						type : 'Page6Component',
						seqNo : 5,
						title : '我要报名',
					},
				]
			})
		}else if ( activityTypeId == 9 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name : "快乐六一",
					bg_music : "http://saas.ishanshan.com/upload/1494475167365.mp3",
					bg_name : '久石譲 - (cut)“千と千寻の神隠し”~いつも何度でも.mp3',
					share_config : {
						title : '美吉姆儿童节特别活动',
						imgurl: 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
						intro : '快乐六一，我的节日我做主。童心大作战、小小梦想家等活动等你来玩~'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type : 'Page1Component',
						seqNo : 1,
						title : '六一特别活动',
					},{
						type : 'Page2Component'  ,
						seqNo : 2 ,
						title : '活动介绍' ,
						intro : [
							{ label : '活动时间', value : '2017.03.12 10:00~19:00' },
							{ label : '活动地点', value : '杭州市滨江区海威大厦18楼' },
							{ label : '活动人数', value : '3~8岁孩子，限50组(两大一小)' },
							{ label : '注意事项', value : '请保管好自己的财物' },
						]
					},{
						type : 'Page4Component',
						seqNo : 3,
						title  : '活动详情',
						title1 : '活动一：童心大作战，和孩子一起回味童年的味道' ,
						title2 : '活动二：小小梦想家，用画笔刻画出梦想的样子',
						title3 : '活动三：六一大乱斗，带上孩子来玩各类趣味游戏和亲子活动',
						img_intro : [
							{ imgurl : 'http://115.29.172.104/gimg/img/a50f47eb3aeb10339947866ae0568597' },
							{ imgurl : 'http://115.29.172.104/gimg/img/22f712175620a04d0b3997dd1a5ae9ed' },
							{ imgurl : 'http://115.29.172.104/gimg/img/0f10d544ead8c729aa2a440c1e7eabef' },
						]
					},{
						type : 'Page5Component',
						seqNo : 4,
						title : '关于美吉姆' ,
						img_intro : [
							{ imgurl : 'http://115.29.172.104/gimg/img/84b9f73eb53cd5d68a3f4d80afe50ab4' },
							{ imgurl : 'http://115.29.172.104/gimg/img/4c772675c07ee20740fcfa1e4a7bdc13' }
						],
						intro : '美吉姆早教中心致力于成为中国儿童早期素质教育实践者，为0-6岁的儿童提供一站式高端早教教育服务。'
					},{
						type : 'Page6Component',
						seqNo : 5,
						title : '我要报名',
					},
				]
			})
		}else if ( activityTypeId == 10 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name : "父亲节特别活动",
					bg_music : "http://saas.ishanshan.com/upload/1495431282924.mp3",
					bg_name : 'Next To You.mp3',
					share_config : {
						title : '美吉姆父亲节活动',
						imgurl: 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
						intro : '父爱无言，巍峨如山。美吉姆邀您参加父亲节特别活动'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type : 'Page1Component',
						seqNo : 1,
						title : '父亲节特别活动',
						sub_title :'父爱无言, 巍峨如山。不一样的亲子活动, 让孩子从小学会感恩。',
						imgUrl : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
					},{
						type : 'Page2Component',
						seqNo : 2 ,
						title : '活动介绍' ,
						intro : [
							{ label : '活动时间', value : '2017.03.12 10:00~19:00' },
							{ label : '活动地点', value : '杭州市滨江区海威大厦18楼' },
							{ label : '活动人数', value : '3~8岁孩子（需有一名家长陪同）' },
							{ label : '注意事项', value : '请保管好自己的财物' },
						]
					},{
						type : 'Page4Component',
						seqNo : 3,
						title  : '活动详情',
						title1 : '活动一：感恩父亲，勇敢对爸爸说出爱' ,
						title2 : '活动二：手工制作贺卡,孩子自己动手制作一张祝福贺卡,送给父亲',
						title3 : '活动三：《我的父亲》绘画，用画笔刻画爸爸的样子',
						img_intro : [
							{ imgurl : 'http://115.29.172.104/gimg/img/f1fc7d6907df997f38936a1e59d75d51' },
							{ imgurl : 'http://115.29.172.104/gimg/img/ef1e3b0ac5887c5dc15cc8807743c1bf' },
							{ imgurl : 'http://115.29.172.104/gimg/img/25ee1dd8e7f764f4ab902a19bd3cb64c' },
						]
					},{
						type : 'Page5Component',
						seqNo : 4,
						title : '关于美吉姆' ,
						img_intro : [
							{ imgurl : 'http://115.29.172.104/gimg/img/84b9f73eb53cd5d68a3f4d80afe50ab4' },
							{ imgurl : 'http://115.29.172.104/gimg/img/4c772675c07ee20740fcfa1e4a7bdc13' }
						],
						intro : '美吉姆早教中心致力于成为中国儿童早期素质教育实践者，为0-6岁的儿童提供一站式高端早教教育服务。'
					},{
						type : 'Page6Component',
						seqNo : 5,
						title : '我要报名',
					},
				]
			})
		}else if ( activityTypeId == 11 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name     : "暑期招生活动模板",
					bg_music : "http://saas.ishanshan.com/upload/1495709225434.mp3",
					bg_name  : 'Foxtail-Grass Studio.mp3',
					share_config : {
						title : '安妮花暑期火热招生',
						imgurl: 'https://img.ishanshan.com/gimg/img/3cd7ca247a056d187c98f6c0fbb82e17',
						intro : '安妮花将一直秉持创新、开放、分享的核心价值观，打造国内规模最大、专业性最高的儿童教育平台。'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type      : 'Page1Component',
						seqNo     : 1,
						title     : '安妮花教育',
						sub_title : '暑期新课程火热招生中，快来报名哦！',
						imgUrl    : 'https://img.ishanshan.com/gimg/img/3cd7ca247a056d187c98f6c0fbb82e17',
					},{
						type      : 'Page2Component',
						seqNo     : 2 ,
						title     : '暑期价格标准',
						content   : '暑期班时间：7月10日至8月25日\n暑期班费用：¥9998(共七周，已包含餐费+户外运动费用)',
						title2    : '会员福利',
						content2  : '①会员报名优惠1000元\n②老会员带新会员一起报名，可在①上再享受团购价格，两人报名9折，三人8.5折，依次类推，五折封顶。（包含新会员）',
					},{
						type : 'Page3Component',
						seqNo : 3,
						title  : '暑期班主题',
						title1 : '梦幻马戏团' ,
						title2 : '恐龙时代',
						title3 : '欢乐迪士尼',
						img_intro : [
							{ imgurl : 'http://115.29.172.104/gimg/img/36629072ae66f9d1382c99d3af2ada9a' },
							{ imgurl : 'http://115.29.172.104/gimg/img/855cece50299f3313853a4fcff56f03a' },
							{ imgurl : 'http://115.29.172.104/gimg/img/13281f3cbd34631fc4514713a18e46cf' },
						]
					},{
						type : 'Page4Component',
						seqNo : 4,
						title  : '暑期班主题',
						title1 : '生活大爆炸' ,
						title2 : '中国与世界',
						img_intro : [
							{ imgurl : 'http://115.29.172.104/gimg/img/9a1981a63be7a72051fdb51bf13e7012' },
							{ imgurl : 'http://115.29.172.104/gimg/img/4343f045e3caca550fe14a233e1f4878' },
							{ imgurl : '' },
						]
					},{
						type : 'Page5Component',
						seqNo : 5,
						title : '往期精彩回顾' ,
						img_intro : [
							{ imgurl : 'http://115.29.172.104/gimg/img/5cd17d73a1d655f679bb5bc0dce21ba6' },
							{ imgurl : 'http://115.29.172.104/gimg/img/d2d8cda70b853d1ec7baf717ad1c4b78' },
							{ imgurl : 'http://115.29.172.104/gimg/img/91922227d3862906a35cb4873a0ae211' },
							{ imgurl : 'http://115.29.172.104/gimg/img/74cbae8ccdffa932f3e966e8d2d4df55' }
						]
					},{
						type   : 'Page6Component',
						seqNo  : 6,
						title  : '机构简介' ,
						title2 : '校内环境',
						img_intro : [
							{ imgurl : 'http://115.29.172.104/gimg/img/84b9f73eb53cd5d68a3f4d80afe50ab4' },
							{ imgurl : 'http://115.29.172.104/gimg/img/4c772675c07ee20740fcfa1e4a7bdc13' }
						],
						intro : '安妮花教育由安妮鲜花组织国内外一流教研团队，集0-12岁英语教育产品研发、课程体系建设及师资、管理人员培训为一体，除直营式加盟阅读馆、读书会外，也为全日制学校、幼儿园提供嵌入式服务。'
					},{
						type : 'Page7Component',
						seqNo : 7,
						title : '报名参加',
						subTitle : '爱心陪伴成长, 教育创造未来'
					},
				]
			})
		}else if ( activityTypeId == 12 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name     : "暑期培训班活动模板",
					bg_music : "http://saas.ishanshan.com/upload/1496372916871.mp3",
					bg_name  : 'Oare Cat.mp3',
					share_config : {
						title  : '启明星暑期培训班招生',
						imgurl : 'https://img.ishanshan.com/gimg/img/8f9995e27bd9d9483a977087d4bcecb8',
						intro  : '启明星国学教育致力于0~8岁宝宝的教育培训，丰富的课程体系，雄厚的师资力量，让孩子赢在起跑线上'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type        : 'Page1Component',
						seqNo       : 1,
						headImgUrl  : 'https://img.ishanshan.com/gimg/img/8f9995e27bd9d9483a977087d4bcecb8',
						orgTitle    : '启明星国学教育',
						actiTitle   : '暑期新培训班开课啦!',
						expTitle    : '机构简介',
						expContent  : '启明星教育培训学校于1994年建校,是经教委批准成立的文化艺术综合类培训学校，凭借优秀的教师团队、优美的教学环境、完善的教学管理连续多年荣获社会力量办学先进单位，并取得几十项省、市及全国荣誉奖项。',
						orgIntro    : '课程简介',
						orgContent1 : '让孩子们收获身体力量、平衡、协调全方位发展。',
						orgContent2 : '帮助儿童获得音乐基础，并随心而乐，随乐而舞。',
						orgContent3 : '培养儿童早期艺术素养，激发孩子想象力和创造力。',
						orgImgs :   [
							{ imgurl : 'http://115.29.172.104/gimg/img/e3be2a581367cf76478315b888d52ae2' },
							{ imgurl : 'http://115.29.172.104/gimg/img/44cc5823ad054cdef791319f133c1d4e' },
							{ imgurl : 'http://115.29.172.104/gimg/img/b72386cdfed56a47017961fb91b8cb7f' },
						],
						couTitle    : '校内环境',
						couContent  : '每类课程90个课时。\n欢动课：¥9980（含户外活动费）\n音乐课：¥8990\n艺术课：¥9980（含材料费）',
						conTitle    : '联系我们',
						conContent  : '报名电话：0571-888888\n其他方式：陈老师手机号：1888882333\n报名地址：浙江省杭州市滨江区西兴海威大厦1808',
						codeImgUrl  : 'http://115.29.172.104/gimg/img/8fdff2f6c3325b779aa59fc664be08e0',
						remark      : '长按二维码关注我们哦!',
						apply       : '报名参加'
					}
				]
			})
		} else if ( activityTypeId == 13 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name     : "暑期夏令营活动模板",
					bg_music : "http://saas.ishanshan.com/upload/1496807903491.mp3",
					bg_name  : 'Oare Cat.mp3',
					share_config : {
						title  : '哈喽贝比性格早教中心',
						imgurl : 'https://img.ishanshan.com/gimg/img/1863d6826f186c6d57bc53d4da46b534',
						intro  : '哈喽贝比因爱而生，我们的理想就是打造中华特色的宝贝领跑世界，传承创新中华文化，铸就教育行业巨擘!'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type        : 'Page1Component',
						seqNo       : 1,
						headImgUrl  : 'https://img.ishanshan.com/gimg/img/1863d6826f186c6d57bc53d4da46b534',
						orgTitle    : '哈喽贝比性格早教中心',
						headTitle   : '暑期夏令营',
						subTitle    : '国内外豪华夏令营启程啦!',
						actiStartTime : '2010-7-1',
						actiEndTime : '2017-8-25',
						title1      : '关于我们',
						content1    : '哈喽贝比隶属于北京哈喽贝比教育咨询有限公司\n哈喽贝比是激情、创新、感恩、付出、创造快乐的使者。面对事业我们豪情万丈;面对社会，我们感恩回报;面对困难，我们报以微笑。让我们快乐的打拼在一起，打造世界的核心力量!。\nADD:浙江省杭州市滨江区海威大厦1808\nTEL：18723333333\n微信：YS12546',
						title2      : '详情摘要',
						mainProcess : [
							{ label : '报名时间', value : '2017.6.01-2017.6.28日期间报名即可' },
							{ label : '开营时间', value : '2017.7.1-2017.8.25历时7周' },
							{ label : '费用标准', value : '夏令营7周费用¥7780，多人报名可享受团购价格' },
						],
						title3      : '主体流程',
						details     : [ '特训起航', '求生演习', '狩猎战术', '挑战大自然', '伐木漂流', '丛林挑战' ],
						title4      : '报名须知',
						content4    : '1.参与小朋友年龄需在5-12周岁，身体健康;\n2.家长报名时，请填写正确的联系方式哦;\n3.参与小朋友在夏令营期间，一切请听从老师安排;\n4.禁止携带现金、金银首饰等贵重物品;\n5.禁止携手提电脑、游戏机、管制刀具、手机等物品;',
						title5      : '往期回顾',
						orgImgs :   [
							{ imgurl : 'http://115.29.172.104/gimg/img/619b872399e09e333a685e17d0e8eb31' },
							{ imgurl : 'http://115.29.172.104/gimg/img/23fad6893fd748d02003974665d2e240' },
							{ imgurl : 'http://115.29.172.104/gimg/img/49caf53229172cb92e418a8eb2bfcd8e' },
							{ imgurl : 'http://115.29.172.104/gimg/img/b7aaeb391de50411fb800ec99bb6dd7e' },
							{ imgurl : '' },
						],
						title6      : '报名参加'
					}
				]
			})
		} else if ( activityTypeId == 14 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name     : "秋季招生简约模板",
					bg_music : "http://saas.ishanshan.com/upload/1500631315286.mp3",
					bg_name  : 'G大调第一大提琴组曲.mp3',
					share_config : {
						title  : '秋季招生简约模板',
						imgurl : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
						intro  : '美吉姆致力于0~3岁宝宝的早教培训，丰富的课程体系，雄厚的师资力量，让孩子赢在起跑线上。'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type      	: 'Page1Component',
						seqNo     	: 1,
						title     	: '美吉姆早教中心',
						imgUrl		: 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
					},{
						type      	: 'Page2Component',
						seqNo     	: 2 ,
						title     	: '美吉姆早教中心',
					},{
						type 		: 'Page3Component',
						seqNo 		: 3,
						title  		: '机构介绍',
						title1 		: '美吉姆由威廉凯普林和谢尔曼夫妇合作创立，旨在帮助孩子构建强健的体魄和良好的社交能力，同时树立自信心' ,
						title2 		: '美吉姆已经开设了近500家儿童教育中心，每年都有数百万的儿童享受美吉姆带来的适龄的、非竞争性的课程',
						img_intro 	: [
							{ imgurl : 'https://img.ishanshan.com/gimg/img/3da99941a79295a50d3cd00a9debf049' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/be33d11484fab7a932a933bcb8ea7313' },
						]
					},{
						type : 'Page4Component',
						seqNo : 4,
						title  : '校内闪照',
						img_intro : [
							{ imgurl : 'https://img.ishanshan.com/gimg/img/cd8ebea22f5544c346c0b11de903ff13' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/32fcd995de106c51ecb975a008d8a8e2' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/378c363d23ecba7bfa93ba1284bf37e1' },
						]
					},{
						type : 'Page5Component',
						seqNo : 5,
						title : '课程介绍',
						intro : [
							{ value : '欢动课：课程综合了精彩趣味的游戏、运动、体操、接力比赛、骑乘游戏等' },
							{ value : '美术课：通过绘画、雕塑、版画等丰富的艺术表现形式，培养儿童早期的艺术素养' },
							{ value : '音乐课：致力于为8个月-5岁的儿童提供专业早期音乐教育课程，强调家长的参与性' },
						]
					},{
						type : 'Page6Component',
						seqNo : 6,
						title : '课程精彩瞬间',
						img_intro : [
							{ imgurl : 'https://img.ishanshan.com/gimg/img/a3ae487b796dbee8a4fbbe093caf71e6' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/3cfee7ae0a74f8cbc3bb999756fa890b' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/a212849e330ba1962d6590f2946cc525' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/5cd17d73a1d655f679bb5bc0dce21ba6' },
						]
					},{
						type   : 'Page7Component',
						seqNo  : 7,
						title  : '联系我们' ,
						qrImgUrl : 'http://115.29.172.104/gimg/img/576d7daaa1acd5dda2381433918e9287',
						content : '联系人：陈老师\n其他方式：联系电话：18723232323\n报名地址：浙江省杭州市滨江区西兴海威大厦1808\n微信：ishanshan'
					},{
						type : 'Page8Component',
						seqNo : 8,
						title : '报名参加',
					},
				]
			})
		} else if ( activityTypeId == 15 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name     : "秋季招生清新模板",
					bg_music : "http://saas.ishanshan.com/upload/1500631862684.mp3",
					bg_name  : '森林.mp3',
					share_config : {
						title  : '秋季招生清新模板',
						imgurl : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
						intro  : '美吉姆致力于0~3岁宝宝的早教培训，丰富的课程体系，雄厚的师资力量，让孩子赢在起跑线上。'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type      	: 'Page1Component',
						seqNo     	: 1,
						title     	: '美吉姆早教中心',
						imgUrl		: 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
					},{
						type      	: 'Page2Component',
						seqNo     	: 2 ,
						title     	: '美吉姆早教中心',
					},{
						type : 'Page3Component',
						seqNo : 3,
						title  : '品牌故事',
						content : '美吉姆于1983年由William Caplin和 雅可夫、苏西谢尔曼夫妇共同努力合作创立。\n利用其在儿童早期教育、运动机能学、体育、舞蹈以及体操领域的专业经验，这几位创始人研发出了一套完整的符合孩子天性的课程体系和教学设备，旨在通过每周一次的结构性课立自尊心和自信心。',
					},{
						type : 'Page4Component',
						seqNo : 4,
						title  : '校内闪照',
						img_intro : [
							{ imgurl : 'https://img.ishanshan.com/gimg/img/cd8ebea22f5544c346c0b11de903ff13' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/32fcd995de106c51ecb975a008d8a8e2' },
						]
					},{
						type : 'Page5Component',
						seqNo : 5,
						title : '课程介绍',
						intro : [
							{ value : '欢动课：课程综合了精彩趣味的游戏、运动、体操、接力比赛、骑乘游戏等' },
							{ value : '美术课：通过绘画、雕塑、版画等丰富的艺术表现形式，培养儿童早期的艺术素养' },
							{ value : '音乐课：致力于为8个月-5岁的儿童提供专业早期音乐教育课程，强调家长的参与性' },
						]
					},{
						type : 'Page6Component',
						seqNo : 6,
						title : '课程精彩瞬间',
						img_intro : [
							{ imgurl : 'https://img.ishanshan.com/gimg/img/a3ae487b796dbee8a4fbbe093caf71e6' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/3cfee7ae0a74f8cbc3bb999756fa890b' },
						]
					},{
						type   : 'Page7Component',
						seqNo  : 7,
						title  : '联系我们' ,
						qrImgUrl : 'http://115.29.172.104/gimg/img/576d7daaa1acd5dda2381433918e9287',
						content : '联系人：陈老师\n其他方式：联系电话：18723232323\n报名地址：浙江省杭州市滨江区西兴海威大厦1808\n微信：ishanshan'
					},{
						type : 'Page8Component',
						seqNo : 8,
						title : '报名参加',
					},
				]
			})
		} else if ( activityTypeId == 16 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name     : "开学季招生模板",
					bg_music : "http://saas.ishanshan.com/upload/1501121804449.mp3",
					bg_name  : '开学季.mp3',
					share_config : {
						title  : '美吉姆秋季开学啦',
						imgurl : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
						intro  : '美吉姆致力于0~3岁宝宝的早教培训，丰富的课程体系，雄厚的师资力量，让孩子赢在起跑线上。'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type      	: 'Page1Component',
						seqNo     	: 1,
						title     	: '美吉姆早教中心',
						imgUrl		: 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
					},{
						type      	: 'Page2Component',
						seqNo     	: 2 ,
						title     	: '开学季，送豪礼!',
						content     : '9月开学季，妈妈们都在忙着给孩子做入学准备，各种担心也随之而来\n入园之前该做什么准备？\n如果入园之前给孩子上了托班，是不是很好？\n如果经常带孩子参加早教，是不是就不怕生？\n如果多和同龄小伙伴相处，是不是就学会了社交？\n上过早教的孩子，真的不一样！\n美吉姆早教课现在0元体验啦！',
					},{
						type 		: 'Page3Component',
						seqNo 		: 3,
						title  		: '机构介绍',
						content 	: '美吉姆由威廉和苏西谢尔曼夫妇共同努力合作创立。利用其在儿童早期教育、运动机能学、体育、舞蹈以及体操领域的专业经验，这几位创始人研发出了一套完整的符合孩子天性的课程体系和教学设备，旨在通过每周一次的结构性课程，帮助孩子构建强健的体魄，培养良好的社交能力，同时树立自尊心和自信心',
					},{
						type 		: 'Page4Component',
						seqNo 		: 4,
						title  		: '机构环境',
						img_intro 	: [
							{ imgurl : 'https://img.ishanshan.com/gimg/img/cd8ebea22f5544c346c0b11de903ff13' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/32fcd995de106c51ecb975a008d8a8e2' },
						]
					},{
						type 		: 'Page5Component',
						seqNo 		: 5,
						title 		: '课程介绍',
						content 	: '2-4岁 幼儿托班：以孩子为主体，小班化教学提升宝宝综合素质，为宝 宝入托入园做好充分扎实的准备。\n0-2岁 亲子启蒙：我们用最贴近生活的道具培养宝宝独立自主的能力，提升生活自理能力。\n13-60个月 音乐花园：融合奥尔夫、戈登优秀音乐教学法，提升宝宝的音乐感知、音乐表现等能力。',
					},{
						type 		: 'Page6Component',
						seqNo		: 6,
						title 		: '联系我们',
						content 	: '联系人：王老师\n其他方式：联系电话：18723232323\n报名地址：浙江省杭州市滨江区西兴海威大厦1808\n微信：ishanshan'
					},{
						type   		: 'Page7Component',
						seqNo  		: 7,
						title  		: '预约试听' ,
					},
				]
			})
		} else if ( activityTypeId == 17 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name     : "秋日出游模板",
					bg_music : "http://saas.ishanshan.com/upload/1501235414585.mp3",
					bg_name  : '秋游.mp3',
					share_config : {
						title  : '秋日出游',
						imgurl : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
						intro  : '秋季出游，美丽秋天，美吉姆带您与爱同行。'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type      	: 'Page1Component',
						seqNo     	: 1,
						title		: '美丽秋天，亲子同行',
						sub_title	: '活动时间：2017年9月日 14：00',
						org_name	: '美吉姆早教中心',
					},{
						type      	: 'Page2Component',
						seqNo     	: 2 ,
						title     	: '关于美吉姆',
						intro     : '美吉姆来到中国，在北京开设了第一家中心。先进的教学设备、训练有素的教师、众多获奖的课程与老师配比，为美吉姆在中国早期教育领域赢得了极高的声誉。美吉姆在中国迅速成长，如今足迹已遍布大半个中国。',
						img_intro 	: [
							{ imgurl : 'https://img.ishanshan.com/gimg/ori/967678fd63afa8fdf0e7f7daf3275152' },
						]
					},{
						type 		: 'Page3Component',
						seqNo 		: 3,
						title  		: '注意事项',
						content 	: '内容:1、本次活动以自驾车前往笔架山公园为主，需要搭乘他人车辆的家长请提前告知班级老师安排。\n2、请准时参加活动，如临时有事请假请及时告知班级老师。\n3、请鼓励宝宝积极参加游戏，爸爸妈妈要踊跃，为宝宝做榜样。\n4、请着方便运动的服装，并带齐宝宝外出需要的各类物品。',
					},{
						type 		: 'Page4Component',
						seqNo 		: 4,
						title  		: '沿途风景',
						img_intro 	: [
							{ imgurl : 'https://img.ishanshan.com/gimg/ori/b3ea0f3043b23e493482f7294ed99f4b' },
							{ imgurl : 'https://img.ishanshan.com/gimg/ori/a7a6a975a038dd1ff8eff6182ecbfc59' },
						]
					},{
						type 		: 'Page5Component',
						seqNo 		: 5,
						title 		: '沿途风景',
						img_intro 	: [
							{ imgurl : 'https://img.ishanshan.com/gimg/ori/cbfb133f891e1cf83649ab3f329bbab2' },
							{ imgurl : 'https://img.ishanshan.com/gimg/ori/ababfd2beac89496e36b22429b2e4e9a' },
						]
					},{
						type 		: 'Page6Component',
						seqNo		: 6,
						title 		: '报名参加',
					},
				]
			})
		} else if ( activityTypeId == 18 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name     : "秋日出游模板",
					bg_music : "http://saas.ishanshan.com/upload/1501235480330.mp3",
					bg_name  : '秋游.mp3',
					share_config : {
						title  : '秋日出游',
						imgurl : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
						intro  : '秋季出游，美丽秋天，美吉姆带您与爱同行。'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type      	: 'Page1Component',
						seqNo     	: 1,
						title		: '美丽秋天，亲子同行',
						sub_title	: '活动时间：2017年9月日 14：00',
						org_name	: '美吉姆早教中心',
					},{
						type      	: 'Page2Component',
						seqNo     	: 2 ,
						title     	: '关于美吉姆',
						intro     : '美吉姆来到中国，在北京开设了第一家中心。先进的教学设备、训练有素的教师、众多获奖的课程与老师配比，为美吉姆在中国早期教育领域赢得了极高的声誉。美吉姆在中国迅速成长，如今足迹已遍布大半个中国。',
						img_intro 	: [
							{ imgurl : 'https://img.ishanshan.com/gimg/ori/967678fd63afa8fdf0e7f7daf3275152' },
						]
					},{
						type 		: 'Page3Component',
						seqNo 		: 3,
						title  		: '注意事项',
						content 	: '内容:1、本次活动以自驾车前往笔架山公园为主，需要搭乘他人车辆的家长请提前告知班级老师安排。\n2、请准时参加活动，如临时有事请假请及时告知班级老师。\n3、请鼓励宝宝积极参加游戏，爸爸妈妈要踊跃，为宝宝做榜样。\n4、请着方便运动的服装，并带齐宝宝外出需要的各类物品。',
					},{
						type 		: 'Page4Component',
						seqNo 		: 4,
						title  		: '沿途风景',
						img_intro 	: [
							{ imgurl : 'https://img.ishanshan.com/gimg/ori/b3ea0f3043b23e493482f7294ed99f4b' },
							{ imgurl : 'https://img.ishanshan.com/gimg/ori/a7a6a975a038dd1ff8eff6182ecbfc59' },
						]
					},{
						type 		: 'Page5Component',
						seqNo 		: 5,
						title 		: '沿途风景',
						img_intro 	: [
							{ imgurl : 'https://img.ishanshan.com/gimg/ori/cbfb133f891e1cf83649ab3f329bbab2' },
							{ imgurl : 'https://img.ishanshan.com/gimg/ori/ababfd2beac89496e36b22429b2e4e9a' },
						]
					},{
						type 		: 'Page6Component',
						seqNo		: 6,
						title 		: '报名参加',
					},
				]
			})
		} else if ( activityTypeId == 19 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name     : "开学季招生模板",
					bg_music : "http://saas.ishanshan.com/upload/1501480457441.mp3",
					bg_name  : '开学季.mp3',
					share_config : {
						title  : '美吉姆秋季开学啦',
						imgurl : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
						intro  : '美吉姆致力于0~3岁宝宝的早教培训，丰富的课程体系，雄厚的师资力量，让孩子赢在起跑线上。'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type      	: 'Page1Component',
						seqNo     	: 1,
						title     	: '美吉姆早教中心',
						imgUrl		: 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
					},{
						type      	: 'Page2Component',
						seqNo     	: 2 ,
						title     	: '开学季，送豪礼!',
						content     : '9月开学季，妈妈们都在忙着给孩子做入学准备，各种担心也随之而来\n入园之前该做什么准备？\n如果入园之前给孩子上了托班，是不是很好？\n如果经常带孩子参加早教，是不是就不怕生？\n如果多和同龄小伙伴相处，是不是就学会了社交？\n上过早教的孩子，真的不一样！\n美吉姆早教课现在0元体验啦！',
					},{
						type 		: 'Page3Component',
						seqNo 		: 3,
						title  		: '机构介绍',
						content 	: '美吉姆由威廉和苏西谢尔曼夫妇共同努力合作创立。利用其在儿童早期教育、运动机能学、体育、舞蹈以及体操领域的专业经验，这几位创始人研发出了一套完整的符合孩子天性的课程体系和教学设备，旨在通过每周一次的结构性课程，帮助孩子构建强健的体魄，培养良好的社交能力，同时树立自尊心和自信心',
					},{
						type 		: 'Page4Component',
						seqNo 		: 4,
						title  		: '机构环境',
						img_intro 	: [
							{ imgurl : 'https://img.ishanshan.com/gimg/img/cd8ebea22f5544c346c0b11de903ff13' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/32fcd995de106c51ecb975a008d8a8e2' },
						]
					},{
						type 		: 'Page5Component',
						seqNo 		: 5,
						title 		: '课程介绍',
						content 	: '2-4岁 幼儿托班：以孩子为主体，小班化教学提升宝宝综合素质，为宝 宝入托入园做好充分扎实的准备。\n0-2岁 亲子启蒙：我们用最贴近生活的道具培养宝宝独立自主的能力，提升生活自理能力。\n13-60个月 音乐花园：融合奥尔夫、戈登优秀音乐教学法，提升宝宝的音乐感知、音乐表现等能力。',
					},{
						type 		: 'Page6Component',
						seqNo		: 6,
						title 		: '联系我们',
						content 	: '联系人：王老师\n其他方式：联系电话：18723232323\n报名地址：浙江省杭州市滨江区西兴海威大厦1808\n微信：ishanshan'
					},{
						type   		: 'Page7Component',
						seqNo  		: 7,
						title  		: '预约试听' ,
					},
				]
			})
		} else if ( activityTypeId == 20 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name     : "乐高超级英雄模板",
					bg_music : "http://saas.ishanshan.com/upload/1501580347180.mp3",
					bg_name  : '乐高.mp3',
					share_config : {
						title  : '棒棒贝贝招生啦',
						imgurl : 'https://img.ishanshan.com/gimg/img/021f8616de2d6a6aeb41c051de5fe18a',
						intro  : '棒棒贝贝始终致力于儿童科技启蒙和创造力的培养。'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type      	: 'Page1Component',
						seqNo     	: 1,
						title		: '理念前沿，结构成熟，应用完整的课程体系',
						org_name	: '棒棒贝贝科技中心',
					},{
						type      	: 'Page2Component',
						seqNo     	: 2 ,
						title     	: '机构介绍',
						intro     	: '棒棒贝贝创立于2004年，是一家始终致力于儿童科技启蒙和创造力培养的服务性机构。历经10余年的实践，我们形成了理念前沿、结构成熟、应用完整的课程体系。采用国际领先的教育理念及尖端优质教具，培养儿童逐步形成以解决问题为导向的创新思维，引导儿童在实践中探究科技世界。',
						img_intro 	: [
							{imgurl		: 'https://img.ishanshan.com/gimg/img/021f8616de2d6a6aeb41c051de5fe18a'},
						]

					},{
						type 		: 'Page3Component',
						seqNo 		: 3,
						title  		: '机构环境',
						img_intro 	: [
							{ imgurl : 'https://img.ishanshan.com/gimg/img/9ebd4c0d23125d8ba8020038d2dc6ecb' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/6b0b375476c90eca5579e742e3d6373f' },
						]
					},{
						type 		: 'Page4Component',
						seqNo 		: 4,
						title  		: '课程介绍',
						content 	: '3+小小乐高上和下\n4+数字游戏和百变工程\n5+早期简单机械和生活与科技\n6+迷你机械+探索与发现\n7+早期编程和动力机械\n8+机械与世界和能源世界',
					},{
						type 		: 'Page5Component',
						seqNo 		: 5,
						title 		: '预约试听',
					},
				]
			})
		} else if ( activityTypeId == 21 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name     : "乐高通用模板",
					bg_music : "http://saas.ishanshan.com/upload/1501588881445.mp3",
					bg_name  : '乐高.mp3',
					share_config : {
						title  : '棒棒贝贝招生啦',
						imgurl : 'https://img.ishanshan.com/gimg/img/021f8616de2d6a6aeb41c051de5fe18a',
						intro  : '棒棒贝贝始终致力于儿童科技启蒙和创造力的培养。'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type      	: 'Page1Component',
						seqNo     	: 1,
						title		: '理念前沿，结构成熟，应用完整的课程体系',
						org_name	: '棒棒贝贝科技中心',
					},{
						type      	: 'Page2Component',
						seqNo     	: 2 ,
						title     	: '机构介绍',
						intro     	: '棒棒贝贝创立于2004年，是一家始终致力于儿童科技启蒙和创造力培养的服务性机构。历经10余年的实践，我们形成了理念前沿、结构成熟、应用完整的课程体系。采用国际领先的教育理念及尖端优质教具，培养儿童逐步形成以解决问题为导向的创新思维，引导儿童在实践中探究科技世界。',
						img_intro 	: [
							{imgurl		: 'https://img.ishanshan.com/gimg/img/021f8616de2d6a6aeb41c051de5fe18a'},
						]

					},{
						type 		: 'Page3Component',
						seqNo 		: 3,
						title  		: '机构环境',
						img_intro 	: [
							{ imgurl : 'https://img.ishanshan.com/gimg/img/9ebd4c0d23125d8ba8020038d2dc6ecb' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/6b0b375476c90eca5579e742e3d6373f' },
						]
					},{
						type 		: 'Page4Component',
						seqNo 		: 4,
						title  		: '课程介绍',
						content 	: '3+小小乐高上和下\n4+数字游戏和百变工程\n5+早期简单机械和生活与科技\n6+迷你机械+探索与发现\n7+早期编程和动力机械\n8+机械与世界和能源世界',
					},{
						type 		: 'Page5Component',
						seqNo 		: 5,
						title 		: '预约试听',
					},
				]
			})
		} else if ( activityTypeId == 22 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name     : "秋季招生啦",
					bg_music : "http://saas.ishanshan.com/upload/1502187262728.mp3 ",
					bg_name  : '余日秋山.mp3',
					share_config : {
						title  : '秋季招生啦',
						imgurl : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
						intro  : '美吉姆致力于0~3岁宝宝的早教培训，丰富的课程体系，雄厚的师资力量，让孩子赢在起跑线上。'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type      	: 'Page1Component',
						seqNo     	: 1,
						title     	: '美吉姆早教中心',
						imgUrl		: 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
					},{
						type      	: 'Page2Component',
						seqNo     	: 2 ,
						title     	: '美吉姆早教中心',
					},{
						type 		: 'Page3Component',
						seqNo 		: 3,
						title  		: '机构介绍',
						title1 		: '美吉姆由威廉凯普林和谢尔曼夫妇合作创立，旨在帮助孩子构建强健的体魄和良好的社交能力，同时树立自信心' ,
						title2 		: '美吉姆已经开设了近500家儿童教育中心，每年都有数百万的儿童享受美吉姆带来的适龄的、非竞争性的课程',
						img_intro 	: [
							{ imgurl : 'https://img.ishanshan.com/gimg/img/3da99941a79295a50d3cd00a9debf049' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/be33d11484fab7a932a933bcb8ea7313' },
						]
					},{
						type : 'Page4Component',
						seqNo : 4,
						title  : '校内闪照',
						img_intro : [
							{ imgurl : 'https://img.ishanshan.com/gimg/img/cd8ebea22f5544c346c0b11de903ff13' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/32fcd995de106c51ecb975a008d8a8e2' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/378c363d23ecba7bfa93ba1284bf37e1' },
						]
					},{
						type : 'Page5Component',
						seqNo : 5,
						title : '课程介绍',
						intro : [
							{ value : '欢动课：课程综合了精彩趣味的游戏、运动、体操、接力比赛、骑乘游戏等' },
							{ value : '美术课：通过绘画、雕塑、版画等丰富的艺术表现形式，培养儿童早期的艺术素养' },
							{ value : '音乐课：致力于为8个月-5岁的儿童提供专业早期音乐教育课程，强调家长的参与性' },
						]
					},{
						type : 'Page6Component',
						seqNo : 6,
						title : '课程精彩瞬间',
						img_intro : [
							{ imgurl : 'https://img.ishanshan.com/gimg/img/a3ae487b796dbee8a4fbbe093caf71e6' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/3cfee7ae0a74f8cbc3bb999756fa890b' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/a212849e330ba1962d6590f2946cc525' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/5cd17d73a1d655f679bb5bc0dce21ba6' },
						]
					},{
						type   : 'Page7Component',
						seqNo  : 7,
						title  : '联系我们' ,
						qrImgUrl : 'http://115.29.172.104/gimg/img/576d7daaa1acd5dda2381433918e9287',
						content : '联系人：陈老师\n其他方式：联系电话：18723232323\n报名地址：浙江省杭州市滨江区西兴海威大厦1808\n微信：ishanshan'
					},{
						type : 'Page8Component',
						seqNo : 8,
						title : '报名参加',
					},
				]
			})
		} else if ( activityTypeId == 23 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name     : "教师节快乐",
					bg_music : "http://saas.ishanshan.com/upload/1502963563982.mp3",
					bg_name  : '老师.mp3',
					share_config : {
						title  : '美吉姆早教中心',
						imgurl : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
						intro  : '美吉姆向天下老师致敬，诚邀您参加美吉姆教师节活动。'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type        : 'Page1Component',
						seqNo       : 1,
						
						oneTitle	: '美吉姆早教中心',
						oneSubTitle	: '致敬天下老师，邀请您参加教师节活动',
						intro : [
							{ label : '活动时间', value : '2017年9月10日17:00' },
							{ label : '活动地点', value : '杭州市滨江区海威大厦1808' },
							{ label : '联系电话', value : '1872323231' },
						],
						twoTitle : '老师辛苦了',
						twosubTitle : '感谢生命中出现的每位师者',
						twoContent : '我原想收获一缕清风，\n您却给了我整个春天。\n我原想捧起一簇浪花，\n您却给了我整个海洋。\n我原想撷取一枚绿叶，\n您却给了我整个森林。\n我原想亲吻一朵雪花，\n您却给了我整个银色的世界。',
						
						threeTitle : '教师节活动节目表',
						threeContent : '1.主持人诗歌朗诵《赞恩师》;\n2、教师代表发言，学员献花;\n3、员工代表老师的献礼舞蹈《感恩的心》;\n4、凡教师客户凭教师证在现场购买可享受x折优惠政策。\n5、到会的每位家长客户均赠送精美的小礼品一份;',
						
						forTitle : '接受邀请',
					}
				]
			})
		} 

	},

	componentWillReceiveProps(nextProps) {
		if(nextProps.formVisible) {
			if ( (nextProps.formVisible && this.props.formVisible !== nextProps.formVisible) ){
				this.props.title == "新建微活动" ? this.initData(nextProps.activityTypeId) : this.updateInit(nextProps.activityId);
			}
		}
	},

	refreshData( detailData , currentPage , initFlag ) {
		if( initFlag ){
			this.setState({
				detailData : detailData,
				currentPage : currentPage,
				initFlag : false,
			})
		}
	},

	//主页面预览功能
	onPreview(mainData){
		this.setState({
			mainData : mainData
		})
	},

	//子页面预览功能
	onChildPreview(detailPageData , seqNo){
		let {detailData } = this.state;
		detailData[seqNo-1] = detailPageData;
		this.setState({
			detailData : detailData
		})
	},

	//保存实例
	saveInstance(){
		clearInterval( window.timer );
		clearInterval( window.wActivityTimer );
		window.timer = null;
		window.wActivityTimer = null;
		let me = this;
		let detailData = JSON.stringify(this.state.detailData);
		let mainData = JSON.stringify(this.state.mainData);
		let activityTypeId =  this.props.activityId || this.props.activityTypeId;
		let activityCode = this.props.activityCode;
		let organId = this.props.organId;
		let name = this.state.mainData.name;
		if( activityCode ){
			let Params = {
				detailData : detailData,
				mainData : mainData,
				activityId : activityTypeId,
				code : activityCode,
				name : name,
				organId : organId
			}
			serviceRequest( BASE_URL+"/microActivity/saveTenantMicroActivity", {...Params}, function(res) {
				let codeUrl = res.data.shareUrl;
				me.props.diliverCode(codeUrl);
			});
		}else{
			let Params = {
				detailData : detailData,
				mainData : mainData,
				id : activityTypeId,
				code : activityCode,
				name : name
			}
			serviceRequest( BASE_URL+"/microActivity/updateActivity", {...Params}, function(res) {
        		let codeUrl = res.data.shareUrl;
				me.props.diliverCode(codeUrl);
				me.props.callbackRefresh();
			});
		}
		this.props.changeCodeModalVisible();
	},

	//点击关闭新建实例框
	changeTempletInstanceFormVisible(){
		clearInterval(window.timer);
		window.timer = null;
		this.props.changeTempletInstanceFormVisible();
	},

	render () {

		let { detailData, currentPage, mainData } = this.state;

		let { formVisible } = this.props;

		let templetType = this.props.activityTypeId || this.state.activityTypeId;

		return (
			<Modal
				title = { this.props.title }
				visible = { this.props.formVisible }
				maskClosable = { false }
	    		maskClosabltempletTypee = {false}
				closable = { true }
				width = { 1040 }
				style = {{ top : '10px' }}
				onCancel = { this.changeTempletInstanceFormVisible }
				className = "form-modal templet-instance-form-modal"
				footer = { null } >
				<div className = "templet-instance-form-content">
					<div className = "templet-instance-render-content">
						<div className = "bg_phone" >
							{
								templetType == 1 ?  <ChristmasRenderComponent detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: templetType == 2 ?  <EnrollmentRenderComponent detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: templetType == 3 ?  <NewYearRenderComponent detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: templetType == 4 ?  <YuanxiaoRenderComponent detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: templetType == 5 ?  <SpringRenderComponent detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: templetType == 6 ?  <LabourRenderComponent detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: templetType == 7 ?  <DoanngoRenderComponent detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: templetType == 8 ?  <MothersDayRenderComponent detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: templetType == 9 ?  <ChildrenDayRenderComponent detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: templetType == 10 ?  <FathersDayRenderComponent detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: templetType == 11 ?  <SummerRenderComponent detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: templetType == 12 ?  <SummerCultivateRenderComponent detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: templetType == 13 ?  <SummerCampRenderComponent detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: templetType == 14 ?  <AutumnRecruitCallRenderComponent detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: templetType == 15 ?  <AutumnRecruitSecondCallRenderComponent detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: templetType == 16 ?  <SchoolRenderComponent detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />
									
								: templetType == 17 ?  <AutumnOneRenderComponent detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: templetType == 18 ?  <AutumnTwoRenderComponent detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: templetType == 19 ?  <SchoolSecondRenderComponent detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: templetType == 20 ?  <LegoRenderComponent detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: templetType == 21 ?  <LegoTwoRenderComponent detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />
									
								: templetType == 22 ?  <AutumnRecruitThreeCallRenderComponent detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: templetType == 23 ?  <TeachersRenderComponent detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />
									
								: null
							}
						</div>
					</div>

					<div className = "templet-instance-design-content">
						{  templetType == 1 ?
							<ChristmasDesignComponent mainData = { mainData }
													  detailData = { detailData }
													  refreshData={ this.refreshData }
													  initFlag = { this.state.initFlag }
													  formVisible = { formVisible }
													  onPreview = { this.onPreview }
													  onChildPreview = {this.onChildPreview}
													  saveInstance = {this.saveInstance}
													  activityId = {this.props.activityId || ''}
													  currentSelectCampus = { this.props.currentSelectCampus } />

						:	templetType == 2 ?
							<EnrollmentDesignComponent mainData = { mainData }
													   detailData = { detailData }
													   refreshData={ this.refreshData }
													   initFlag = { this.state.initFlag }
													   formVisible = { formVisible }
													   onPreview = { this.onPreview }
													   onChildPreview = { this.onChildPreview }
													   saveInstance = { this.saveInstance }
													   activityId = {this.props.activityId || '' }
													   currentSelectCampus = { this.props.currentSelectCampus } />

						:	templetType == 3 ?
							<NewYearDesignComponent    mainData = { mainData }
													   detailData = { detailData }
													   refreshData={ this.refreshData }
													   initFlag = { this.state.initFlag }
													   formVisible = { formVisible }
													   onPreview = { this.onPreview }
													   onChildPreview = { this.onChildPreview }
													   saveInstance = { this.saveInstance }
													   activityId = {this.props.activityId || '' }
													   currentSelectCampus = { this.props.currentSelectCampus } />

						:	templetType == 4 ?
							<YuanxiaoDesignComponent   mainData = { mainData }
													   detailData = { detailData }
													   refreshData={ this.refreshData }
													   initFlag = { this.state.initFlag }
													   formVisible = { formVisible }
													   onPreview = { this.onPreview }
													   onChildPreview = { this.onChildPreview }
													   saveInstance = { this.saveInstance }
													   activityId = {this.props.activityId || '' }
													   currentSelectCampus = { this.props.currentSelectCampus } />

						:	templetType == 5 ?
							<SpringDesignComponent     mainData = { mainData }
													   detailData = { detailData }
													   refreshData={ this.refreshData }
													   initFlag = { this.state.initFlag }
													   formVisible = { formVisible }
													   onPreview = { this.onPreview }
													   onChildPreview = { this.onChildPreview }
													   saveInstance = { this.saveInstance }
													   activityId = {this.props.activityId || '' }
													   currentSelectCampus = { this.props.currentSelectCampus } />

						:	templetType == 6 ?
							<LabourDesignComponent     mainData = { mainData }
													   detailData = { detailData }
													   refreshData={ this.refreshData }
													   initFlag = { this.state.initFlag }
													   formVisible = { formVisible }
													   onPreview = { this.onPreview }
													   onChildPreview = { this.onChildPreview }
													   saveInstance = { this.saveInstance }
													   activityId = {this.props.activityId || '' }
													   currentSelectCampus = { this.props.currentSelectCampus } />

						:	templetType == 7 ?
							<DoanngoDesignComponent    mainData = { mainData }
													   detailData = { detailData }
													   refreshData={ this.refreshData }
													   initFlag = { this.state.initFlag }
													   formVisible = { formVisible }
													   onPreview = { this.onPreview }
													   onChildPreview = { this.onChildPreview }
													   saveInstance = { this.saveInstance }
													   activityId = {this.props.activityId || '' }
													   currentSelectCampus = { this.props.currentSelectCampus } />

						:	templetType == 8 ?
							<MothersDayDesignComponent mainData = { mainData }
													   detailData = { detailData }
													   refreshData={ this.refreshData }
													   initFlag = { this.state.initFlag }
													   formVisible = { formVisible }
													   onPreview = { this.onPreview }
													   onChildPreview = { this.onChildPreview }
													   saveInstance = { this.saveInstance }
													   activityId = {this.props.activityId || '' }
													   currentSelectCampus = { this.props.currentSelectCampus } />

						:	templetType == 9 ?
							<ChildrenDayDesignComponent mainData = { mainData }
													   detailData = { detailData }
													   refreshData={ this.refreshData }
													   initFlag = { this.state.initFlag }
													   formVisible = { formVisible }
													   onPreview = { this.onPreview }
													   onChildPreview = { this.onChildPreview }
													   saveInstance = { this.saveInstance }
													   activityId = {this.props.activityId || '' }
													   currentSelectCampus = { this.props.currentSelectCampus } />

						:	templetType == 10 ?
							<FathersDayDesignComponent mainData = { mainData }
													   detailData = { detailData }
													   refreshData={ this.refreshData }
													   initFlag = { this.state.initFlag }
													   formVisible = { formVisible }
													   onPreview = { this.onPreview }
													   onChildPreview = { this.onChildPreview }
													   saveInstance = { this.saveInstance }
													   activityId = {this.props.activityId || '' }
													   currentSelectCampus = { this.props.currentSelectCampus } />

						:	templetType == 11 ?
							<SummerDesignComponent     mainData = { mainData }
													   detailData = { detailData }
													   refreshData={ this.refreshData }
													   initFlag = { this.state.initFlag }
													   formVisible = { formVisible }
													   onPreview = { this.onPreview }
													   onChildPreview = { this.onChildPreview }
													   saveInstance = { this.saveInstance }
													   activityId = {this.props.activityId || '' }
													   currentSelectCampus = { this.props.currentSelectCampus } />

						:	templetType == 12 ?
							<SummerCultivateDesignComponent 	mainData = { mainData }
														   detailData = { detailData }
														   refreshData = { this.refreshData }
														   initFlag = { this.state.initFlag }
														   formVisible = { formVisible }
														   onPreview = { this.onPreview }
														   onChildPreview = { this.onChildPreview }
														   saveInstance = { this.saveInstance }
														   activityId = {this.props.activityId || '' }
														   currentSelectCampus = { this.props.currentSelectCampus } />

						:	templetType == 13 ?
							<SummerCampDesignComponent     	mainData = { mainData }
														   detailData = { detailData }
														   refreshData = { this.refreshData }
														   initFlag = { this.state.initFlag }
														   formVisible = { formVisible }
														   onPreview = { this.onPreview }
														   onChildPreview = { this.onChildPreview }
														   saveInstance = { this.saveInstance }
														   activityId = {this.props.activityId || '' }
														   currentSelectCampus = { this.props.currentSelectCampus } />

						:	templetType == 14 ?
							<AutumnRecruitCallDesignComponent   	mainData = { mainData }
														   		detailData = { detailData }
														   		refreshData = { this.refreshData }
														   		initFlag = { this.state.initFlag }
														   		formVisible = { formVisible }
														   		onPreview = { this.onPreview }
														   		onChildPreview = { this.onChildPreview }
														   		saveInstance = { this.saveInstance }
														   		activityId = {this.props.activityId || '' }
														   		currentSelectCampus = { this.props.currentSelectCampus } />

						:	templetType == 15 ?
							<AutumnRecruitSecondCallDesignComponent   mainData = { mainData }
														   		detailData = { detailData }
														   		refreshData = { this.refreshData }
														   		initFlag = { this.state.initFlag }
														   		formVisible = { formVisible }
														   		onPreview = { this.onPreview }
														   		onChildPreview = { this.onChildPreview }
														   		saveInstance = { this.saveInstance }
														   		activityId = {this.props.activityId || '' }
														   		currentSelectCampus = { this.props.currentSelectCampus } />

						:	templetType == 16 ?
							<SchoolDesignComponent   			mainData = { mainData }
														   		detailData = { detailData }
														   		refreshData = { this.refreshData }
														   		initFlag = { this.state.initFlag }
														   		formVisible = { formVisible }
														   		onPreview = { this.onPreview }
														   		onChildPreview = { this.onChildPreview }
														   		saveInstance = { this.saveInstance }
														   		activityId = {this.props.activityId || '' }
														   		currentSelectCampus = { this.props.currentSelectCampus } />	
							
						:	templetType == 17 ?
							<AutumnOneDesignComponent   			mainData = { mainData }
														   		detailData = { detailData }
														   		refreshData = { this.refreshData }
														   		initFlag = { this.state.initFlag }
														   		formVisible = { formVisible }
														   		onPreview = { this.onPreview }
														   		onChildPreview = { this.onChildPreview }
														   		saveInstance = { this.saveInstance }
														   		activityId = {this.props.activityId || '' }
														   		currentSelectCampus = { this.props.currentSelectCampus } />
						:	templetType == 18 ?
							<AutumnTwoDesignComponent   			mainData = { mainData }
														   		detailData = { detailData }
														   		refreshData = { this.refreshData }
														   		initFlag = { this.state.initFlag }
														   		formVisible = { formVisible }
														   		onPreview = { this.onPreview }
														   		onChildPreview = { this.onChildPreview }
														   		saveInstance = { this.saveInstance }
														   		activityId = {this.props.activityId || '' }
														   		currentSelectCampus = { this.props.currentSelectCampus } />

						:	templetType == 19 ?
							<SchoolSecondDesignComponent   			mainData = { mainData }
														   		detailData = { detailData }
														   		refreshData = { this.refreshData }
														   		initFlag = { this.state.initFlag }
														   		formVisible = { formVisible }
														   		onPreview = { this.onPreview }
														   		onChildPreview = { this.onChildPreview }
														   		saveInstance = { this.saveInstance }
														   		activityId = {this.props.activityId || '' }
														   		currentSelectCampus = { this.props.currentSelectCampus } />
						:	templetType == 20 ?
							<LegoDesignComponent   					mainData = { mainData }
														   		detailData = { detailData }
														   		refreshData = { this.refreshData }
														   		initFlag = { this.state.initFlag }
														   		formVisible = { formVisible }
														   		onPreview = { this.onPreview }
														   		onChildPreview = { this.onChildPreview }
														   		saveInstance = { this.saveInstance }
														   		activityId = {this.props.activityId || '' }
														   		currentSelectCampus = { this.props.currentSelectCampus } />
						:	templetType == 21 ?
							<LegoTwoDesignComponent   					mainData = { mainData }
														   		detailData = { detailData }
														   		refreshData = { this.refreshData }
														   		initFlag = { this.state.initFlag }
														   		formVisible = { formVisible }
														   		onPreview = { this.onPreview }
														   		onChildPreview = { this.onChildPreview }
														   		saveInstance = { this.saveInstance }
														   		activityId = {this.props.activityId || '' }
														   		currentSelectCampus = { this.props.currentSelectCampus } />
						:	templetType == 22 ?
							<AutumnRecruitThreeCallDesignComponent   	mainData = { mainData }
														   		detailData = { detailData }
														   		refreshData = { this.refreshData }
														   		initFlag = { this.state.initFlag }
														   		formVisible = { formVisible }
														   		onPreview = { this.onPreview }
														   		onChildPreview = { this.onChildPreview }
														   		saveInstance = { this.saveInstance }
														   		activityId = {this.props.activityId || '' }
														   		currentSelectCampus = { this.props.currentSelectCampus } />
						:	templetType == 23 ?
							<TeachersDesignComponent   	mainData = { mainData }
														   		detailData = { detailData }
														   		refreshData = { this.refreshData }
														   		initFlag = { this.state.initFlag }
														   		formVisible = { formVisible }
														   		onPreview = { this.onPreview }
														   		onChildPreview = { this.onChildPreview }
														   		saveInstance = { this.saveInstance }
														   		activityId = {this.props.activityId || '' }
														   		currentSelectCampus = { this.props.currentSelectCampus } />
						: null
					}
					</div>
				</div>
			</Modal>
		);
	},

});

export default TemplateInstanceForm;
