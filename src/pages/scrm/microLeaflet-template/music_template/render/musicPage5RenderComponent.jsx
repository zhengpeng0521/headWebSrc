import React from 'react';
import style from '../music_template.less';

let MusicPage5RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className = "page-render-design music_page5_render">
				<div className = { style.music_page5_wrap } >
					<div className = { style.page4_border }>
						<div className = { style.page4_title }>
							{ !!detailData && detailData.title || '' }
						</div>
						<div className = { style.page4_img1 } style = {{ backgroundImage : `url( ${ ( !!detailData.img_intro[0] && detailData.img_intro[0].imgurl ) || '' })` }} >
						</div>
						<div className = { style.page4_img2 } style = {{ backgroundImage : `url( ${ ( !!detailData.img_intro[1] && detailData.img_intro[1].imgurl ) || '' })` }} >
						</div>
						<div className = { style.page5_cow } ></div>
						<div className = { style.page5_star } ></div>
						<div className = { style.page5_flower } ></div>
						<div className = { style.page5_guitar } ></div>
					</div>
				</div>
			</div>
		)
	}
});

export default MusicPage5RenderComponent;
