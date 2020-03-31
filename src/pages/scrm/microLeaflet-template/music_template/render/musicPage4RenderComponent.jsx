import React from 'react';
import style from '../music_template.less';

let MusicPage4RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className = "page-render-design music_page4_render">
				<div className = { style.music_page4_wrap } >
					<div className = { style.page4_border }>
						<div className = { style.page4_title }>
							{ !!detailData && detailData.title || '' }
						</div>
						<div className = { style.page4_img1 } style = {{ backgroundImage : `url( ${ ( !!detailData.img_intro[0] && detailData.img_intro[0].imgurl ) || '' })` }} >
						</div>
						<div className = { style.page4_img2 } style = {{ backgroundImage : `url( ${ ( !!detailData.img_intro[1] && detailData.img_intro[1].imgurl ) || '' })` }} >
						</div>
						<div className = { style.page4_duck } ></div>
						<div className = { style.page4_flower } ></div>
						<div className = { style.page4_paino } ></div>
					</div>
				</div>
			</div>
		)
	}
});

export default MusicPage4RenderComponent;
