import React from 'react';
import style from '../music_template.less';

let MusicPage6RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){

		let { detailData } = this.props;
		let contentArr = !!detailData && !!detailData.content && detailData.content.split('\n');

		return (
			<div className = "page-render-design music_page6_render">
				<div className = { style.music_page6_wrap } >
					<div className = { style.page6_border }>
						<div className = { style.page6_title }>
							{ !!detailData && detailData.title || '' }
						</div>
						<div className = { style.address_img } style = {{ backgroundImage : `url( ${ detailData.address_url || '' })` }}>
						</div>
						<div className = { style.page6_content } >
							{ contentArr.length > 0 && contentArr.map( ( item, index ) => {
								return <p>{ item || '' }</p>
							}) }
						</div>
						<div className = { style.page6_person } ></div>
						<div className = { style.page6_grass } ></div>
						<div className = { style.page6_cup } ></div>
						<div className = { style.page6_trumpet } ></div>
						<div className = { style.page6_food } ></div>
					</div>
				</div>
			</div>
		)
	}
});

export default MusicPage6RenderComponent;
