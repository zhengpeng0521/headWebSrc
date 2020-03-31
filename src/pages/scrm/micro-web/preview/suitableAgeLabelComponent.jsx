import React from 'react';

const SuitableAgeLabelComponent = React.createClass({

	render() {
    	let agedata = this.props.agedata;
        var tempAgeArr = agedata&&agedata.split(',');
		return(
			<div>
				<div className="clearance"></div>
				<div  className="suitableAgeLabel_div">
				<h4 className="suitableAgeLabel_TitleLabel">适合年龄</h4>
				{
        	                	tempAgeArr&&tempAgeArr.map(function (item, index) {
        	                		if (index >= 5) {

            	            	    		} else {
        		                    		return <div className="homepage_ageItem">
    	    		                    			<p className="homepage_ageItem_p"> {item} </p>
        	    		                    		</div>
            	            	    		}
        	                	})
				}
			</div>
		     </div>
		)
	}
})

export default SuitableAgeLabelComponent;
