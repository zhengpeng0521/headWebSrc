import React from 'react';
import style from './WxCourseCreateFormRender.less';
import { Icon } from 'antd';

function WxCourseCreateFormRender({
    courseRenderParams
}){
    let adAgeRender = [];
    let courseTypeRender = [];
    let adAge = courseRenderParams.adAge.split(',')
    let courseType = courseRenderParams.courseType.split(',');
    courseRenderParams.dict && courseRenderParams.dict.agetag.map(function(item, index){
        adAge && adAge.map(function(d_item,index){
            if( item.value == d_item ){
                adAgeRender.push( item.label )
            }
        })
    });
    courseRenderParams.dict && courseRenderParams.dict.organcategory.map(function(item, index){
        courseType && courseType.map(function(d_item, index){
            if( item.value == d_item ){
                courseTypeRender.push( item.label )
            }
        })
    });
    let courseContentComponents = [];
    courseRenderParams.courseContent && courseRenderParams.courseContent.map(function( item, index ){
        let contentDetailComponents = [];
        item && item.content && item.content.length > 0 && item.content.map(function( d_item, d_index ){
            contentDetailComponents.push(
                <div key = { 'render_course_detail' + index + '_' + d_index } className = 'detail_item_content' >
                    { d_item.contentDetail || '' }
                </div>
            )
        })
        courseContentComponents.push(
            <div key = { 'render_course_' + index } className = 'detail_content_item'>
                <div className = 'detail_item_title'>{ item.title || '' }</div>
                { contentDetailComponents }
            </div>
        )
    });
    return (
        <div className = 'render_page' >
            <div className = 'render_page_wrap' >
                <div className = 'render_page_content' >
                    <div className = 'content_head'>
                        <div style = {{ width : '100%', height : '150px', backgroundImage : `url(${courseRenderParams.detailCover})`, backgroundSize : 'cover', backgroundPosition : 'center' }} >
                        </div>
                        <div className = { style.course_title } >
                            <span>{ courseRenderParams && courseRenderParams.name || '课程名称' }</span>
                        </div>
                    </div>
                    <div className = 'orgId' >
                        <div className = 'orgName' >
                            <span className = 'name'>所属校区</span>
                            <span className = 'more' >查看更多 ></span>
                        </div>
                        <div className = 'orgAdd'>
                            <Icon className = 'orgAdd_icon' type = 'address' />
                            <span className = 'orgAdd_add' >校区地址</span>
                            <Icon className = 'orgAdd_icon_phone' type = 'phone' />
                        </div>
                    </div>
                    <div className = 'detail'>
                        <div className = { style.course_title } >
                            <span>课程详情</span>
                        </div>
                        <div className = 'detail_content' >
                            <div className = 'detail_content_item'>
                                <div className = 'detail_item_title'>课程类型</div>
                                <div className = 'detail_item_content' >
                                    { courseTypeRender && courseTypeRender.join(',') || ''  }
                                </div>
                            </div>
                            <div className = 'detail_content_item'>
                                <div className = 'detail_item_title'>适用年龄</div>
                                <div className = 'detail_item_content' >
                                    { adAgeRender && adAgeRender.join(',') || ''  }
                                </div>
                            </div>
                            <div className = 'detail_content_item'>
                                <div className = 'detail_item_title'>每节时长</div>
                                <div className = 'detail_item_content' >
                                    { courseRenderParams && courseRenderParams.perTime }
                                </div>
                            </div>
                            { courseContentComponents }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WxCourseCreateFormRender;
