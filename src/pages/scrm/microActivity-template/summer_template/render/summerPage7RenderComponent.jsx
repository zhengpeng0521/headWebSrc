import React from 'react';

let SummerPage7RenderComponent = React.createClass({
	getInitialState() {
		return {

		}
	},
	render(){
		let { detailData } = this.props;
		let seagulls = (
			<animateMotion dur = "6s" repeatCount = "indefinite" rotate = "auto" >
			   <mpath xlinkHref = "#theMotionPath" />
			</animateMotion>
		)
		return (
			<div className="page-render-design summer-page7-render">
				<div className="summer_title">{ detailData ? detailData.title : ""}</div>
				<div className="summer_subTitle">
					<div>
						{ detailData ? detailData.subTitle : "" }
					</div>
				</div>
				<p className = "name">学员姓名</p>
				<p className = "phone">联系电话</p>
				<p className = "birthday">学员生日</p>
				<p className = 'btn' >提交</p>
				<svg
					width = { 326 }
					height = { 250 }
					viewBox =  '0 0 177.625 187.719'
					version = "1.1"
		    		xmlns = "http://www.w3.org/2000/svg"
					xmlnsXlink = "http://www.w3.org/1999/xlink"
					style = {{ position : "relative" }}
				>
					<path 	d = "M4.875,113.906 C4.875,113.906 20.875,167.906 75.875,153.906 C93.875,148.906 94.875,107.906 144.875,86.906 C190.875,73.906 182.875,6.906 141.875,1.906 C100.875,-3.094 -20.125,37.906 4.875,113.906 Z"
							stroke = "lightgrey"
							strokeWidth = "0"
							fill = "none"
							id = "theMotionPath"/>

							<path fill="#FFFFFF" d="M16.5,11.5c0,0-2.6-6.2-1.4-8.2c1.2-2-4.6-0.7-12.8,0.7c0,0,10.9,0.2,12.3,8.4l-2.4,1.1l3.3,3.5l0.2-3.6
		c0,0,8.6-1.2,11.1,9.1c0,0,1.1-6.6-3.1-12.8C23.8,9.7,19.3,12.7,16.5,11.5z">
								{seagulls}
							</path>
							<path d="M11.3,2.5c0,0-5.9,1-8.9,1.5c0,0,5.9,0.9,7.2,1.9l-0.8-1l0.7-0.2L9.1,4.2C9.1,4.2,9.2,3.3,11.3,2.5z">
								{seagulls}
							</path>
							<path d="M22.8,15.5c0,0,3.5,3.1,4.1,7c0,0,0.7-3.6-1-8.5l-0.3,1L25,14.2l0.1,0.8L24,14.3l0.1,1.1L22.8,15.5z">
								{seagulls}
							</path>
				</svg>
			</div>
		)
	}
});

export default SummerPage7RenderComponent;
