/**
 * 口碑订单 查询界面
 * @author yujq
 */
import React from 'react';
import Form from 'antd/lib/form';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import InputNumber from 'antd/lib/input-number';
import Select from 'antd/lib/select';
import Icon from 'antd/lib/icon';
import DatePicker from 'antd/lib/date-picker';

let KoubeiVerifySearch = React.createClass({
	getInitialState() {
		return {
			startTime : '',
			endTime : '',
			orgList : [],//有权限的门店列表
		}
	},

	componentDidMount() {
		let me = this;
		serviceRequest(BASE_URL+'orderOrgController/shopList', {funcKey: 'free-func' , commodityId : '201610200194070711' },
			function(ret) {
				let orgList = [];
				let results = ret.results;

				results && results.map(function(item) {
					let item_child = item.children;
					item_child && item_child.map(function(child_item) {
						orgList.push({
							orgid: child_item.key,
							org_name: child_item.label,
						});
					});
				});
				me.setState({
					orgList
				});
			}
		);
	},

	onSearch() {
		let values = this.props.form.getFieldsValue();
		this.props.onSearch({...values, sTime : this.state.startTime, mTime : this.state.endTime});
	},

	onClear() {
		  this.props.form.resetFields();
		  let values = this.props.form.getFieldsValue();
		  this.setState({
			  startTime : '',
			  endTime : '',
		  });
		  this.props.onSearch({...values, sTime : '', mTime : ''});
	  },

	searchStartTimeChange(date, dateString) {
		this.setState({
			startTime : dateString
		});
	},

	searchEndTimeChange(date, dateString) {
		this.setState({
			endTime : dateString
		});
	},

	render() {
		  let { getFieldProps } = this.props.form;

		  let loopOrgOpt = data => data.map((item) => {
			  return (
					  <Option value={item.orgid}>{item.org_name}</Option>
					  );
		  });


		  return (
				<Form horizontal className="ant-advanced-search-form" >
	    			<div className="search-content">
	    				<div className="search-item">
							<Input placeholder="请输入订单编号" {...getFieldProps('orderNo')} />
						</div>
						<div className="search-item">
							<Input placeholder="请输入商品名名称" {...getFieldProps('subject')} />
						</div>
						<div className="search-item">
							<DatePicker showTime format="yyyy-MM-dd HH:mm:ss" placeholder="请选择核销时间"  style={{width : '45%'}} value={this.state.startTime} onChange={this.searchStartTimeChange} />~
							<DatePicker showTime format="yyyy-MM-dd HH:mm:ss" placeholder="请选择核销时间" style={{width : '45%'}} value={this.state.endTime} onChange={this.searchEndTimeChange} />
						</div>
						<div className="search-item">
							<Select
								style={{ width: 120 }}
							    placeholder="订单来源"
							     {...getFieldProps('orderSrc')}>
								<Option value="">全部</Option>
								<Option value="1">支付宝口碑</Option>
								<Option value="0">闪闪早教</Option>
							</Select>
						</div>
						<div className="search-item">
							<Select  {...getFieldProps('settleOrg')}
								style={{ width: 250 }}
							    placeholder="核销门店" >
								<Option value="">全部</Option>
								{loopOrgOpt(this.state.orgList||[])}
							</Select>
						</div>
						<div className="search-item">
							<Button type="primary" onClick={this.onSearch}><Icon type="search" />搜索</Button>
							<Button onClick={this.onClear}>清除条件</Button>
						</div>
					</div>
			  </Form>
		);
	}

});

let KoubeiVerifySearch_T = Form.create()(KoubeiVerifySearch);

export default React.createClass({
	render() {
		return (
             <KoubeiVerifySearch_T onSearch={this.props.onSearch} />
		);
	}
});
