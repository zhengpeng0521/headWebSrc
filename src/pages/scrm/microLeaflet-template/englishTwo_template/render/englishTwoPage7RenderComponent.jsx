import React from 'react';

let EnglishTwoPage7RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className = 'page-render-design english_two_page7_render' >
				<div className = 'english_two_title'>
					{ !!detailData && detailData.title || '' }
				</div>
				<div className = 'english_name common'>
					学员姓名
				</div>
				<div className = 'english_phone common'>
					联系方式
				</div>
				<div className = 'english_birthday common'>
					学员生日
				</div>
				<div className = 'english_btn common'>
					提交
				</div>
			</div>
		)
	}
});

export default EnglishTwoPage7RenderComponent;
