/**
 * 模板实例编辑窗口
 * @author yhwu
 */

/*
 * 备注信息
 *  通用模板id为101
 *  英语模板id为102
 *  长页通用版id为103
 *  科技类id为104
 *  英语类id为105
 */
import React from 'react';
import { Modal , Button } from 'antd';

import './template-instance-form.less';

//通用模板
let OrganGeneralDesignComponent = require('./organGeneral_template/design/organGeneralDesignComponent');
let OrganGeneralRenderComponent = require('./organGeneral_template/render/organGeneralRenderComponent');

//英语模板
let EnglishDesignComponent = require('./english_template/design/englishDesignComponent');
let EnglishRenderComponent = require('./english_template/render/englishRenderComponent');

//机构通用(长,不分页)
let OrganCommonDesignComponent = require('./organCommon_template/design/organCommonDesignComponent');
let OrganCommonRenderComponent = require('./organCommon_template/render/organCommonRenderComponent');

//科技类( 长页 );
let ScienceDesignComponent = require('./science_template/design/scienceDesignComponent');
let ScienceRenderComponent = require('./science_template/render/scienceRenderComponent');

//英语类 105
let EnglishTwoDesignComponent = require('./englishTwo_template/design/englishTwoDesignComponent');
let EnglishTwoRenderComponent = require('./englishTwo_template/render/englishTwoRenderComponent');

//音乐邀请函 106
let MusicDesignComponent = require('./music_template/design/musicDesignComponent');
let MusicRenderComponent = require('./music_template/render/musicRenderComponent');

//机构传单通用模板107
let LeafletsDesignComponent = require('./general_leaflets_template/design/leafletsDesignComponent');
let LeafletsRenderComponent = require('./general_leaflets_template/render/leafletsRenderComponent');

//机构传单美术模板108
let FineArtsDesignComponent = require('./fine_arts_template/design/fineArtsDesignComponent');
let FineArtsRenderComponent = require('./fine_arts_template/render/fineArtsRenderComponent');

//机构传单舞蹈模板109
let DanceDesignComponent = require('./dance_template/design/danceDesignComponent');
let DanceRenderComponent = require('./dance_template/render/danceRenderComponent');

let TemplateInstanceForm = React.createClass({
	getInitialState() {
		return {

			initFlag : true,
			currentPage : '',
			//分享页面配置项
			mainData : '',
			//模板页面配置项
			detailData : '',
			activityTypeId : this.props.activityTypeId || '',
		}
	},

	componentDidMount() {
		this.props.title == "新建微传单" ? this.initData() : '';
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
			if( activityTypeId == 101 ){
				me.setState({
					mainData : {
						name : "美吉姆早教",
						bg_music : "http://saas.ishanshan.com/upload/1487242470068.mp3",
						bg_name : "Baby loves blues.mp3",
						share_config : {
							title : '美吉姆早教邀您免费来试听',
							imgurl: 'https://img.ishanshan.com/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
							intro : '美吉姆早教致力于0~3岁宝宝的早教培训，丰富的课程体系，雄厚的师资力量，让孩子赢在起跑线上。'
						}
					}
				})
			} else if( activityTypeId == 102 ){
				me.setState({
					mainData : {
						name : "语桥英语",
						bg_music : "http://saas.ishanshan.com/upload/1487242434588.mp3",
						bg_name : "Drew's Famous - If You're Happy And You Know It.mp3",
						share_config : {
							title : '语桥英语邀您免费来试听',
							imgurl: 'https://img.ishanshan.com/gimg/img/20177efff6df4216c5e869e77829fba8',
							intro : '语桥英语致力于英语培训20年，因为专注，所以专业。'
						}
					}
				})
			} else if( activityTypeId == 103 ){
				me.setState({
					mainData : {
						name : "美吉姆长页模板",
						bg_music : "http://saas.ishanshan.com/upload/1487242512265.mp3",
						bg_name : "几米 - 拥有Masbfca (广告配乐完整版).mp3",
						share_config : {
							title : '美吉姆邀您免费试听',
							imgurl: 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
							intro : '美吉姆国际儿童教育中心致力于成为儿童早期素质教育实践者，为0-6岁的儿童提供一站式高端早教教育服务'
						}
					}
				})
			} else if( activityTypeId == 104 ){
				me.setState({
					mainData : {
						name : "科技类通用模板",
						bg_music : "http://saas.ishanshan.com/upload/1495870990463.mp3",
						bg_name : "光宗信吉 - 金糸雀.mp3",
						share_config : {
							title : '凤凰机器人带您领略高科技',
							imgurl: 'https://img.ishanshan.com/gimg/img/851b66521377d978e2f0da174963192d',
							intro : '凤凰机器人20年致力于机器人教育，丰富的课程体系，雄厚的师资力量，让孩子快乐成长。'
						}
					}
				})
			} else if( activityTypeId == 105 ){
				me.setState({
					mainData : {
						name : "英语提问模板",
						bg_music : "http://saas.ishanshan.com/upload/1497488901367.mp3",
						bg_name : "Old Mcdonald Had A Farm.mp3",
						share_config : {
							title : '大脑地图带您学英语',
							imgurl: 'https://img.ishanshan.com/gimg/ori/80a12c03a9a6242f59df9d2649814eeb',
							intro : '应用大脑科学理论及信息技术，拥有80项科学专利，荣获多个科学教育奖项。'
						}
					}
				})
			}else if( activityTypeId == 106 ){
				me.setState({
					mainData : {
						name : "音乐会邀请函",
						bg_music : "http://saas.ishanshan.com/upload/1497937925088.mp3",
						bg_name : "My Soul.mp3",
						share_config : {
							title : '来悦尔听宝贝们的音乐吧',
							imgurl: 'https://img.ishanshan.com/gimg/img/72621e44d292253e72feed4c51804ce3',
							intro : '悦尔致力于3-8岁幼儿钢琴启蒙，开创式亲子体验课堂。'
						}
					},
				})
			}else if( activityTypeId == 107 ){
				me.setState({
					mainData : {
						name     : "早教通用模板",
						bg_music : "http://saas.ishanshan.com/upload/1498631959094.mp3",
						bg_name  : '早教通用.mp3',
						share_config : {
							title  : '招生啦!美吉姆带您过暑假!',
							imgurl : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
							intro  : '闪闪致力于0~8岁宝宝的早教培训，丰富的课程体系，雄厚的师资力量，让孩子赢在起跑线上。'
						}
					},
				})
			}else if( activityTypeId == 108 ){
				me.setState({
					mainData : {
						name : "美术通用模板",
						bg_music : "http://saas.ishanshan.com/upload/1498631975470.mp3",
						bg_name : "美术音乐.mp3",
						share_config : {
							title : '和番茄田一起学画画吧!',
							imgurl: 'https://img.ishanshan.com/gimg/ori/612b0c18f08dfda984fdc416e8a72891',
							intro : '番茄田专注儿童艺术教育上的创新思维，为中国儿童找到最合适的艺术启蒙方式。'
						}
					},
				})
			}else if( activityTypeId == 109 ){
				me.setState({
					mainData : {
						name : "舞蹈招生模板",
						bg_music : "http://saas.ishanshan.com/upload/1501031357394.mp3",
						bg_name : "酒馆.mp3",
						share_config : {
							title : '新爱婴招生啦！',
							imgurl: 'https://img.ishanshan.com/gimg/img/ca4a79698f2deba455a8dda10572fdbe',
							intro : '新爱婴早教对舞蹈艺术的苛刻追求，对教学质量严格把控，引导孩子向往美，展示美。'
						}
					},
				})
			}
		},100);

		if( activityTypeId == 101 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name : "美吉姆早教",
					bg_music : "http://saas.ishanshan.com/upload/1487242470068.mp3",
					bg_name : "Baby loves blues.mp3",
					share_config : {
						title : '美吉姆早教邀您免费来试听',
						imgurl: 'https://img.ishanshan.com/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
						intro : '美吉姆早教致力于0~3岁宝宝的早教培训，丰富的课程体系，雄厚的师资力量，让孩子赢在起跑线上。'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type : 'Page1Component',
						seqNo : 1,
						head_imgUrl : 'https://img.ishanshan.com/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
						title : '美吉姆早教',
						sub_title : '专业致力于早教培训，让您的孩子赢在起跑线上！',
						code_imgUrl : 'http://115.29.172.104/gimg/img/576d7daaa1acd5dda2381433918e9287',
						contact : [
							{ label : '手机', value : '136565443453 刘老师' },
							{ label : '微信', value : 'shanshan007' },
							{ label : '地址', value : '海威大厦18楼1808室' },
						]
					},{
						type : 'Page2Component',
						seqNo : 2,
						title : '机构介绍' ,
						intro : '美吉姆于1983年由威廉凯普林和 雅可夫、苏西 谢尔曼夫妇共同努力合作创立，旨在通过每周一次的结构性课程，帮助孩子构建强健的体魄，培养良好的社交能力，同时树立自尊心和自信心。',
						img_intro : [
							{ imgurl : 'http://115.29.172.104/gimg/img/da2a105668fb6e21ceae6fc46b17ff20' },
							{ imgurl : 'http://115.29.172.104/gimg/img/b4d3eba5a8a8df3f5789482029d8645d' }
						],
						course_intro : [
							'英语入门: 0~4岁，25课时，3000元',
							'感知世界: 2~4岁，20课时，2000元',
						    '钢琴基础: 5~8岁，40课时，5600元',
							'绘画入门: 6~9岁，50课时，6000元',
						],
					},{
						type : 'Page3Component',
						seqNo : 3,
						title : '免费预约' ,
					},
				]
			})
		} else if( activityTypeId == 102 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name : "语桥英语",
					bg_music : "http://saas.ishanshan.com/upload/1487242434588.mp3",
					bg_name : "Drew's Famous - If You're Happy And You Know It.mp3",
					share_config : {
						title : '语桥英语邀您免费来试听',
						imgurl: 'https://img.ishanshan.com/gimg/img/20177efff6df4216c5e869e77829fba8',
						intro : '语桥英语致力于英语培训20年，因为专注，所以专业。'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type : 'Page1Component',
						seqNo : 1,
						head_imgUrl : 'https://img.ishanshan.com/gimg/img/20177efff6df4216c5e869e77829fba8',
						title : '语桥少儿英语',
						sub_title : '专业致力于少儿英语培训，让您的孩子赢在起跑线上！',
						code_imgUrl : 'http://115.29.172.104/gimg/img/576d7daaa1acd5dda2381433918e9287',
						contact : [
							{ label : '手机', value : '136565443453 刘老师' },
							{ label : '微信', value : 'shanshan007' },
							{ label : '地址', value : '海威大厦18楼1808室' },
						]
					},{
						type : 'Page2Component',
						seqNo : 2,
						title : '机构介绍' ,
						intro : '语桥英语——国内领先的英语教育机构，专注于英语母语教学，为处在语言爆发期和上升期的孩子提供一站式科学、个性化、系统化的英语学习规划。',
						img_intro : [
							{ imgurl : 'http://115.29.172.104/gimg/img/da2a105668fb6e21ceae6fc46b17ff20' },
							{ imgurl : 'http://115.29.172.104/gimg/img/b4d3eba5a8a8df3f5789482029d8645d' }
						],
						course_intro : [
							'英语入门: 0~4岁，25课时，3000元',
							'感知世界: 2~4岁，20课时，2000元',
						    '钢琴基础: 5~8岁，40课时，5600元',
							'绘画入门: 6~9岁，50课时，6000元',
						],
					},{
						type : 'Page3Component',
						seqNo : 3,
						title : '免费预约' ,
						form_data : [
							{ field_label : '', field_value : '' }
						]
					},
				]
			})
		} else if( activityTypeId == 103 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name : "美吉姆长页模板",
					bg_music : "http://saas.ishanshan.com/upload/1487242512265.mp3",
					bg_name : "几米 - 拥有Masbfca (广告配乐完整版).mp3",
					share_config : {
						title : '美吉姆邀您免费试听',
						imgurl: 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
						intro : '美吉姆国际儿童教育中心致力于成为儿童早期素质教育实践者，为0-6岁的儿童提供一站式高端早教教育服务'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type : 'Page1Component',
						seqNo : 1,
						head_imgUrl : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
						title : '美吉姆早教',
						intro : '专业致力于英语培训, 让您的孩子赢在起跑线上！',
						organImgs : [
										{ imgurl : 'http://115.29.172.104/gimg/img/da2a105668fb6e21ceae6fc46b17ff20' },
										{ imgurl : 'http://115.29.172.104/gimg/img/b4d3eba5a8a8df3f5789482029d8645d' },
										{ imgurl : 'http://115.29.172.104/gimg/img/b4d3eba5a8a8df3f5789482029d8645d' },
										{ imgurl : 'http://115.29.172.104/gimg/img/b4d3eba5a8a8df3f5789482029d8645d' }
									],
						course_intro : [
										'英语入门: 0~4岁，25课时，3000元',
										'感知世界: 2~4岁，20课时，2000元',
									    '钢琴基础: 5~8岁，40课时，5600元',
										'绘画入门: 6~9岁，50课时，6000元',
									],
						code_imgUrl : 'http://115.29.172.104/gimg/img/576d7daaa1acd5dda2381433918e9287',
						contact : [
							{ label : '手机', value : '136565443453 刘老师' },
							{ label : '微信', value : 'shanshan007' },
							{ label : '地址', value : '海威大厦18楼1808室' },
						]
					}
				]
			})
		} else if( activityTypeId == 104 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name : "科技类通用模板",
					bg_music : "http://saas.ishanshan.com/upload/1495870990463.mp3",
					bg_name : "光宗信吉 - 金糸雀.mp3",
					share_config : {
						title : '凤凰机器人带您领略高科技',
						imgurl: 'https://img.ishanshan.com/gimg/img/851b66521377d978e2f0da174963192d',
						intro : '凤凰机器人20年致力于机器人教育，丰富的课程体系，雄厚的师资力量，让孩子快乐成长。'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type        : 'Page1Component',
						seqNo       : 1,
						headImgUrl  : 'https://img.ishanshan.com/gimg/img/851b66521377d978e2f0da174963192d',
						orgTitle    : '凤凰机器人',
						actiTitle   : '创意课5节免费送，先到先得哦！',
						expTitle    : '活动说明',
						expContent  : '凤凰机器人创意课，由国外知名导师打造，启发孩子想象力，让孩子们在游戏中得到启蒙。为回馈广大客户，在15日-20日免费送出5节创意课给优先报名的新会员，先到先得哦。',
						orgIntro    : '机构简介',
						orgContent  : '凤凰机器人为学生提供一个“学习科学知识，开发创造力与动手能力，培养学生团队协作能力”的平台',
						orgImgs :   [
							{ imgurl : 'http://115.29.172.104/gimg/img/10270322c277cb47ce1f33ef368e06c2' },
							{ imgurl : 'http://115.29.172.104/gimg/img/9ebd4c0d23125d8ba8020038d2dc6ecb' },
							{ imgurl : 'http://115.29.172.104/gimg/img/6b0b375476c90eca5579e742e3d6373f' },
						],
						couTitle    : '课程简介',
						couContent  : '• 小小工程师(3—5岁)\n• 创意机械师（5—6岁\n• 机器人建造师（6—7岁）',
						conTitle    : '联系我们',
						conContent  : '手机 : 18767225333\n地址 : 滨江区海威大厦1808\n微信 :  凤凰机器人',
						codeImgUrl  : 'http://115.29.172.104/gimg/img/576d7daaa1acd5dda2381433918e9287',
						remark      : '扫码关注我们哦'
					}
				]
			})
		} else if( activityTypeId == 105 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name : "英语提问模板",
					bg_music : "http://saas.ishanshan.com/upload/1497488901367.mp3",
					bg_name : "Old Mcdonald Had A Farm.mp3",
					share_config : {
						title : '大脑地图带您学英语',
						imgurl: 'https://img.ishanshan.com/gimg/ori/80a12c03a9a6242f59df9d2649814eeb',
						intro : '应用大脑科学理论及信息技术，拥有80项科学专利，荣获多个科学教育奖项。'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type  : 'Page1Component',
						seqNo : 1,
						head_imgUrl : 'https://img.ishanshan.com/gimg/ori/80a12c03a9a6242f59df9d2649814eeb',
						title : '大脑地图带您学英语',
						sub_title : '大脑地图英语培训',
					},{
						type  : 'Page2Component',
						seqNo : 2,
						title : '哪个字母可以喝?',
						correctAnswer : 'T',
						errorAnswer1 : 'A',
						errorAnswer2 : 'D',
						correctSort : '2',
						errorSort1 : '1',
						errorSort2 : '3',
						answers : [
							{ text : 'T', sort : '2', state : '1' },
							{ text : 'A', sort : '1', state : '0' },
							{ text : 'D', sort : '3', state : '0' }
						]
					},{
						type  : 'Page3Component',
						seqNo : 3,
						title : '爸爸和妈妈谁和你更近?',
						correctAnswer : 'mother',
						errorAnswer1 : 'father',
						errorAnswer2 : 'none',
						correctSort : '1',
						errorSort1 : '2',
						errorSort2 : '3',
						answers : [
							{ text : 'mother', sort : '1', state : '1' },
							{ text : 'father', sort : '2', state : '0' },
							{ text : 'none', sort : '3', state : '0' }
						]
					},{
						type  : 'Page4Component',
						seqNo : 4,
						title : '10个apples里面的S走了，还有几个?',
						correctAnswer : '1',
						errorAnswer1 : '0',
						errorAnswer2 : '9',
						correctSort : '1',
						errorSort1 : '2',
						errorSort2 : '3',
						answers : [
							{ text : '1', sort : '1', state : '1' },
							{ text : '0', sort : '2', state : '0' },
							{ text : '9', sort : '3', state : '0' }
						]
					},{
						type  : 'Page5Component',
						seqNo : 5,
						title : '想知道正确答案么？快到大脑地图来学英语吧！',
					},{
						type    : 'Page6Component',
						seqNo   : 6,
						title   : '机构介绍',
						content : '大脑地图引进从听、说、读、写全方位提升英语学习能力，为中国的英语教育开启未来学习的新模式。',
					},{
						type  : 'Page7Component',
						seqNo : 7,
						title : '报名参加',
					}
				]
			})
		} else if( activityTypeId == 106 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name : "音乐会邀请函",
					bg_music : "http://saas.ishanshan.com/upload/1497937925088.mp3",
					bg_name : "My Soul.mp3",
					share_config : {
						title : '来悦尔听宝贝们的音乐吧',
						imgurl: 'https://img.ishanshan.com/gimg/img/72621e44d292253e72feed4c51804ce3',
						intro : '悦尔致力于3-8岁幼儿钢琴启蒙，开创式亲子体验课堂。'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type  : 'Page1Component',
						seqNo : 1,
						title : '悦尔钢琴',
						sub_title : '诚邀您来参加宝贝音乐展',
						content : [
							'2017年7月1日13:00',
							'香格里拉酒店1楼宴会厅',
						    '联系电话：18723232323',
						],
					},{
						type  : 'Page2Component',
						seqNo : 2,
						title : '邀请词',
						content : '尊敬的家长朋友们：\n为了培养孩子们的学习兴趣，给孩子们搭建一个展示自我、互相交流学习的平台，同时帮助家长朋友们了解艺术学习的特殊性，我们本周将组织一场幼儿钢琴比赛，诚邀对钢琴班感兴趣的家长参与。\n因幼儿年龄较小均为初学者，所以请各位家长一定多给孩子鼓励，让宝贝自信地展示表演。'
					},{
						type  : 'Page3Component',
						seqNo : 3,
						title : '注意事项',
						content : '1.演奏会准时开始，入场以后，请将您的手机关机或静音。\n2.演奏会开始后，请勿随意走动。\n3.由于孩子们年龄较小，本身在众人面前演奏就较有压力，所以不论孩子发乎如何，请一定要多多鼓励。'
					},{
						type  : 'Page4Component',
						seqNo : 4,
						title : '现场照片',
						img_intro : [
							{ imgurl : 'https://img.ishanshan.com/gimg/img/a94eb095f8c28db197fa0891b9c4972c' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/b7174fbef62e9770d306c10898386ab4' },
						]
					},{
						type  : 'Page5Component',
						seqNo : 5,
						title : '现场照片',
						img_intro : [
							{ imgurl : 'https://img.ishanshan.com/gimg/img/7f2ae85d2b4864d9d75cddb6b1841c45' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/7035c7cef7cadbcaef4104a902c466e2' },
						]
					},{
						type    : 'Page6Component',
						seqNo   : 6,
						title   : '时间和地点',
						content : '地点：浙江省杭州市滨江区香格里拉酒店1楼宴会厅\n时间：2017年7月1日下午13:00——15:00',
						address_url : 'https://img.ishanshan.com/gimg/img/b5920915d1edc1aa58dcd233e0a93743',
					},{
						type  : 'Page7Component',
						seqNo : 7,
						title : '接受邀请',
					}
				]
			})
		} else if ( activityTypeId == 107 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name     : "早教通用模板",
					bg_music : "http://saas.ishanshan.com/upload/1498631959094.mp3",
					bg_name  : '早教通用.mp3',
					share_config : {
						title  : '招生啦!美吉姆带您过暑假!',
						imgurl : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
						intro  : '美吉姆致力于0~3岁宝宝的早教培训，丰富的课程体系，雄厚的师资力量，让孩子赢在起跑线上。'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type      : 'Page1Component',
						seqNo     : 1,
						title     : '美吉姆早教中心',
						sub_title : '招生啦！美吉姆带您过暑假，减价活动大促销，新老会员都可参加',
						head_imgUrl    : 'http://115.29.172.104/gimg/img/a26a19a999c15ca38434b9c7bea46fd9',
					},{
						type      : 'Page2Component',
						seqNo     : 2 ,
						title     : '机构环境',
						img_intro : [
							{ imgurl : 'https://img.ishanshan.com/gimg/img/5cd17d73a1d655f679bb5bc0dce21ba6' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/e3be2a581367cf76478315b888d52ae2' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/40b5aabb23f0affc45e7c5785a9e88f7' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/031dd751e1562cfd5df6e28307795352' },
						]
					},{
						type : 'Page3Component',
						seqNo : 3,
						title  : '品牌故事',
						content : '美吉姆由威廉和苏西谢尔曼夫妇共同努力合作创立。利用其在儿童早期教育、运动机能学、体育、舞蹈以及体操领域的专业经验，这几位创始人研发出了一套完整的符合孩子天性的课程体系和教学设备，旨在通过每周一次的结构性课程，帮助孩子构建强健的体魄，培养良好的社交能力，同时树立自尊心和自信心。',
					},{
						type : 'Page4Component',
						seqNo : 4,
						title  : '课程介绍',
						content : '欢动课：构筑健康心智及人格，让儿童以更加积极的心态应对未来社会的挑战\n, 音乐课：为儿童后续参加正式的音乐学习（乐器或者专业的声乐学习）奠定基础\n美术课：给予儿童早期丰富的多元文化体验，培养小小“世界公民”。',
					},{
						type : 'Page5Component',
						seqNo : 5,
						title : '师资力量' ,
						sub_title2 : '欧阳老师，国外留学归来，男，从事教育行业已有5年。',
						sub_title3 : '李老师，女，北京师范大学毕业，从业教育行业3年',
						sub_title4 : 'Linda老师，美国外交，有8年的教学经验。',
						img_intro : [
							{ imgurl : 'https://img.ishanshan.com/gimg/img/a4f10c500be87a7ae4febb29e6c7e451' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/ec45a2eb843f53ddb797139c1304601f' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/f422bdb549031632e2e909fb7471e38e' },
						]
					},{
						type : 'Page6Component',
						seqNo : 6,
						title : '报名参加',
					},{
						type   : 'Page7Component',
						seqNo  : 7,
						title  : '了解更多' ,
						subTitle : '教育从来都是一件美好的事情',
						content  : '地址：浙江省杭州市滨江区海威大厦1808室\n联系电话：400-800-2333',
						qrImgUrl  : 'http://115.29.172.104/gimg/img/8fdff2f6c3325b779aa59fc664be08e0',
						remark      : '长按二维码关注我们哦!',

					}],
			})
		}else if( activityTypeId == 108 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name : "美术通用模板",
					bg_music : "http://saas.ishanshan.com/upload/1498631975470.mp3",
					bg_name : "美术音乐.mp3",
					share_config : {
						title : '和番茄田一起学画画吧',
						imgurl: 'https://img.ishanshan.com/gimg/ori/612b0c18f08dfda984fdc416e8a72891',
						intro : '番茄田专注儿童艺术教育上的创新思维，为中国儿童找到最合适的艺术启蒙方式。'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type        	: 'Page1Component',
						seqNo       	: 1,
						p1HeadImgUrl  	: 'https://img.ishanshan.com/gimg/ori/612b0c18f08dfda984fdc416e8a72891',
						p1OrgName    	: '番茄田艺术',
						p1Title    		: '绘画班招生',
						p1SubTitle   	: '我们思考的不止儿童美术！',
						p2Title    		: '机构介绍',
						p2Content   	: '番茄田艺术隶属于精忠教育集团，已进入中国十年，成功推广运营全球早教领先品牌金宝贝，有着多年儿童领域方面的教学经验，经过几年的孕育，已经遍布全国近四十个城市。蕃茄田不只是在培养小小画家，而是让每个孩子能透过艺术接触，逐步养成创意思考的能力与习惯。',
						p3Title    		: '机构环境',
						p3Content   	: [
							{ imgurl : 'https://img.ishanshan.com/gimg/img/3d828c2404bf44e8998459de16f3ef63' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/6b0b375476c90eca5579e742e3d6373f' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/45ff7aa2d0c1a9c1fbd4c9a6ee9be9c9' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/3bb159478f2b8edf82b50b6bc0cd192f' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/2ea34d54a580c4df32b62b3ecaf6b089' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/605605c4d69f6fe4827856e56f95580e' },
						],
						p4Title    		: '课程简介',
						p4Content   	: '麻布上的风景：学习透视关系的表现，以及环境色的搭配\n小怪兽：通过观看动画电影《怪兽大学》，让孩子观察不同怪兽的卡通造型特征\n美味冰淇淋：观察冰淇淋的不同造型，了解冰淇淋的种类与味道。通过五感探索培养孩子对身边事物的感知能力并巧妙地运用多元媒材表现出来。',
						p5Title    		: '精彩瞬间',
						p5Content   	: [
							{ imgurl : 'https://img.ishanshan.com/gimg/img/fbcb131f1c1bf7f9c8148e3818b06798' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/6362006f94aad8f8f125dfc0d7905ab6' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/28a03187a5d77efe556713e74f0c15f2' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/77a717a651ea4b666e0a79a163071ffe' },
						],
						p6Title   		: '报名参加',
						p7Title    		: '了解更多',
						p7Content  	 	: '地址：浙江省杭州市滨江区海威大厦1808室\n联系电话：400-800-2333\n微信公众号：番茄田艺术',
						p7Remark      	: '也可以扫码关注我们哦',
						p7CodeImgUrl  	: 'http://115.29.172.104/gimg/img/576d7daaa1acd5dda2381433918e9287',
					}
				]
			})
		}else if( activityTypeId == 109 ){
			me.setState({
				currentPage : '',
				//分享页面配置项
				mainData : {
					name : "舞蹈招生模板",
					bg_music : "http://saas.ishanshan.com/upload/1501031357394.mp3",
					bg_name : "酒馆.mp3",
					share_config : {
						title : '新爱婴招生啦！',
						imgurl: 'https://img.ishanshan.com/gimg/img/ca4a79698f2deba455a8dda10572fdbe',
						intro : '新爱婴早教对舞蹈艺术的苛刻追求，对教学质量严格把控，引导孩子向往美，展示美。'
					}
				},
				//模板页面配置项
				detailData : [
					{
						type      	: 'Page1Component',
						seqNo     	: 1,
						title     	: '新爱婴早教',
						sub_title 	: '发现美、鉴赏美、创造美。',
						head_imgUrl : 'https://img.ishanshan.com/gimg/img/ca4a79698f2deba455a8dda10572fdbe',
					},{
						type  		: 'Page2Component',
						seqNo	 	: 2,
						title 		: '机构介绍',
						content 	: '新爱婴早教开设课程，包括少儿中国舞，民族民间舞少儿芭蕾舞少儿拉丁舞，爵士舞，街舞少儿模特形体班。对舞蹈艺术苛刻追求，对教学质量严格把控，引导孩子向往美，展示美。'
					},{
						type  		: 'Page3Component',
						seqNo	 	: 3,
						title 		: '机构环境',
						img_intro  	: [
							{ imgurl : 'https://img.ishanshan.com/gimg/img/bfe731a5f757a8635501154902fa8a29' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/e7139e7808f80969ba1d37d208e78951' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/234adc4ccff036249765053e5713d301' },
						],
					},{
						type  		: 'Page4Component',
						seqNo	 	: 4,
						title 		: '精彩瞬间',
						img_intro  	: [
							{ imgurl : 'https://img.ishanshan.com/gimg/img/8151682b180529b156f8d44d7148f549' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/242f78c8b219629771a46275ba8c2dea' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/75c8819b936582b4861376c64a8a6388' },
							{ imgurl : 'https://img.ishanshan.com/gimg/img/262ddd6334b41512eedf18999d8febc7' },
						],
					},{
						type    : 'Page5Component',
						seqNo   : 5,
						title   : '了解更多',
						content : '联系人：王老师\n地址：浙江省杭州市滨江区海威大厦1808室\n联系电话：400-800-2333',
						qrUrl 	: 'http://115.29.172.104/gimg/img/576d7daaa1acd5dda2381433918e9287',
					},{
						type   : 'Page6Component',
						seqNo  : 6,
						title  : '联系我们' ,
						subTitle : '快乐舞蹈，严加有爱！因材施教，共同进步！',
					},
				]
			})
		}
	},

	componentWillReceiveProps(nextProps) {
		if(nextProps.formVisible) {
			if ( (nextProps.formVisible && this.props.formVisible !== nextProps.formVisible) ){
				this.props.title == "新建微传单" ? this.initData(nextProps.activityTypeId) : this.updateInit(nextProps.activityId);
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
		clearInterval(window.timer);
		window.timer = null;
		clearInterval( window.wActivityTimer );
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

		let { detailData ,currentPage , mainData } = this.state;

		let { formVisible } = this.props;

		let templetType = this.props.activityTypeId || this.state.activityTypeId;

		return (
			<Modal
				title={ this.props.title }
				visible = { this.props.formVisible }
				maskClosable = { false }
	    		maskClosabltempletTypee={false}
				closable={true}
				width={ 960 }
				style={{top : '10px'}}
				onCancel={ this.changeTempletInstanceFormVisible }
				className="form-modal templet-instance-form-modal"
				footer = { null } >
				<div className="templet-instance-form-content">
					<div className="templet-instance-render-content">
						<div className="bg_phone">

							{
								templetType == 101 ?    <OrganGeneralRenderComponent  detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: templetType == 102 ?  <EnglishRenderComponent       detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: templetType == 103 ?  <OrganCommonRenderComponent   detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: templetType == 104 ?  <ScienceRenderComponent       detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: templetType == 105 ?  <EnglishTwoRenderComponent    detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: templetType == 106 ?  <MusicRenderComponent         detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: templetType == 107 ?  <LeafletsRenderComponent      detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: templetType == 108 ?  <FineArtsRenderComponent      detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: templetType == 109 ?  <DanceRenderComponent      	  detailData = { detailData } currentPage = { currentPage } mainData = { mainData } />

								: null
							}
						</div>
					</div>

					<div className="templet-instance-design-content">
						{  templetType == 101 ?
							<OrganGeneralDesignComponent mainData = { mainData }
														 detailData = { detailData }
														 refreshData={ this.refreshData }
														 initFlag = { this.state.initFlag }
														 formVisible = { formVisible }
														 onPreview = { this.onPreview }
														 onChildPreview = {this.onChildPreview}
														 saveInstance = {this.saveInstance}
														 activityId = {this.props.activityId || ''}
														 currentSelectCampus = { this.props.currentSelectCampus } />

						  : templetType == 102 ?
							<EnglishDesignComponent       mainData = { mainData }
														  detailData = { detailData }
														  refreshData={ this.refreshData }
														  initFlag = { this.state.initFlag }
														  formVisible = { formVisible }
														  onPreview = { this.onPreview }
														  onChildPreview = {this.onChildPreview}
														  saveInstance = {this.saveInstance}
														  activityId = {this.props.activityId || ''}
														  currentSelectCampus = { this.props.currentSelectCampus } />

						 : templetType == 103 ?
							<OrganCommonDesignComponent   mainData = { mainData }
														  detailData = { detailData }
														  refreshData={ this.refreshData }
														  initFlag = { this.state.initFlag }
														  formVisible = { formVisible }
														  onPreview = { this.onPreview }
														  onChildPreview = {this.onChildPreview}
														  saveInstance = {this.saveInstance}
														  activityId = {this.props.activityId || ''}
														  currentSelectCampus = { this.props.currentSelectCampus } />

						: templetType == 104 ?
							<ScienceDesignComponent   	  mainData = { mainData }
														  detailData = { detailData }
														  refreshData={ this.refreshData }
														  initFlag = { this.state.initFlag }
														  formVisible = { formVisible }
														  onPreview = { this.onPreview }
														  onChildPreview = { this.onChildPreview }
														  saveInstance = { this.saveInstance }
														  activityId = {this.props.activityId || ''}
														  currentSelectCampus = { this.props.currentSelectCampus } />

						: templetType == 105 ?
							<EnglishTwoDesignComponent 	  mainData = { mainData }
														  detailData = { detailData }
														  refreshData={ this.refreshData }
														  initFlag = { this.state.initFlag }
														  formVisible = { formVisible }
														  onPreview = { this.onPreview }
														  onChildPreview = { this.onChildPreview }
														  saveInstance = { this.saveInstance }
														  activityId = { this.props.activityId || '' }
														  currentSelectCampus = { this.props.currentSelectCampus } />

						: templetType == 106 ?
							<MusicDesignComponent mainData = { mainData }
												  detailData = { detailData }
												  refreshData={ this.refreshData }
												  initFlag = { this.state.initFlag }
												  formVisible = { formVisible }
												  onPreview = { this.onPreview }
												  onChildPreview = { this.onChildPreview }
												  saveInstance = { this.saveInstance }
												  activityId = { this.props.activityId || '' }
												  currentSelectCampus = { this.props.currentSelectCampus } />
						: templetType == 107 ?
							<LeafletsDesignComponent 	mainData = { mainData }
												  		detailData = { detailData }
														refreshData={ this.refreshData }
														initFlag = { this.state.initFlag }
														formVisible = { formVisible }
														onPreview = { this.onPreview }
														onChildPreview = { this.onChildPreview }
														saveInstance = { this.saveInstance }
														activityId = { this.props.activityId || '' }
														currentSelectCampus = { this.props.currentSelectCampus } />
						: templetType == 108 ?
							<FineArtsDesignComponent 	mainData = { mainData }
												  		detailData = { detailData }
														refreshData={ this.refreshData }
														initFlag = { this.state.initFlag }
														formVisible = { formVisible }
														onPreview = { this.onPreview }
														onChildPreview = { this.onChildPreview }
														saveInstance = { this.saveInstance }
														activityId = { this.props.activityId || '' }
														currentSelectCampus = { this.props.currentSelectCampus } />

						: templetType == 109 ?
							<DanceDesignComponent 		mainData = { mainData }
												  		detailData = { detailData }
														refreshData={ this.refreshData }
														initFlag = { this.state.initFlag }
														formVisible = { formVisible }
														onPreview = { this.onPreview }
														onChildPreview = { this.onChildPreview }
														saveInstance = { this.saveInstance }
														activityId = { this.props.activityId || '' }
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
