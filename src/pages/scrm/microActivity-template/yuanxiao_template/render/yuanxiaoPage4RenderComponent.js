import React from 'react';

let YuanxiaoPage4RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design yuanxiao-page4-render-design">
				<div className="yuanxiao-page4-title">
					{ detailData ? detailData.title : "" }
				</div>
				<ul className="yuanxiao-page4-content">
					{
						detailData.img_intro.map(function(value , index){
							return (
								<li className="yuanxiao-page4-content-item">
									<img className="yuanxiao-page4-content-item-image" src={ (detailData && detailData.img_intro) ? detailData.img_intro[index].imgurl : ""} />
								</li>
							)
						})
					}
				</ul>
			</div>
		)
	}
});

export default YuanxiaoPage4RenderComponent;
