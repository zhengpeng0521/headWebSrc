import React from 'react';

let EnglishTwoPage5RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className = 'page-render-design english_two_page5_render' >
				<div className = 'english_two_content' >
					<p>
						{ !!detailData && detailData.title || '' }
					</p>
				</div>
				<div className = 'robot'></div>
			</div>
		)
	}
});

export default EnglishTwoPage5RenderComponent;
