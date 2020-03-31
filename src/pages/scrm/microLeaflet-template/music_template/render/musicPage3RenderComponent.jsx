import React from 'react';
import style from '../music_template.less';

let MusicPage3RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		let contentArr = !!detailData && !!detailData.content && detailData.content.split('\n');

		return (
			<div className = "page-render-design music_page2_render">
				<div className = { style.music_page3_wrap } >
					<div className = { style.page2_border }>
						<div className = { style.page2_title }>
							{ !!detailData && detailData.title || '' }
						</div>
						<div className = { style.page2_content } >
							{ contentArr.length > 0 && contentArr.map( ( item, index ) => {
								return <p>{ item || '' }</p>
							}) }
						</div>
						<div className = { style.page3_person }></div>
						<div className = { style.page3_yue1 }></div>
						<div className = { style.page3_yue2 }></div>
						<div className = { style.page3_yue3 }></div>
						<div className = { style.page3_flower }></div>
					</div>
				</div>
			</div>
		)
	}
});

export default MusicPage3RenderComponent;
