import React from 'react';

let ChristmasPage1RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		return (
			<div className="page-render-design english-page1-render-design">
				<div className = "english-page1-head-img">
					<img className = "english-page1-head-img-content" src = { detailData ? detailData.head_imgUrl : "" } />
				</div>
				<div className = "english-page1-title">
					{ detailData ? detailData.title : "" }
				</div>
				<div className = "english-page1-subTitle">
					{ detailData ? detailData.sub_title : "" }
				</div>
				<div className = "english-page1-code-img">
					<img className = "english-page1-code-img-content" src = { detailData ? detailData.code_imgUrl : "" } />
				</div>
				<span className = "english-page1-contact-title">联系方式</span>
				<div className="english-page1-contact">
					{
						detailData.contact.map(function(value , index){
							return (
								<div className="english-page2-contact-item">
									<div className="english-page2-contact-item-label">
										{detailData ? detailData.contact[index].label : ""}
									</div>
									<div className="english-page2-contact-item-value">
										{detailData ? detailData.contact[index].value : ""}
									</div>
								</div>
							)
						})
					}
				</div>
			</div>
		)
	}
});

export default ChristmasPage1RenderComponent;
