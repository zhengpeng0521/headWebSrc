/**
 * 口碑课程售卖 查询界面
 * @author yujq
 */
import React from 'react';
import Form from 'antd/lib/form';
import Button from 'antd/lib/button';
import Input from 'antd/lib/input';
import InputNumber from 'antd/lib/input-number';
import Select from 'antd/lib/select';
import Icon from 'antd/lib/icon';

let KoubeiCourseSearch = React.createClass({
	getInitialState() {
		return {

		}
	},

	onSearch() {
		  this.props.onSearch(this.props.form.getFieldsValue());
	},

	onClear() {
		  this.props.form.resetFields();
		  this.props.onSearch(this.props.form.getFieldsValue());
	  },

	render() {
		  let { getFieldProps } = this.props.form;
		  return (
				<Form horizontal className="ant-advanced-search-form" >
	    			<div className="search-content">
	    				<div className="search-item">
							<Input placeholder="请输入课程编号" {...getFieldProps('id')} />
						</div>
						<div className="search-item">
							<InputNumber min={0} step={0.01} placeholder="请输入现价最小值" style={{width : '45%'}} {...getFieldProps('minPrice')} />~
							<InputNumber min={0} step={0.01} placeholder="请输入现价最大值" style={{width : '45%'}} {...getFieldProps('maxPrice')} />
						</div>
						<div className="search-item">
							<Select
								style={{ width: 120 }}
							    placeholder="状态"
							     {...getFieldProps('status')}>
								<Option value="">全部</Option>
								<Option value="EFFECTIVE">已上架</Option>
								<Option value="PAUSE">已下架</Option>
								<Option value="ORIGINAL">待上架</Option>
								<Option value="FREEZE">冻结</Option>
								<Option value="INVALID">失效</Option>
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

let KoubeiCourseSearch_T = Form.create()(KoubeiCourseSearch);

export default React.createClass({
	render() {
		return (
             <KoubeiCourseSearch_T onSearch={this.props.onSearch} />
		);
	}
});
