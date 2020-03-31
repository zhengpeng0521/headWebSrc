import React from 'react';
import style from './WOfficeSetRenderComponent.less';
import { Icon } from 'antd';

function WOfficeSetRenderComponent({

	dataSource,

}){
	let homeTab = {}, courseTab = {}, activityTab = {}, gameTab = {}, otherTab = {}, busnessRange = {}, ageRange = {}, orgIntro = {}, orgFaculty = {}, orgFacility = {}, orgAlbum = {};
	dataSource && dataSource.map(function(item, index){
		if( item.name == 'homeTab' ){
			homeTab = item
		}
		if( item.name == 'courseTab' ){
			courseTab = item
		}
		if( item.name == 'activityTab' ){
			activityTab = item
		}
		if( item.name == 'gameTab' ){
			gameTab = item
		}
		if( item.name == 'otherTab' ){
			otherTab = item
		}
		if( item.name == 'ageRange' ){
			ageRange = item
		}
		if( item.name == 'busnessRange'){
			busnessRange = item
		}
		if( item.name == 'orgAlbum' ){
			orgAlbum = item
		}
		if( item.name == 'orgIntro' ){
			orgIntro = item
		}
		if( item.name == 'orgFaculty' ){
			orgFaculty = item
		}
		if( item.name == 'orgFacility' ){
			orgFacility = item
		}
	});
    return (
        <div className = 'render_page' >
            <div className = 'render_page_wrap' >
                <div className = 'render_page_content' >
                    <div className = 'render_head' >
                        <div>
                            <img style = {{ width : '100%', height : '150px' }} src = '//img.ishanshan.com/gimg/img/0f17c9a62c82b5678c51c9326f89fcf1' />
                        </div>
						<div className = 'wOffice_head_wrap' >
							<ul className = 'wOffice_head' >
								{ !!homeTab.show && <li className = 'wOffice_head_item wOffice_head_item_first' >{ homeTab.title }</li> }
								{ !!courseTab.show && <li className = 'wOffice_head_item' >{ courseTab.title }</li> }
								{ !!activityTab.show && <li className = 'wOffice_head_item' >{ activityTab.title }</li> }
								{ !!gameTab.show && <li className = 'wOffice_head_item' >{ gameTab.title }</li> }
								{ !!otherTab.show && <li className = 'wOffice_head_item' >{ otherTab.title }</li> }
							</ul>
						</div>
                    </div>
                    <div className = 'wOffice_content_item'>
                        <div className = 'content_item_add'>
                            <Icon className = 'orgAdd_icon' type = 'address' />
                            浙江省杭州市滨江区
                        </div>
                        <div className = 'content_item_time'>
                            <Icon className = 'orgAdd_time' type = 'time' />
                            营业时间 : 早上9点~下午6点
                            <Icon className = 'orgAdd_phone' type = 'phone' />
                        </div>
                    </div>
                    {
                        !!busnessRange.show &&
                        <div className = 'wOffice_item'>
                            <div className = 'wOffice_content_item_title' >
                                <span>{ busnessRange.title }</span>
                            </div>
                            <div className = 'wOffice_item_buss' >
                                <span>启蒙类</span>
                                <span>创意类</span>
                            </div>
                        </div>
                    }
                    {
                        !!ageRange.show &&
                        <div className = 'wOffice_item'>
                            <div className = 'wOffice_content_item_title' >
                                <span>{ ageRange.title }</span>
                            </div>
                            <div className = 'wOffice_item_age'>
                                <span>0-8岁</span>
                            </div>
                        </div>
                    }
					{
						!!orgAlbum.show &&
						<div className = 'wOffice_item'>
                            <div className = 'wOffice_content_item_title' >
                                <span>{ orgAlbum.title }</span>
                            </div>
                            <div className = 'wOffice_content_item_orgAlbum'>
                                <div className = 'item_orgAlbum' >
									<img style = {{ width : '100%', height : '100%', borderRadius : '5px' }} src = '//img.ishanshan.com/gimg/img/8969c5914fe198ccd75b8bfb07cbe019' />
                                </div>
                                <div className = 'item_orgAlbum' >
									<img style = {{ width : '100%', height : '100%', borderRadius : '8px' }} src = '//img.ishanshan.com/gimg/img/8969c5914fe198ccd75b8bfb07cbe019' />
                                </div>
                            </div>
                        </div>
					}
                    {
                        !!orgIntro.show &&
                        <div className = 'wOffice_item'>
                            <div className = 'wOffice_content_item_title' >
                                <span>{ orgIntro.title }</span>
                            </div>
                            <div className = 'wOffice_item_intro'>
                                闪闪一站式早教管理云平台，帮助早教机构解决招生难、管理难等问题。
                            </div>
                        </div>
                    }
                    {
                        !!orgFaculty.show &&
                        <div className = 'wOffice_item'>
                            <div className = 'wOffice_content_item_title' >
                                <span>{ orgFaculty.title }</span>
                            </div>
                            <div className = 'wOffice_content_item_teach'>
                                <div className = 'item_teach' >
                                    <div className = 'teach_img' >
                                        <img style = {{ width : '100%', height : '100%', borderRadius : '5px' }} src = '//img.ishanshan.com/gimg/img/6d66dcead08aee1308f35a8e6a8fdc93' />
                                    </div>
                                    <div>
                                        <div style = {{ textAlign : 'center', fontSize : '14px' }}>peter</div>
                                        <div style = {{ color : '#999' }} >资深老师</div>
                                    </div>
                                </div>
                                <div className = 'item_teach' >
                                    <div className = 'teach_img' >
                                        <img style = {{ width : '100%', height : '100%', borderRadius : '8px' }} src = '//img.ishanshan.com/gimg/img/6d66dcead08aee1308f35a8e6a8fdc93' />
                                    </div>
                                    <div>
                                        <div style = {{ textAlign : 'center', fontSize : '14px' }}>connie</div>
                                        <div style = {{ color : '#999' }} >资深老师</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    {
                        !!orgFacility.show &&
                        <div className = 'wOffice_item'>
                            <div className = 'wOffice_content_item_title' >
                                <span>{ orgFacility.title }</span>
                            </div>
                            <div className = 'wOffice_item_base'>
                                <div className = 'wOffice_base_item' >
                                    <div className = 'base_background'>
                                        <Icon className = 'base_orgAdd_icon' type = 'Monitor' />
                                    </div>
                                    <div>TV</div>
                                </div>
                                <div className = 'wOffice_base_item' >
                                    <div className = 'base_background'>
                                        <Icon className = 'base_orgAdd_icon' type = 'babyroom' />
                                    </div>
                                    <div>母婴室</div>
                                </div>
                                <div className = 'wOffice_base_item' >
                                    <div className = 'base_background'>
                                        <Icon className = 'base_orgAdd_icon' type = 'coffee' />
                                    </div>
                                    <div>茶水间</div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default WOfficeSetRenderComponent;
