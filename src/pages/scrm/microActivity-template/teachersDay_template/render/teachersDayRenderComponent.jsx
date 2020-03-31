/**
 * 模板配置项主控制器
 * @author yhwu
 */

import React from 'react';

//引入渲染页面模板
import TeachersDayMainRenderComponent from '../../general_template/generalMainRenderComponent';
import TeachersDayPageRenderComponent from './teachersDayPageRenderComponent';

let SummerCampRenderComponent = React.createClass({
	getInitialState() {
		return {
			detailData      : this.props.detailData  || "",
			mainData        : this.props.mainData    || "",
			currentPage     : this.props.currentPage || "",
			currentPageType : '',
		}
	},
	componentWillReceiveProps(nextProps) {
		if( this.props.currentPage !== nextProps.currentPage ){
			this.setState({
				currentPage : nextProps.currentPage || "",
			})
		}
		this.setState({
			detailData : nextProps.detailData || "",
			mainData   : nextProps.mainData   || "",
		})
	},
	render(){

		let { detailData, currentPage, mainData } = this.state;

		detailData = detailData[ currentPage - 1 ] || "";

		let currentPageType = detailData ? detailData.type : "";

		return (
			<div>
				{
					currentPageType == '' ? <TeachersDayMainRenderComponent mainData = { mainData } />

					: currentPageType == 'Page1Component' ? <TeachersDayPageRenderComponent detailData = { detailData } />

					: null
				}
			</div>
		)
	}
});

export default SummerCampRenderComponent;

