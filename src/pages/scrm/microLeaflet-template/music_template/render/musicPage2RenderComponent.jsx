import React from 'react';
import style from '../music_template.less';

let MusicPage2RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		let contentArr = !!detailData && !!detailData.content && detailData.content.split('\n');

		return (
			<div className = "page-render-design music_page2_render">
				<div className = { style.music_page2_wrap } >
					<div className = { style.page2_border }>
						<div className = { style.page2_title }>
							{ !!detailData && detailData.title || '' }
						</div>
						<div className = { style.page2_content } >
							{ contentArr.length > 0 && contentArr.map( ( item, index ) => {
								return <p>{ item || '' }</p>
							}) }
						</div>
						<div className = { style.page2_person }></div>
						<div className = { style.page2_cloud }></div>
						<div className = { style.page2_wave }></div>
					</div>
				</div>
			</div>
		)
	}
});

export default MusicPage2RenderComponent;
