import React from 'react';
import {Button} from 'antd';

const BusinessLabelComponent 	= require('./businessLabelComponent');
const SuitableAgeLabelComponent = require('./suitableAgeLabelComponent');
const InstitutionsInfoComponent = require('./institutionsInfoComponent');
const FacilitiesLabelComponent  = require('./facilitiesLabelComponent');
const MapAndTimeComponent 	= require('./mapAndTimeComponent');

const VipAgencyInfo_homePage = React.createClass({

	render() {
		var subData 	= this.props.homeData;
		var blocksDic	= JSON.parse(subData.cfgIntro != null && subData.cfgIntro);
		return (
				<div style={{background : 'white'}}>
					{blocksDic.blocks&&blocksDic.blocks.indexOf('dzsj') >= 0 ? <MapAndTimeComponent subData={subData} /> : ''}

					{blocksDic.blocks&&blocksDic.blocks.indexOf('ywfw') >= 0 ? <BusinessLabelComponent business={subData.categoryTagCn} /> : ''}

					{blocksDic.blocks&&blocksDic.blocks.indexOf('shnl') >= 0 ? <SuitableAgeLabelComponent agedata={subData.ageTagCn} /> : ''}

					{blocksDic.blocks&&blocksDic.blocks.indexOf('jgjs') >= 0 ? <InstitutionsInfoComponent textData={subData.intro} /> : ''}

					{blocksDic.blocks&&blocksDic.blocks.indexOf('jgss') >= 0 ? <FacilitiesLabelComponent data={subData.utilityTagList} /> : ''}
				</div>
		)
	},
});

export default VipAgencyInfo_homePage;


/**
 *
 */
