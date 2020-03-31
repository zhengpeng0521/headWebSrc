import React from 'react';

const FacilitiesLabelComponent = React.createClass({

	render() {
		var business 	= this.props.data;
		var count		= business&&business.length;
		var yuNumber 	= count % 5;	//余数
		var row			= (count - yuNumber) / 5; //几行
		var rowheight;
		if(row == 0 && yuNumber != 0) { //有余数没行数
			rowheight = 200;
		} else if(row != 0) {  			//至少有一行
			if(yuNumber != 0) {  		//有余数在加一行
				if (row + 1 == 2) {
					rowheight = (row+1) * 135
				} else if(row + 1 ==4) {
					rowheight = (row+1) * 102
				} else {
					rowheight = (row+1) * 110
				}
			} else { 					//没有余数直接行数*单行高度
				if(row > 1 && row < 3) {
					rowheight = row * 135;
				} else if(row >= 3) {
					rowheight = row * 115;
				} else {
					rowheight = row * 195;
				}
			}
		} else {
			rowheight = 120;
		}

		return(
			<div className="facilities_h4_div"style={{background : 'white', height : rowheight}}>
				<div className="clearance"></div>
				<h4 className="facilities_h4">机构设施</h4>
        	              {
        	              	business&&business.map(function (item, index) {
        	              	    var name = 'utility'+item.dictValue;

        	                  	if(index == business.length - 1) {
        	                  		  return <div className="homepage_Item_facilities" key={item.id}>
        					                <div className={name}></div>
        				                        <p className="homepage_Item_facilities_p">{item.dictName}</p>
        				                 </div>
        	                  	} else {
        	                  		  return <div className="homepage_Item_facilities">
        	                  		  		<div className={name}></div>
        				                        <p className="homepage_Item_facilities_p">{item.dictName}</p>
        				                  </div>
        	                  	}
        	                  })
        	              }
		     </div>
		)
	}
})

export default FacilitiesLabelComponent;
