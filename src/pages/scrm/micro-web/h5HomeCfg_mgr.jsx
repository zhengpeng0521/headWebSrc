import React from 'react';
import {Row, Col, Button,Tree,Select,Form,message } from 'antd';
const PreviewMain = require('./preview/previewMain');
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
const Option = Select.Option;

const gData = [{
	title : '标签页',
	key : 'tabs',
	type :　'block'
},{
	title : '地址及时间',
	key : 'dzsj',
	type : 'block'
},{
	title : '业务范围',
	key : 'ywfw',
	type : 'block'
},{
	title : '适合年龄',
	key : 'shnl',
	type : 'block'
},{
	title : '机构介绍',
	key : 'jgjs',
	type : 'block'
},{
	title : '机构设施',
	key : 'jgss',
	type : 'block'
},{
	title : '底部按钮',
	key : 'dban',
	type : 'block'
}]

let RightFunc = React.createClass({
	getInitialState(){
		return {
			expandedKeys: [],
		    autoExpandParent: true,
		    blocks: [],
		    selectedKeys: [],
		    theme : "default",
			cfgIntro : this.props.cfgIntro,
			orgInfo : this.props.orgInfo,
		}
	},
	componentWillReceiveProps(nextProps) {
        this.setState({
        	cfgIntro : nextProps.cfgIntro?nextProps.cfgIntro:{},
			orgInfo : nextProps.orgInfo?nextProps.orgInfo:{},
			theme : nextProps.theme?nextProps.theme:"default",
			blocks : nextProps.blocks?nextProps.blocks:[],
		});
    },
	 onExpand(expandedKeys) {
		this.setState({
		  expandedKeys,
		  autoExpandParent: false,
		});
	},
	onCheck(blocks) {
	    this.setState({
	      blocks,
	      selectedKeys: [],
	    });
	    this.freshPreview({
	    	blocks : blocks,
	    	theme : this.state.theme
	    });
	  },
	  onSelect(selectedKeys, info) {
	    this.setState({ selectedKeys });
	  },
	  confirm(){
		  let theme = this.state.theme;
		  if(!this.state.orgInfo.isFee && theme!="default"){
			  message.warning("升级成付费版才能使用该主题,升级热线：0571-56000087",8);
		  }else{
			  let params={};
			  params.blocks = this.state.blocks.join(",");
			  params.theme = this.state.theme;
			  params.orgCode = this.props.form.getFieldValue("org");
			  params.funcKey = "microweb-add";
			  serviceRequest(BASE_URL+"microwebController/add",{...params},
					  function(result) {
				  if(result.errorCode=='9000'){
					  message.info("发布成功");
				  }else{
					  message.info(result.errorMessage);
				  }
			  })
		  }
	  },
	  selectThemeChange(e,a){
		  if(e){
			  //删除无关主题的css
			  let head = document.getElementsByTagName('head')[0];
			  let links = document.getElementsByTagName('link');
			  for(let i=links.length-1;i>=0;i--){
				  let link = links[i];
				  let href = link.href;
				  if(/(default|business|simplicity|fashion|chinawind|fresh).css$/.test(href)){
					  head.removeChild(link);
				  }
			  }
			  //加载对应主题样式
			  dynamicLoading.css(BASE_URL+"resources/css/"+e+".css");
		  }
		  this.setState({
			  theme : e
		  });
	  },
	  orgChange(e){
		  //选择机构,显示机构设置信息
		let cfgIntro = this.state.cfgIntro,theme,blocks;
		if(cfgIntro && cfgIntro.length>0){
			let intro = JSON.parse(cfgIntro);
			if(intro[e] && intro[e].length>0){
				let cfg = JSON.parse(intro[e]);
				theme = cfg.theme;
				blocks = cfg.blocks.split(",");
			}else{
				theme = "default";
				blocks = ["tabs"];
			}
		}else{
			theme = "default";
			blocks = ["tabs"];
		}
		this.setState({
			selectOrg : e,
			theme : theme,
			blocks :　blocks
		});

		this.freshPreview({
			theme: theme,
			blocks: blocks,
			orgCode : e
		});
	  },
	 freshPreview(params){
		  this.props.freshPreview(params);
	  },
	render(){
		  const { getFieldProps } = this.props.form;
		  const formItemLayout = {
				  labelCol: { span: 6 },
				  wrapperCol: { span: 14,offset:2 },
				};
		  const loop = data => data.map((item) => {
		      if (item.children) {
		        return (
		          <TreeNode key={item.key} title={item.title} >
		            {loop(item.children)}
		          </TreeNode>
		        );
		      }
		      return <TreeNode key={item.key} title={item.title} />;
		    });
		  let themes = [{value:"default",title:"默认",intro:"免费"},{value:"chinawind",title:"中国风",intro:"专用"},
		                {value:"business",title:"商务",intro:"专用"},{value:"simplicity",title:"简约",intro:"专用"},
		                {value:"fashion",title:"时尚",intro:"专用"},{value:"fresh",title:"清新",intro:"专用"}];
		return (

				<Form>
					<FormItem {...formItemLayout} label="主题">
					<div className="template-box">
					{themes.map((theme)=>{
							return (
								<div className="wgw-theme" style={{border: this.state.theme==theme.value? "5px solid #2db7f5" : "0"}}
									onClick={this.selectThemeChange.bind(this,theme.value)}>
									<img src={"./resources/images/theme/"+theme.value+"@3x.png"} alt="" />
									<div className="template-bottombg"></div>
									<div className="template-bottom">
										<div className="template-bottom-left">{theme.title}</div>
										<div className="template-bottom-right">{theme.intro}</div>
										{(theme.value!="default")?<div className="wgw-vip">VIP</div>:""}
									</div>
								</div>
							)

						})
					}
					</div>
					</FormItem>
					<FormItem {...formItemLayout} label="显示区块">
						<Tree checkable multiple={this.props.multiple}
					        onExpand={this.onExpand} expandedKeys={this.state.expandedKeys}
					        autoExpandParent={this.state.autoExpandParent}
					        onCheck={this.onCheck} checkedKeys={this.state.blocks}
					        onSelect={this.onSelect} selectedKeys={this.state.selectedKeys}
					      >
					        {loop(gData)}
					      </Tree>
				      </FormItem>
				      <FormItem  label=" " {...formItemLayout}>
				      	<Button onClick={this.confirm} className="wgw_fb" type="primary">发布</Button>
				      </FormItem>
			</Form>
		)
	}

});

RightFunc = Form.create()(RightFunc);

const HomeManager = React.createClass({
	getInitialState(){
		return {
			cfgIntro : {},
			orgInfo :{}
		}
	},
	componentWillReceiveProps(nextProps) {
		let orgInfo = nextProps.orgInfo?nextProps.orgInfo:{};
        this.setState({
        	orgInfo : orgInfo,
			cfgIntro: nextProps.cfgIntro?nextProps.cfgIntro:{},
			theme : orgInfo.isFee?(nextProps.theme?nextProps.theme:"default"):"default",
			blocks : nextProps.blocks?nextProps.blocks:"",
		});
    },
	freshPreview(params){
		this.setState({
			theme : params.theme,
			blocks : params.blocks
		});

	},
	render(){
		return (
			<div>
				<div className="wgw-left">
				    <div className="wgw-preview-font">预览</div>
				    <div className="wgw-iphone">
				        <div className="wgw-iphone-inner">
				        	<PreviewMain theme={this.state.theme} blocks={this.state.blocks} data={this.state.orgInfo}/>
				        </div>
				    </div>
			    </div>
			    <div className="wgw-right">
			        <div className="template-setting">模板设置</div>
			        <RightFunc cfgIntro={this.state.cfgIntro} orgInfo={this.state.orgInfo}
			        	theme={this.state.theme} blocks={this.state.blocks} freshPreview={this.freshPreview}/>
			    </div>
			</div>
		)
	}

});

export default HomeManager;
