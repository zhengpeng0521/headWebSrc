import React from 'react';

const MapAndTimeComponent = React.createClass({

	render() {

		return(
			<div style={{background : 'white'}}>
				<div className="homepage_linDiv_top" ></div>
				<div >
					<div className="dingwei"/>
					<p className="mapAndTime_p" >&nbsp;&nbsp;{this.props.subData.addr}</p>
					<hr className="homepage_hr" />
				</div>

				<div className="mapAndTime_div" >
					<div className="shijian"/>
					<p className="mapAndTime_p1">&nbsp;&nbsp;营业时间:{this.props.subData.serverTime}</p>
				</div>
		     </div>
		)
	}
})

export default MapAndTimeComponent;
