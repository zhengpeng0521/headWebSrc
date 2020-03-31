import React from 'react';
import style from '../music_template.less';

let MusicPage7RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){

		let { detailData } = this.props;

		return (
			<div className = "page-render-design music_page6_render">
				<div className = { style.music_page7_wrap } >
					<div className = { style.page7_border }>
						<div className = { style.page7_title }>
							{ !!detailData && detailData.title || '' }
						</div>
						<div className = { style.name }>学员姓名</div>
						<div className = { style.phone }>联系方式</div>
						<div className = { style.birthday }>学员生日</div>
						<div className = { style.remark }>备注</div>
						<div className = { style.btn }>提交</div>
						<div className = { style.page7_person }></div>
						<div className = { style.page7_flower }></div>
						<div className = { style.page7_book }></div>
						<div className = { style.page7_butterfly }></div>
					</div>
				</div>
			</div>
		)
	}
});

export default MusicPage7RenderComponent;
