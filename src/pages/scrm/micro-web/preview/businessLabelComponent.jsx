import React from 'react';

const BusinessLabelComponent = React.createClass({

	render() {
	let business = this.props.business;
        var tempArr = business&&business.split(',');
		return(
			<div>
				<div className="clearance"></div>
				<div style={{height : '60'}}>
					<h4 className="business_TitleLabel" >业务范围</h4>
					{
			        	tempArr&&tempArr.map(function (item, index) {
			        		if (index >= 5) {

        			    	    	} else {
        			                	return <div className="item">
        				                  	 <p className="homepage_Business_p">{item}</p>
        				                  	</div>
        			    	    	}
			        	})
				}
				</div>
			</div>
		)
	}
})

export default BusinessLabelComponent;
