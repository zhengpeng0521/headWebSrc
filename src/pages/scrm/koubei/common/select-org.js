/**
 * 口碑
 * 选择门店窗口
 * @author yujq
 */
import React from 'react';
import Modal from 'antd/lib/modal';
import Button from 'antd/lib/button';
import Tree from 'antd/lib/tree';
import message from 'antd/lib/message';

import '../../css/koubei/select-org.css';

let TreeNode = Tree.TreeNode;

let SelectOrgModal = React.createClass({
	getInitialState() {
		return {
			visible : false,
			subBtnLoad : false,
			subBtnDisabled : false,

			koubei_org_list : [],//口碑早教机构列表
			koubeiOrgExpanded : ['koubei_org'],//口碑早教机构展开项
			koubeiOrgTreeChecked : [],//口碑早教机构数勾选节点(包含非机构节点)
			koubeiOrgChecked : [],//口碑早教机构

			refreshOrgBtnLoading : false,//同步在线门店按钮加载中状态
		}
	},

	componentDidMount() {
		let me = this;
		serviceRequest(BASE_URL+'orderOrgController/shopList', {funcKey: 'free-func' , commodityId : this.props.commodityId || '201610200194070711' },
			function(ret) {
				me.setState({
					koubei_org_list : ret.results
				});
			}
		);
    },

	//更新在线门店
	refreshCurrentOrg() {
    	let me = this;
    	this.setState({
    		refreshOrgBtnLoading : true
    	});
		serviceRequest(BASE_URL+'orderOrgController/synchroOrgStatus', {funcKey: 'free-func'},
			function(result) {
				serviceRequest(BASE_URL+'orderOrgController/shopList', {funcKey: 'free-func' , commodityId : me.props.commodityId || '201610200194070711'},
					function(ret) {
						me.setState({
							koubei_org_list : ret.results,
							refreshOrgBtnLoading : false,
						});
					}, function(ret) {
						message.error(ret.errorMessage || '操作出错啦');
						me.setState({
				    		refreshOrgBtnLoading : false
				    	});
					}
				);
			}, function(ret) {
				message.error(ret.errorMessage || '操作出错啦');
				me.setState({
		    		refreshOrgBtnLoading : false
		    	});
			}
		);
    },

	changeVisible(initData) {
		this.setState({
			visible : !this.state.visible
		});

		if(initData) {
			this.setState({
				koubeiOrgTreeChecked  : initData.koubeiOrgTreeChecked,
				koubeiOrgChecked : initData.koubeiOrgTreeChecked
			});
		}
	},

	submitForm() {
		if(this.props.afterSubmit) {
			this.props.afterSubmit(this.state.koubeiOrgChecked);
		}
		this.changeVisible();
	},

	koubeiOrgExpand(expandedKeys, obj) {
		this.setState({
			koubeiOrgExpanded : expandedKeys
	    });
	},

	koubeiOrgTreeCheck(checkedKeys, e) {
		let koubeiOrgChecked = [];
		if(e && e.checkedNodes && e.checkedNodes.length > 0 ) {
			e.checkedNodes.map(function(item){
				if(item.props.mark == 'shop') {
					koubeiOrgChecked.push(item);
				}
			});
		}
		this.setState({
			koubeiOrgTreeChecked : checkedKeys,
			koubeiOrgChecked
	    });
	},

	render() {

		let { koubeiOrgTreeChecked, koubeiOrgChecked, koubei_org_list } = this.state;
		//所有门店列表
		let loopKoubeiOrg = data => data.map((item) => {

		      if(item) {
		    	  if (item.children) {
			          return (
			            <TreeNode key={item.key} title={item.label} mark={item.mark} >
			              {loopKoubeiOrg(item.children)}
			            </TreeNode>
			          );
			        }
			        return <TreeNode key={item.key} title={item.label} mark={item.mark} />;
		      }
	      });

		//已选择的门店列表
		let loopKoubeiOrgSelected = data => data.map((item) => {
			  let newItem = {...item};

		      if (item.children && item.children.length > 0) {
		    	  let newchildren = [];
		    	  item.children.map(function(childItem) {
		    		  koubeiOrgTreeChecked && koubeiOrgTreeChecked.length > 0 && koubeiOrgTreeChecked.map(function(checkItem) {
				    	  if(checkItem == childItem.key) {
				    		  newchildren.push(childItem);
				    	  }
				      });
		    	  });
		    	  newItem.children = newchildren;
		      }

		      if(newItem.children && newItem.children.length > 0) {
		    	  return newItem;
		      }
	      });

		let koubei_org_list_selected = [];
		let koubei_org_list_selected_arr = loopKoubeiOrgSelected(koubei_org_list);
		if(koubei_org_list_selected_arr && koubei_org_list_selected_arr.length > 0) {
			koubei_org_list_selected_arr.map(function(item) {
				if(item) {
					let newItem = {...item};
					if (item.children && item.children.length > 0) {
				    	  let newChildren = [];
				    	  item.children.map(function(childItem) {
				    		  if(childItem) {
				    			  newChildren.push(childItem);
				    		  }
				    	  });
				    	  newItem.children = newChildren;
				      }
					koubei_org_list_selected.push(newItem);
				}
			});
		}


		let koubei_org_list_nodes = loopKoubeiOrg(koubei_org_list);
		let koubei_org_list_selected_nodes = loopKoubeiOrg(koubei_org_list_selected);

		let footerBtns = [];
		let treeCheckable = true;

		if(this.props.edit_able == 'no') {
			treeCheckable = false;
			footerBtns = [
			                 <Button key="cancle" type="ghost" size="large" onClick={this.changeVisible.bind(this, undefined)}> 取 消 </Button>
			               ];
		} else {
			footerBtns = [
			              	<div className="koubei_select_org_bar_left_cont">
				                 <Button key="refreshCurrentOrg" type="ghost" size="large" onClick={this.refreshCurrentOrg} disabled={this.state.refreshOrgBtnLoading} loading={this.state.refreshOrgBtnLoading} > 更新在线门店 </Button>
		                		 <span className="refresh_current_org_msg">如果提示门店异常,请更新门店</span>
			                 </div>,
			                 <Button key="cancle" type="ghost" size="large" onClick={this.changeVisible.bind(this, undefined)}> 取 消 </Button>,
			                 <Button key="submit" type="primary" size="large" onClick={this.submitForm} disabled={this.state.subBtnDisabled} loading={this.state.subBtnLoad}>保存</Button>
			               ];
		}

		return (
			<Modal
				title="选择门店"
				visible={this.state.visible}
        		maskClosable={false}
				closable={true}
				width={750}
				onCancel={this.changeVisible.bind(this, undefined)}
				className="form-modal koubei-select-org-modal"
				footer={footerBtns}>

				<div className="koubei-select-org-modal-content">
					<div className="org-select-tree">
						<p className="org-select-tree-title">可选门店</p>
						<div className="org-select-tree-item">
							<Tree
						        checkable={treeCheckable} multiple
						        autoExpandParent={false}
								onExpand={this.koubeiOrgExpand} expandedKeys={this.state.koubeiOrgExpanded}
								onCheck={this.koubeiOrgTreeCheck} checkedKeys={this.state.koubeiOrgTreeChecked} selectedKeys={this.state.koubeiOrgTreeChecked}
						      >
								<TreeNode title="口碑早教" key="koubei_org">
					        		{koubei_org_list_nodes}
				        		</TreeNode>
				        	</Tree>
						</div>
					</div>

					<div className="org-select-tree org-selected-tree">
						<p className="org-select-tree-title">已选门店</p>
						<div className="org-select-tree-item">
							<Tree
						        checkable={false} multiple
						        autoExpandParent={false}
								onExpand={this.koubeiOrgExpand} expandedKeys={this.state.koubeiOrgExpanded}
								onCheck={null} checkedKeys={this.state.koubeiOrgTreeChecked} selectedKeys={this.state.koubeiOrgTreeChecked}
						      >
								<TreeNode title="口碑早教" key="koubei_org">
									{koubei_org_list_selected_nodes}
				        		</TreeNode>
				        	</Tree>
						</div>
					</div>

				</div>

		      </Modal>
		);
	}

});

export default SelectOrgModal;
