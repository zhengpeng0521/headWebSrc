import React from 'react';

let EnglishTwoPage6RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className = 'page-render-design english_two_page6_render' >
				<div className = 'english_two_title'>
					{ !!detailData && detailData.title || '' }
				</div>
				<div className = 'english_two_content' >
					<p>
						{ !!detailData && detailData.content || '' }
					</p>
				</div>
				<div className = 'robot'></div>
			</div>
		)
	}
});

export default EnglishTwoPage6RenderComponent;
