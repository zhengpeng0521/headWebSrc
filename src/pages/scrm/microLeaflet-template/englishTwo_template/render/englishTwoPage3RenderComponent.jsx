import React from 'react';
import style from '../englishTwo_template.less';

let EnglishTwoPage2RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;

		return (
			<div className = 'page-render-design english_two_page3_render english_two_answer' >
				<div className = { style.english_two_title } >
					<p>
						{ detailData ? detailData.title : "" }
					</p>
				</div>
				{
					!!detailData && detailData.answers.length > 0 && detailData.answers.map(function( item, index){
						let delay = 0.5 * ( index + 1 );
						return (
							<div key = { 'select_item' + index } className = { style.select_item } style = {{ animationDelay : delay + 's' }} >
							 	{ item.text || '' }
							</div>
						)
					})
				}
				<div className = 'background_2'></div>
			</div>
		)
	}
});

export default EnglishTwoPage2RenderComponent;
