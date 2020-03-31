import React from 'react';

const ScoreStarsComponent =  React.createClass({

	render() {
		  var imgArr = [];
		  var remainingImgArr = [];
		  var remaining = 5 - parseInt(this.props.rater);
		  for (var i=0;i<parseInt(this.props.rater);i++){
			  imgArr.push(BASE_URL+'images/view-icon-pingfen-youse-12x11@3x.png')
		  }
		  for (var i=0;i<remaining;i++){
			  remainingImgArr.push(BASE_URL+'images/view-icon-pingfen-wuse-12x11@3x.png')
		  }

		  return (
				  <div>
					 <div>
						 {
						 	imgArr&&imgArr.map(function (item, index) {
						 		  return <div>
						 		  			<img src={item} style={{float : 'left', marginLeft: '7', marginTop: '10', width: '12', height: '11'}}/>
				                	  	 </div>
							})
						 }
					 </div>
					 <div>
					 {
						 remainingImgArr&&remainingImgArr.map(function (item, index) {
					 		  return <div>
					 		  			<img src={item} style={{float : 'left', marginLeft: '7', marginTop: '10', width: '12', height: '11'}}/>
			                	  	 </div>
						})
					 }
				 </div>
			 </div>
		  )
	  },
});

export default ScoreStarsComponent;
