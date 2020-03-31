import React from 'react';

let ChristmasPage4RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design page4-render-design">
				<div className="page4-title">
					{ detailData ? detailData.title : "" }
				</div>
				<ul className="page4-content">
					{
						detailData.img_intro.map(function(value , index){
							return (
								<li className="page4-content-item">
									<img className="page4-content-item-image" src={ (detailData && detailData.img_intro) ? detailData.img_intro[index].imgurl : ""} />
								</li>
							)
						})
					}
				</ul>
			</div>
		)
	}
});

export default ChristmasPage4RenderComponent;
