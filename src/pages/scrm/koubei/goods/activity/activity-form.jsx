/**
 * 口碑
 * 活动售卖新增修改界面
 * @author yujq
 */
import React from 'react';
import Modal from 'antd/lib/modal';
import Button from 'antd/lib/button';
import Form from 'antd/lib/form';
import Select from 'antd/lib/select';
import Input from 'antd/lib/input';
import InputNumber from 'antd/lib/input-number';
import Upload from 'antd/lib/upload';
import Icon from 'antd/lib/icon';
import DatePicker from 'antd/lib/date-picker';
import Checkbox from 'antd/lib/checkbox';
import message from 'antd/lib/message';
import moment from 'moment';

let CheckboxGroup = Checkbox.Group;
let FormItem = Form.Item;
let RangePicker = DatePicker.RangePicker;

let SelectOrgModal = require('../common/select-org');
let KoubeiGoodsPreview = require('../common/goods-preview');

let KoubeiActivityFormModal = React.createClass({

	getInitialState() {
		return {
			visible : false,//窗口是否展示
			subBtnLoad : false,//提交按钮是否加载中
			subBtnDisabled : false,//提交按钮是否禁用
			formDataId : undefined,//表单数据的编号   初始化数据用

			selectedOrg : [], //选中的门店
			fengmianList : [],//商品主图
			detailImgList : [],//商品详情图
			onLineTimeType : 'now',//商品上架时间选择类型
			onLineTime : '',//商品上架时间
			activityTime : [],//活动时间
			ageArr : [],//课程 适合年龄 数据项
			age : [],//适合年龄

			gmtStartDisabled : false,//商品上架时间是否显示
			goodsIntros: [], //商品简介
		}
	},

	//关闭窗口
	changeVisible() {
		this.props.changeVisible();
		let form = this.props.form;
		form.resetFields();
	},

	componentDidMount() {
		//加载基础数据
		let me = this;

		//加载适合年龄基础数据
		serviceRequest(BASE_URL+"orderGoodController/courseInit",{funcKey: 'free-func'},
			function(ret) {
				let ageArr = [];
				ret.data.ageList && ret.data.ageList.length > 0 && ret.data.ageList.map(function(item){
					ageArr.push({label : item.dictName, value : item.dictName});
				});

				me.setState({
					ageArr
				});
			}
		);
	},

	componentWillReceiveProps(nextProps) {
		this.setState({
			visible : nextProps.visible,
			formDataId : nextProps.formDataId
		});
		if(this.props.visible != nextProps.visible && nextProps.visible) {
			this.initFormData(nextProps.formDataId);
		}
	},

	submitForm() {
		let me = this;
		let form = this.props.form;

		form.validateFieldsAndScroll((errors, values) => {
			  if (!!errors) {
				  return;
		      }
			  //封装数据， 和后台数据适配

			  //封面数据
			  let fenmian = (this.state.fengmianList && this.state.fengmianList.length > 0 ) ? this.state.fengmianList[0] : {};
			  fenmian = {imgId : fenmian.imageId, imgurl : fenmian.url};

			  //详情图片
			  let pictureDetails = [];
			  this.state.detailImgList.map(function(item) {
				  pictureDetails.push({imgId : item.imageId, imgurl : item.url});
			  });


			  let params = {};
			  params.subject = values.activityName;
			  params.cover = JSON.stringify(fenmian);
			  params.pictureDetails = JSON.stringify(pictureDetails);
			  params.price = values.price || values.yuanjia;
			  params.originalPrice = values.yuanjia;
			  params.inventory = values.kucun;
			  params.weight = values.seqNo || 0;
			  params.orgIds = values.belongOrg;
			  params.gmtStart = values.onLineTime == 'now' ? moment().format('YYYY-MM-DD HH:mm:ss') : values.onLineTime;
			  params.gmtStartType = values.onLineTime == 'now' ? 1 : 2;
			  params.validityPeriod = values.youxiao;
			  //商品简介
			  let goodsIntros = this.state.goodsIntros;
			  if(goodsIntros && goodsIntros.length > 0) {
				  let activityDescList = [];
				  goodsIntros.map(function(introItem) {
					  activityDescList.push(values[introItem.key]);
				  });
				  params.activityDesc = activityDescList.join('#$@&$#');
			  }

			  params.activityTime = values.activityTime;
			  params.activityAddr = values.activityAddr;
			  params.activityAge = values.age;
			  params.reservation = values.maaInfo;
			  params.fitPerson = values.availablePeople;
			  params.ruleRemind = values.ruleWarn;

			  params.id = me.state.formDataId;

			  me.setState({
				  subBtnLoad : true,
				  subBtnDisabled : true,
			  });
			//提交数据
			  params.backDealBm = backDealBm;//测试租户号串套的测试代码
			  let submitUrl = params.id == undefined ? BASE_URL+"orderGoodController/activityCreate" : BASE_URL+"orderGoodController/activityUpdate";
			serviceRequest(submitUrl, {...params, funcKey: 'koubeimarket-activity-add'},
				function(ret) {
					message.success(params.id == undefined ? '活动新增成功' : '活动修改成功');

					me.setState({
					  subBtnLoad : false,
					  subBtnDisabled : false,
					});

					me.changeVisible();
					me.props.afterSubmit && me.props.afterSubmit();
				},
				function(ret) {
					message.error(ret.errorMessage);
					me.setState({
					  subBtnLoad : false,
					  subBtnDisabled : false,
					});
				}
			);
		});
	},

	initFormData(activityId) {

		let state = {
			subBtnLoad : false,//提交按钮是否加载中
			subBtnDisabled : false,//提交按钮是否禁用
			formDataId : undefined,//表单数据的编号   初始化数据用

			selectedOrg : [], //选中的门店
			fengmianList : [],//商品主图
			detailImgList : [],//商品详情图
			onLineTimeType : 'now',//商品上架时间选择类型
			onLineTime : '',//商品上架时间
			activityTime : [], //活动时间
			age : [],//适合年龄

			gmtStartDisabled : false,//商品上架时间是否显示

			goodsIntros: [{
				key: 'courseIntro_' + 0,
				index: 0,
				value: '',
			}],
		}

		if(activityId != undefined) {
			let me = this;
			serviceRequest(BASE_URL+"orderGoodController/getActivityById",{'goodsId' : activityId, funcKey: 'koubeimarket-activity-list'},
				function(ret) {
					let form = me.props.form;
					let orgIds = ret.data.orgIds || [];
					let data = (ret.results && ret.results.length > 0 ) ? ret.results[0] : {};
					let cover = JSON.parse(data.cover);//封面
					let pictureDetails = JSON.parse(data.pictureDetails);//详情图片
					let detailImgform = [];
					let detailImgstate = [];
					pictureDetails && pictureDetails.length > 0 && pictureDetails.map(function(item, index) {
						detailImgform.push(item.imgurl);
						detailImgstate.push({
							uid : index,
							url : item.imgurl,
							imageId : item.imgId
						});
					});

					//初始化form
					form.setFieldsValue({'activityName' : data.subject});
					form.setFieldsValue({'fengmian' :   cover.imgurl});
					form.setFieldsValue({'detailImg' :  detailImgform.join(',')});
					form.setFieldsValue({'price' :    data.price});
					form.setFieldsValue({'yuanjia' :    data.originalPrice});
					form.setFieldsValue({'kucun' :    data.inventory});
					form.setFieldsValue({'seqNo' :    data.weight});
					form.setFieldsValue({'onLineTime' :    data.gmtStart});
					form.setFieldsValue({'youxiao' :    data.validityPeriod});//有效天数

					//form.setFieldsValue({'activityIntro' :    data.activityDesc});//活动简介
					//商品简介改为动态添加数量
					let activityDesc = data.activityDesc || '';
					if(activityDesc != undefined && activityDesc.length > 0) {
						let activityDescArr = activityDesc.split('#$@&$#');

						if(activityDescArr && activityDescArr.length > 0) {
							let goodsIntros = [];
							//循环绑定商品简介表单
							for(let i = 0; i < activityDescArr.length; i++) {
								let goodsIntroItemKey = 'activityIntro_'+i;
								let goodsIntroItemValue = activityDescArr[i];
								goodsIntros.push({
									key: goodsIntroItemKey,
									index: i,
									value: goodsIntroItemValue,
								});

								let goodsIntroItemForm = {};
								goodsIntroItemForm[goodsIntroItemKey] = goodsIntroItemValue;
								form.setFieldsValue(goodsIntroItemForm);
							}
							state.goodsIntros = goodsIntros;
						}
					}
					form.setFieldsValue({'age' :    data.courseAge});//适用年龄
					state.age = data.courseAge ? data.courseAge.split(",") : [];
					form.setFieldsValue({'activityTime' :    data.activityTime || ''});//活动时间
					let activityTimearr = data.activityTime ? data.activityTime.split("~") : [];
					if(activityTimearr && activityTimearr.length > 1) {
						state.activityTime = [moment(activityTimearr[0], 'YYYY-MM-DD HH:mm:ss')._d, moment(activityTimearr[1], 'YYYY-MM-DD HH:mm:ss')._d];
					}
					form.setFieldsValue({'activityAddr' :    data.activityAddr});//活动地址

					form.setFieldsValue({'maaInfo' :   data.reservation});//预约信息
					form.setFieldsValue({'availablePeople' :   data.fitPerson});//适用人群
					form.setFieldsValue({'ruleWarn' :   data.ruleRemind});//规则提醒

					state.formDataId = data.id;
					state.fengmianList = [{
						uid : -1,
						url : cover.imgurl,
						imageId : cover.imgId
					}];
					state.detailImgList = detailImgstate;
					state.onLineTimeType = '';
					state.onLineTime = data.gmtStart;

					//选中的门店
					if(orgIds && orgIds.length > 0 ) {
						state.selectedOrg = orgIds;
						form.setFieldsValue({ 'belongOrg' : orgIds.join(',') });
					} else {
						form.setFieldsValue({ 'belongOrg' : undefined });
					}

					if(data.status == 'ORIGINAL' || data.status == 'INIT') {
						state.gmtStartDisabled = false;
					} else {
						state.gmtStartDisabled = true;
					}

					me.setState(state);
				},
				function(ret) {
					message.error(ret.errorMessage);
					me.setState(state);
				}
			);
		} else {
			this.setState(state);
		}

    },

	//校验是否包含关键字
	checkWrongWord(rule, value, callback) {
    	if(value && value != '') {
    		if((/^.*(储\s*值\s*卡|充\s*值\s*卡|会\s*员\s*卡|v\s*i\s*p\s*卡|充\s*值\s*卡|打\s*折\s*卡|年\s*卡|美\s*容\s*卡|健\s*身\s*卡).*$/.test(value.toLowerCase()))){
        		callback('不能包含关键字');
        	} else {
        		callback();
        	}
    	} else {
    		callback();
    	}
	},

	//校验原价是否大于现价
	checkNum(rule, value, callback) {
    	if((/^[0-9]*(.[0-9]*)?$/.test(value))){
    		callback();
    	} else {
    		callback('请填写数字');
    	}
	},

	//校验正整数
	checkPositiveNum(rule, value, callback) {
		if(value && value != '') {
			if(!(/^[0-9]*(.[0-9]*)?$/.test(value))){
	    		callback('请填写数字');
	    	} else if(value > 0){
	    		callback();
	    	} else {
	    		callback('请填写一个正数');
	    	}
		} else {
			callback();
		}
	},

	//校验原价是否大于现价
	checkYouxiao(rule, value, callback) {
		if(value) {
			if(value > 360 || value < 7){
	    		callback('有效天数控制在7-360之间');
	    	} else {
	    		callback();
	    	}
		} else {
			callback('请填写有效天数');
		}

	},

	//校验是否是纯数字
	checkOnlyNum(rule, value, callback) {
		if((/^[0-9.]*$/.test(value))){
    		callback('内容项不可以是纯数字');
    	} else {
    		callback();
    	}
	},

	//校验原价
	checkPrice(rule, value, callback) {
		let form = this.props.form;
		let price = parseFloat( (form.getFieldValue('price') || 0) + '');
		let yuanjia = parseFloat( (form.getFieldValue('yuanjia') || 0) + '');

		if(price > 0) {
			if(price >= 0.01) {
				if(price > 5000) {
					callback('现价不能超过5000');
				} else if(yuanjia > 0 && price > yuanjia) {
					callback('原价必须大于现价');
				} else {
					callback();
				}
			} else {
				callback('价格至少为0.01');
			}
		} else {
			callback();
		}
	},

	//校验原价是否大于现价
	checkYuanjia(rule, value, callback) {
		let form = this.props.form;
		let price = parseFloat( (form.getFieldValue('price') || 0) + '');
		let yuanjia = parseFloat( (form.getFieldValue('yuanjia') || 0) + '');

		if(yuanjia > 0) {
			if(yuanjia >= 0.01) {
				if(price > yuanjia) {
					callback('原价必须大于现价');
				} else {
					callback();
				}
				if(price == 0 && yuanjia > 5000) {
					callback('原价不能超过5000');
				}
			} else {
				callback('价格至少为0.01');
			}
		} else {
			callback('请输入原价');
		}
	},

	//校验库存
	checkKucun(rule, value, callback) {
		if(value && value > 0) {
			callback();
		} else {
			callback('请填写库存');
		}
	},

	//选择适用门店
	changeBelongOrg() {
		let initData = {
			koubeiOrgTreeChecked : this.state.selectedOrg
		};
		this.refs.koubei_org_select_modal.changeVisible(initData);
	},

	updateBelongOrg(orgs) {
		let form = this.props.form;
		let selectOrgArr = [];
		if(orgs && orgs.length > 0 ) {
			orgs.map(function(item) {
				selectOrgArr.push(item.key || item);
			});
			form.setFieldsValue({
				'belongOrg' : selectOrgArr.join(',')
			});
		} else {
			form.setFieldsValue({
				'belongOrg' : undefined
			});
		}
		this.setState({
			selectedOrg : selectOrgArr
		});
	},

	//封面图片删除
	fengmianRemove(file) {
		let fengmianList = [];
		this.state.fengmianList && this.state.fengmianList.map(function(item){
			if(item.uid != file.uid) {
				fengmianList.push(item);
			}
		});
		this.setState({
			fengmianList
		});
		this.props.form.setFieldsValue({"fengmian": undefined});
	},

	//上传图片大小限制
	imageBeforeUpload(file) {
		if(file.size > 5242880) {
			message.error('图片大小过大');
			return false;
		}
		if(this.state.detailImgList && this.state.detailImgList.length == 5) {
			message.error('最多配置5张图片');
			return false;
		}
		return true;
	},

	//封面图片变更时
	fengmianChange(info) {
		let fileList = info.fileList;
	    // 1. 上传列表数量的限制
	    // 只显示最近上传的一个，旧的会被新的顶掉
	    fileList = fileList.slice(-1);
		// 3. 按照服务器返回信息筛选成功上传的文件
	    fileList = fileList.filter((file) => {
	      if (file.response) {
	    	  if(file.response.errorCode === 5000) {
	    		  message.error(file.response.errorMessage);
	    	  }
	        return file.response.errorCode === 9000;
	      }
	      return true;
	    });
	    // 2. 读取远程路径并显示链接
	    fileList = fileList.map((file) => {
	      if (file.response) {
	        // 组件会将 file.url 作为链接进行展示
	        file.url = file.response.data.url;
	        file.imageId = file.response.data.imageId;
	      }
	      return file;
	    });
	    this.props.form.setFieldsValue({"fengmian": fileList[0].url});
	    this.setState({
	    	fengmianList : fileList
    	});
	},

	//商品详情图片删除
	detailImgRemove(file) {
		let detailImgList = [];
		this.state.detailImgList && this.state.detailImgList.map(function(item){
			if(item.uid != file.uid) {
				detailImgList.push(item);
			}
		});
		this.setState({
			detailImgList
		});
		this.props.form.setFieldsValue({"detailImg": ( detailImgList && detailImgList.length > 0 ) ? detailImgList.join(',') : undefined});
	},

	//封面图片变更时
	detailImgChange(info) {
		let detailImgUrlList = [];
		let fileList = info.fileList;
	    // 1. 上传列表数量的限制
	    // 只显示最近上传的一个，旧的会被新的顶掉
	    fileList = fileList.slice(-5);
		// 3. 按照服务器返回信息筛选成功上传的文件
	    fileList = fileList.filter((file) => {
	      if (file.response) {
	    	  if(file.response.errorCode === 5000) {
	    		  message.error(file.response.errorMessage);
	    	  }
	        return file.response.errorCode === 9000;
	      }
	      return true;
	    });
	    // 2. 读取远程路径并显示链接
	    fileList = fileList.map((file) => {
	      if (file.response) {
	        // 组件会将 file.url 作为链接进行展示
	        file.url = file.response.data.url;
	        file.imageId = file.response.data.imageId;
	        detailImgUrlList.push(file.response.data.url);
	      }
	      return file;
	    });
	    this.props.form.setFieldsValue({"detailImg": detailImgUrlList.join(',')});
	    this.setState({
	    	detailImgList : fileList
    	});
	},

	//校验原价是否大于现价
	checkActivityTime(rule, value, callback) {
		if(value && value.length > 0) {
			callback();
		} else {
			callback('请选择活动时间');
		}
	},

	//上架时间类型选择框变更
	onLineTimeTypeChange(value) {
		this.setState({
			onLineTimeType : value,
			onLineTime : ''
		});
	},

	onLineTimeChange(date, dateString) {
		this.setState({
			onLineTime : dateString
		});
		let form = this.props.form;
		form.setFieldsValue({
			'onLineTime' : dateString || ''
		});
	},

	//适合年龄选择
	ageChange(checkedValue) {
		this.setState({
			age : checkedValue
		});

		let form = this.props.form;
		form.setFieldsValue({
			'age' : (checkedValue && checkedValue.length > 0) ? checkedValue.join(',') : undefined
		});
	},

	activityTimeChange(dates, dateStrings) {
		this.setState({
			activityTime : dates
		});
		let form = this.props.form;
		form.setFieldsValue({
			'activityTime' : dateStrings.join('~')
		});
	},

	disabledOnlineTime(dateValue) {
		let today = new Date();
		today.setHours(0);
		today.setMinutes(0);
		today.setSeconds(0);
		today.setMilliseconds(0);
	    return dateValue.time < today.getTime();
    },

    //删除商品简介的项目
	removeGoodsIntroItem(key) {

		let {goodsIntros} = this.state;
		if(goodsIntros && goodsIntros.length > 0) {

			if(goodsIntros.length == 1) {
				message.warn('至少留一项简介内容');
				return;
			}

			let newList = [];
			goodsIntros.map(function(introItem) {
				if(introItem.key != key) {
					newList.push(introItem);
				}
			});

            this.setState({
            	goodsIntros: newList
            });
		}
	},

	addGoodsIntro() {
		let {goodsIntros} = this.state;

		if(goodsIntros && goodsIntros.length > 0) {

			if(goodsIntros.length == 10) {
				message.warn('最多填写10项简介内容');
				return;
			}

			let lastItem = goodsIntros[goodsIntros.length-1];
			let newIndex = lastItem.index + 1;
			goodsIntros.push({
				key: 'courseIntro_' + newIndex,
				index: newIndex,
				value: '',
			});
		} else {
			goodsIntros = [{
				key: 'courseIntro_' + 0,
				index: 0,
				value: '',
			}];
		}

		this.setState({
			goodsIntros,
		});
	},

	render() {
		let { getFieldValue, getFieldProps, getFieldError, isFieldValidating } = this.props.form;

		let { goodsIntros } = this.state;
		let formItemLayout = {
			labelCol: { span: 4 },
			wrapperCol: { span: 18 },
	    };

		let offsetLayout = {
			labelCol: { span: 0 },
			wrapperCol: { span: 18, offset: 4, },
	    };

		let activityNameProps = getFieldProps('activityName', {
    		  validate: [{
  		        rules: [
  		          { required: true , message : '请填写活动名称'}
  		        ],
  		        trigger: ['onBlur', 'onChange']
  		      }, {
		        rules: [
  		          { max: 20 , message : '活动名称限20汉字以内'}
  		        ],
  		        trigger: ['onBlur', 'onChange']
  		      },{
  		        rules: [
	                { validator: this.checkWrongWord }
  		        ],
		        trigger: ['onBlur', 'onChange']
  		      }, {
  		        rules: [
	                { validator: this.checkOnlyNum }
  		        ],
		        trigger: ['onBlur', 'onChange']
  		      }],
		    });

		let priceProps = getFieldProps('price', {
			validate: [{
  		        rules: [
  			          { validator: this.checkPositiveNum }
  			        ],
  			        trigger: ['onBlur', 'onChange']
  				},{
  		        rules: [
  			          { validator: this.checkPrice }
  			        ],
  			        trigger: ['onBlur', 'onChange']
  				}],
		    });

		let yuanjiaProps = getFieldProps('yuanjia', {
			validate: [{
  		        rules: [
	                { validator: this.checkYuanjia },
  		        ],
  		        trigger: ['onBlur', 'onChange'],
  		      }, {
  		        rules: [
  			          { validator: this.checkNum }
  			        ],
  			        trigger: ['onBlur', 'onChange']
  				}],
		    });

		let kucunProps = getFieldProps('kucun', {
		      rules: [
	              { validator: this.checkKucun }
		      ],
		      trigger: ['onBlur', 'onChange']
		    });

		let seqNoProps = getFieldProps('seqNo');

		let youxiaoProps = getFieldProps('youxiao', {
			validate: [{
		        rules: [
		          { validator: this.checkPositiveNum }
		        ],
		        trigger: ['onBlur', 'onChange']
			}, {
		        rules: [
		          { validator: this.checkYouxiao }
		        ],
		        trigger: ['onBlur', 'onChange']
			}]
	    });

		let belongOrgProps = getFieldProps('belongOrg', {
			validate: [{
		        rules: [
		          { required: true , message : '请选择适用门店'}
		        ],
		        trigger: ['onBlur', 'onChange']
		      }],
		    });

		let fengmianProps = getFieldProps('fengmian', {
			validate: [{
		        rules: [
		          { required: true , message : '请选择活动封面'}
		        ],
		        trigger: ['onBlur', 'onChange']
		      }],
		    });

		let fengmianBtnProps = {
			      action: BASE_URL+'orderGoodController/img?funcKey=upload',
			      listType: 'picture-card',
			      onChange : this.fengmianChange,
			      fileList : this.state.fengmianList,
			      onRemove : this.fengmianRemove,
			      beforeUpload : this.imageBeforeUpload,
			    };

		let detailImgProps = getFieldProps('detailImg', {
			validate: [{
		        rules: [
		          { required: true , message : '请选择活动详情图'}
		        ],
		        trigger: ['onBlur', 'onChange']
		      }],
		    });

		let detailImgBtnProps = {
			      action: BASE_URL+'orderGoodController/img?funcKey=upload',
			      listType: 'picture-card',
			      multiple : true,
			      onChange : this.detailImgChange,
			      fileList : this.state.detailImgList,
			      onRemove : this.detailImgRemove,
			      beforeUpload : this.imageBeforeUpload,
			    };

		let onLineTimeProps = getFieldProps('onLineTime', {
			initialValue: this.state.onLineTimeType,
			validate: [{
  		        rules: [
  		          { required: !this.state.gmtStartDisabled , message : '请选择上架时间'}
  		        ],
  		        trigger: ['onBlur', 'onChange']
  		      }],
          });


		let activityTimeProps = getFieldProps('activityTime', {
		      rules: [
	              { validator: this.checkActivityTime }
		      ],
		      trigger: ['onBlur', 'onChange']
		    });

		let activityAddrProps = getFieldProps('activityAddr', {
  		  validate: [{
		        rules: [
		          { required: true , message : '请填写活动地址'}
		        ],
		        trigger: 'onBlur'
		      },{
		        rules: [
  		          { max: 100 , message : '限100汉字以内'},
  		        ],
  		        trigger: ['onBlur', 'onChange'],
  		      }, {
		        rules: [
		                { validator: this.checkOnlyNum }
	  		        ],
			        trigger: ['onBlur', 'onChange']
	  		      },{
  		        rules: [
  		                { validator: this.checkWrongWord }
  	  		        ],
  			        trigger: ['onBlur', 'onChange']
  	  		      }],
		    });

		let ageProps = getFieldProps('age', {
	  		  validate: [{
			        rules: [
			          { required: true , message : '请选择适合年龄'}
			        ],
			        trigger: ['onBlur', 'onChange']
			      }],
			    });

		let maaInfoProps = getFieldProps('maaInfo', {
			validate: [{
		        rules: [
  		          { max: 100 , message : '限100汉字以内'},
  		        ],
  		        trigger: ['onBlur', 'onChange'],
  		      }, {
		        rules: [
		                { validator: this.checkOnlyNum }
	  		        ],
			        trigger: ['onBlur', 'onChange']
	  		      },{
  		        rules: [
  		                { validator: this.checkWrongWord }
  	  		        ],
  			        trigger: ['onBlur', 'onChange']
  	  		      }],
		    });
		let availablePeopleProps = getFieldProps('availablePeople', {
			validate: [{
		        rules: [
  		          { max: 100 , message : '限100汉字以内'},
  		        ],
  		        trigger: ['onBlur', 'onChange'],
  		      }, {
		        rules: [
		                { validator: this.checkOnlyNum }
	  		        ],
			        trigger: ['onBlur', 'onChange']
	  		      },{
  		        rules: [
  		                { validator: this.checkWrongWord }
  	  		        ],
  			        trigger: ['onBlur', 'onChange']
  	  		      }],
		    });
		let ruleWarnProps = getFieldProps('ruleWarn', {
			validate: [{
		        rules: [
  		          { max: 100 , message : '限100汉字以内'},
  		        ],
  		        trigger: ['onBlur', 'onChange'],
  		      }, {
		        rules: [
		                { validator: this.checkOnlyNum }
	  		        ],
			        trigger: ['onBlur', 'onChange']
	  		      },{
  		        rules: [
  		                { validator: this.checkWrongWord }
  	  		        ],
  			        trigger: ['onBlur', 'onChange']
  	  		      }],
		    });

		//构造商品简介的表单
		let goodsIntroForm = [];
		for(let i = 0; i < goodsIntros.length; i++) {
			let goodsIntrosItem = goodsIntros[i];
			let goodsIntroItemProps = getFieldProps(goodsIntrosItem.key, {
		  		  validate: [{
				        rules: [
				          { required: true , message : '请填写活动简介'},
				        ],
				        trigger: 'onBlur',
				      },{
				        rules: [
		  		          { max: 100 , message : '限100汉字以内'},
		  		        ],
		  		        trigger: ['onBlur', 'onChange'],
		  		      }, {
				        rules: [
				                { validator: this.checkOnlyNum }
			  		        ],
					        trigger: ['onBlur', 'onChange']
			  		      },{
		  		        rules: [
		  		                { validator: this.checkWrongWord }
		  	  		        ],
		  			        trigger: ['onBlur', 'onChange']
		  	  		      }],
				    });

			let introLayout = i == 0 ? formItemLayout : offsetLayout;
			goodsIntroForm.push(
					<FormItem
						{...introLayout}
						key={'goods_intro_formitem_' + goodsIntrosItem.key}
						label={i == 0 ? '活动简介' : ''}
						hasFeedback
			            help={isFieldValidating(goodsIntrosItem.key) ? '校验中...' : <span className='form-validate-msg'>{(getFieldError(goodsIntrosItem.key) || []).join(', ')}</span>} >

						<Input type="textarea" {...goodsIntroItemProps} autosize={{ minRows: 2, maxRows: 2 }}  style={{width : '85%'}} placeholder="请填写课程简介"  />
						<Icon className="goods_intro_item_remove" type="minus-circle-o" onClick={() => this.removeGoodsIntroItem(goodsIntrosItem.key)} title="删除简介"/>
			          </FormItem>
			);
		}

		let introLayout = goodsIntros.length == 0 ? formItemLayout : offsetLayout;
		goodsIntroForm.push(
				<FormItem
					{...introLayout}
					key={'goods_intro_formitem_add'}
					label={goodsIntros.length == 0 ? '活动简介' : ''} >

					<Button type="primary" onClick={this.addGoodsIntro} className="goods-form-intro-add-btn" >添加简介</Button>
		          </FormItem>
		);
		return (

			<Modal
				title={this.state.formDataId == undefined ? (<span>新增活动 (<span className="must-input"></span>为必填)</span>) : (<span>修改活动 (<span className="must-input"></span>为必填)</span>) }
				visible={this.state.visible}
        		maskClosable={false}
				closable={true}
				width={940}
				onCancel={this.changeVisible}
				className="form-modal"
				footer={[
	                 <Button key="cancle" type="ghost" size="large" onClick={this.changeVisible}> 取 消 </Button>,
	                 <Button key="submit" type="primary" size="large" onClick={this.submitForm} disabled={this.state.subBtnDisabled} load={this.state.subBtnLoad}>保存</Button>
	               ]}>
	<div style={{width : '910px'}} className="common-preview-modal-content">
		<div style={{width : '600px'}} className="common-preview-modal-form-cont">
			<Form
				horizontal
				className="common-component-form">

				<div className="common-component-form-item-title">
					<span className="item-title-t"></span>
					<span className="item-title-text">基本信息</span>
				</div>

		          <FormItem
					{...formItemLayout}
					label="活动名称" hasFeedback
	                help={isFieldValidating('activityName') ? '校验中...' :
	                	<div>
    						<p>限20汉字，禁止输入以下关键字：储值卡、充值卡、会员卡、vip卡、充值卡、打折卡、年卡、美容卡、健身卡</p>
    						<span className='form-validate-msg'>{(getFieldError('activityName') || []).join(', ')}</span>
						</div>} >

					<Input {...activityNameProps} type="text" style={{width : '100%'}} placeholder="请填写活动名称(限20汉字以内)"  />

		          </FormItem>

		          <FormItem
					{...formItemLayout}
					label="活动封面" hasFeedback
	                help={isFieldValidating('fengmian') ? '校验中...' :
	                		<div>
	                		<p>商品首图。支持png,jpeg,gif格式的图片,建议宽高比16:9,建议宽高: 1242*698px 图片大小≤5M</p>
                			<span className='form-validate-msg'>{(getFieldError('fengmian') || []).join(', ')}</span>
                			</div>} >

					<Upload {...fengmianProps} {...fengmianBtnProps} >
			          <Icon type="plus" />
			          <div className="ant-upload-text">选择活动封面</div>
			        </Upload>

		          </FormItem>

		          <FormItem
					{...formItemLayout}
					label="详情图片" hasFeedback
	                help={isFieldValidating('detailImg') ? '校验中...' :
	                		<div>
	                		<p>商品详情图,最多5张.支持png,jpeg,gif格式的图片,建议宽高比16:9,建议宽高: 1242*698px 图片大小≤5M</p>
                			<span className='form-validate-msg'>{(getFieldError('detailImg') || []).join(', ')}</span>
                			</div>} >

					<Upload {...detailImgProps} {...detailImgBtnProps} >
			          <Icon type="plus" />
			          <div className="ant-upload-text">选择图片</div>
			        </Upload>

		          </FormItem>

		          <FormItem
					{...formItemLayout}
					label="活动现价" hasFeedback
	                help={isFieldValidating('price') ? '校验中...' : <span className='form-validate-msg'>{(getFieldError('price') || []).join(', ')}</span>} >

					<InputNumber {...priceProps} min={0.01} step={0.01} placeholder="请输入课程现价" style={{width : '100%'}}  />

		          </FormItem>

		          <FormItem
					{...formItemLayout}
					label={(<span><span className="must-input"></span>活动原价</span>)} hasFeedback
	                help={isFieldValidating('yuanjia') ? '校验中...' : <span className='form-validate-msg'>{(getFieldError('yuanjia') || []).join(', ')}</span>} >

					<InputNumber {...yuanjiaProps} min={0.01} step={0.01} placeholder="必须大于现价,合理的差价会吸引用户下单" style={{width : '100%'}}  />

		          </FormItem>

		          <FormItem
					{...formItemLayout}
					label={(<span><span className="must-input"></span>活动库存</span>)} hasFeedback
	                help={isFieldValidating('kucun') ? '校验中...' : <span className='form-validate-msg'>{(getFieldError('kucun') || []).join(', ')}</span>} >

					<InputNumber {...kucunProps} min={1} max={9999} step={1} placeholder="必须设置为1~9999中某个整数" style={{width : '100%'}} />

		          </FormItem>

		          <FormItem
					{...formItemLayout}
					label="排序值" hasFeedback
	                help={isFieldValidating('seqNo') ? '校验中...' : <span className='form-validate-msg'>{(getFieldError('seqNo') || []).join(', ')}</span>} >

					<InputNumber {...seqNoProps} min={0} max={9999} step={1} placeholder="设置为0~9999中某个整数;用户在浏览时排序值大的会排在前面" style={{width : '100%'}} />

		          </FormItem>

		          <FormItem
					{...formItemLayout}
					label="适用门店" hasFeedback
	                help={isFieldValidating('belongOrg') ? '校验中...' : <span className='form-validate-msg'>{(getFieldError('belongOrg') || []).join(', ')}</span>} >

					<span style={{'color' : '#00b4ff', 'marginRight' : '16px'}}>{this.state.selectedOrg.length}家</span>
					<Button type="primary" onClick={this.changeBelongOrg} {...belongOrgProps} >选择</Button>

		          </FormItem>

				{ !this.state.gmtStartDisabled ?
				<FormItem
					{...formItemLayout}
					label="上架时间" hasFeedback
	                help={isFieldValidating('onLineTime') ? '校验中...' : <span className='form-validate-msg'>{(getFieldError('onLineTime') || []).join(', ')}</span>} >

					<Select {...onLineTimeProps}
					    style={{ width: '40%' }}
					    placeholder="请选择上架时间"
			    		value={this.state.onLineTimeType}
					    onChange={this.onLineTimeTypeChange}
					  >
					    <Option value="now">立即上架</Option>
					    <Option value="">指定时间</Option>
					  </Select>

				    {this.state.onLineTimeType != 'now' ?
				    		<DatePicker showTime disabledDate={this.disabledOnlineTime} format="yyyy-MM-dd HH:mm:ss" placeholder="请选择时间" onChange={this.onLineTimeChange} value={this.state.onLineTime} style={{width : '40%', marginLeft : '16px'}} />
				    : null
				    }

		          </FormItem>
		          : null }

		          <FormItem
					{...formItemLayout}
					label={(<span><span className="must-input"></span>有效天数</span>)} hasFeedback
	                help={isFieldValidating('youxiao') ? '校验中...' : <span className='form-validate-msg'>{(getFieldError('youxiao') || []).join(', ')}</span>} >

					<InputNumber  {...youxiaoProps} min={0} max={360} step={1} placeholder="用户购买后多少天之内可以使用,过期作废,钱自动退回到用户账户" style={{width : '100%'}} />

		          </FormItem>

		          <div className="common-component-form-item-title">
					<span className="item-title-t"></span>
					<span className="item-title-text">活动详情</span>
				</div>

				{goodsIntroForm}

		          <FormItem
					{...formItemLayout}
					label="活动时间" hasFeedback
	                help={isFieldValidating('activityTime') ? '校验中...' : <span className='form-validate-msg'>{(getFieldError('activityTime') || []).join(', ')}</span>} >

					<RangePicker {...activityTimeProps} showTime format="yyyy-MM-dd HH:mm:ss" style={{width : '100%'}} onChange={this.activityTimeChange} value={this.state.activityTime}  />

		          </FormItem>

		          <FormItem
					{...formItemLayout}
					label="活动地址" hasFeedback
	                help={isFieldValidating('activityAddr') ? '校验中...' : <span className='form-validate-msg'>{(getFieldError('activityAddr') || []).join(', ')}</span>} >

					<Input {...activityAddrProps}  type="text" style={{width : '100%'}} placeholder="请填写活动地址" />

		          </FormItem>

		          <FormItem
					{...formItemLayout}
					label="适合年龄" hasFeedback
	                help={isFieldValidating('age') ? '校验中...' : <span className='form-validate-msg'>{(getFieldError('age') || []).join(', ')}</span>} >

					<CheckboxGroup {...ageProps} options={this.state.ageArr} value={this.state.age} onChange={this.ageChange}  />

		          </FormItem>

		          <div className="common-component-form-item-title">
					<span className="item-title-t"></span>
					<span className="item-title-text">补充信息</span>
				</div>

				<FormItem
					{...formItemLayout}
					label="预约信息" hasFeedback
	                help={isFieldValidating('maaInfo') ? '校验中...' : <span className='form-validate-msg'>{(getFieldError('maaInfo') || []).join(', ')}</span>} >

					<Input {...maaInfoProps} type="text" style={{width : '100%'}} placeholder="请填写预约信息"  />

		          </FormItem>

		          <FormItem
					{...formItemLayout}
					label="适用人群" hasFeedback
	                help={isFieldValidating('availablePeople') ? '校验中...' : <span className='form-validate-msg'>{(getFieldError('availablePeople') || []).join(', ')}</span>} >

					<Input {...availablePeopleProps} type="text" style={{width : '100%'}} placeholder="请填写适用人群" />

		          </FormItem>

		          <FormItem
					{...formItemLayout}
					label="规则提醒" hasFeedback
	                help={isFieldValidating('ruleWarn') ? '校验中...' : <span className='form-validate-msg'>{(getFieldError('ruleWarn') || []).join(', ')}</span>} >

					<Input {...ruleWarnProps} type="text" style={{width : '100%'}} placeholder="请填写规则提醒" />

		          </FormItem>

				<SelectOrgModal ref="koubei_org_select_modal" afterSubmit={this.updateBelongOrg}/>
			</Form>
		</div>
		<div style={{width : '285px'}} className="common-preview-modal-preview-cont">
			<KoubeiGoodsPreview koubeiGoods={this.props.form.getFieldsValue()} koubeiGoodsType="activity" />
		</div>
	</div>
		</Modal>
		);
	}

});

let KoubeiActivityFormModal_T = Form.create()(KoubeiActivityFormModal);

export default KoubeiActivityFormModal_T;
