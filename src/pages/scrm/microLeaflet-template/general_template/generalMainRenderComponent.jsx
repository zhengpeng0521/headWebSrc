import React from 'react';

let MainRenderComponent = React.createClass({
	getInitialState() {
		return {
			mainData : this.props.mainData || "",
		}
	},
	componentWillReceiveProps(nextProps) {
		this.setState({
			mainData : nextProps.mainData || ""
		})
	},
	render(){

		let { mainData } = this.state;
		return (
			<div className="main-page-render-design">
				<p className="main-page-title">{ mainData ? mainData.share_config.title : "" }</p>
				<div className="main-page-content">{ mainData ? mainData.share_config.intro : ""}</div>
				<img className="main-page-image" src={ mainData ? mainData.share_config.imgurl : ""} />
			</div>
		)
	}
});

export default MainRenderComponent;
