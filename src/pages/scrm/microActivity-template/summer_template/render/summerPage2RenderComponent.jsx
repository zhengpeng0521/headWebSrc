import React from 'react';

let SummerPage2RenderComponent = React.createClass({

	render(){

		let { detailData } = this.props;
		let contentArr1 = detailData && detailData.content.split('\n');
		let contentArr2 = detailData && detailData.content2.split('\n');
		return (
			<div className = "page-render-design summer-page2-render" >
				<div className = "summer_title">{ detailData ? detailData.title : "" }</div>
				<div className = "summer_title2">{ detailData ? detailData.title2 : "" }</div>
				<div  className = "summer_content">
					<div className = 'content'>
						{
							contentArr1.map( function( item, index){
								return (
									<div className = "summer_content_item">
										&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ item || '' }
									</div>
								)
							})
						}
					</div>
				</div>
				<div  className = "summer_content2">
					<div className = 'content'>
						{
							contentArr2.map( function(item, index){
								return (
									<div className = "summer_content_item">
										&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{ item || '' }
									</div>
								)
							})
						}
					</div>
				</div>
			</div>
		)
	}
});

export default SummerPage2RenderComponent;
