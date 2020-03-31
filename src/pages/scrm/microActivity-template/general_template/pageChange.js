import React from 'react';
import { Button , Icon } from 'antd';


let PageChange = React.createClass({
	getInitialState() {
		return {
			currentPage : "1",
			hasPrev : this.props.hasPrev,
			hasNext : this.props.hasNext,
			detailData : this.props.detailData,
			pageTotal : this.props.pageTotal

		}
	},
	componentWillReceiveProps(nextProps) {
		this.setState({
			detailData : nextProps.detailData || '',
			hasPrev : nextProps.hasPrev,
			hasNext : nextProps.hasNext,
			pageTotal : nextProps.pageTotal
		})
	},
	//前一页
	onPrev(){
		let seqNo = this.state.detailData.seqNo;
		this.props.onPrev(seqNo);
	},
	//后一页
	onNext(){
		let seqNo = this.state.detailData.seqNo;
		this.props.onNext(seqNo);
	},
	render(){
		let seqNo = this.state.detailData.seqNo;
		return (
			<div className="page-change">
				<Button className="page-prev" size="large" onClick={ this.onPrev } disabled = { this.state.hasPrev }><Icon type="left" /></Button>
				<div className="page-current">{ seqNo }/{ this.state.pageTotal }</div>
				<Button className="page-next" size="large" onClick={ this.onNext } disabled = { this.state.hasNext }><Icon type="right" /></Button>
			</div>
		)
	}
});

export default PageChange;
