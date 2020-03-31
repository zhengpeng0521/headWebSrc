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

let KoubeiOrderSearch = React.createClass({
	getInitialState() {
		return {
			startTime : '',
			endTime : '',
		}
	},

	onSearch() {
		let values = this.props.form.getFieldsValue();
		this.props.onSearch({...values, startTime : this.state.startTime, endTime : this.state.endTime});
	},

	onClear() {
		  this.props.form.resetFields();
		  let values = this.props.form.getFieldsValue();
		  this.setState({
			  startTime : '',
			  endTime : '',
		  });
		  this.props.onSearch({...values, startTime : '', endTime : ''});
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
		  return (
				<Form horizontal className="ant-advanced-search-form" >
	    			<div className="search-content">
	    				<div className="search-item">
							<Input placeholder="请输入订单编号" {...getFieldProps('purchaseId')} />
						</div>
						<div className="search-item">
							<Input placeholder="请输入商品名名称" {...getFieldProps('goodsName')} />
						</div>
						<div className="search-item">
							<DatePicker showTime format="yyyy-MM-dd HH:mm:ss" placeholder="请选择下单时间"  style={{width : '45%'}} value={this.state.startTime} onChange={this.searchStartTimeChange} />~
							<DatePicker showTime format="yyyy-MM-dd HH:mm:ss" placeholder="请选择下单时间" style={{width : '45%'}} value={this.state.endTime} onChange={this.searchEndTimeChange} />
						</div>
						<div className="search-item">
							<Select
								style={{ width: 120 }}
							    placeholder="订单来源"
							     {...getFieldProps('src')}>
								<Option value="">全部</Option>
								<Option value="1">支付宝口碑</Option>
								<Option value="0">闪闪早教</Option>
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

let KoubeiOrderSearch_T = Form.create()(KoubeiOrderSearch);

export default React.createClass({
	render() {
		return (
             <KoubeiOrderSearch_T onSearch={this.props.onSearch} />
		);
	}
});
