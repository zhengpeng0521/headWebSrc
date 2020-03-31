import React from 'react';
import style from './WxActivityCreateFormRender.less';
import { Icon } from 'antd';

function WxActivityCreateFormRender({
    wxActivityRenderParams
}){
    let activityContentComponents = [];
    wxActivityRenderParams.activityContent && wxActivityRenderParams.activityContent.map(function( item, index ){
        let contentDetailComponents = [];
        item && item.content && item.content.length > 0 && item.content.map(function( d_item, d_index ){
            contentDetailComponents.push(
                <div key = { 'wx_activity_cotent_' + index + '_' + d_index } className = 'detail_item_content' >
                    { d_item.contentDetail || '' }
                </div>
            )
        })
        activityContentComponents.push(
            <div key = { 'wx_activity_' + index } className = 'detail_content_item'>
                <div className = 'detail_item_title'>{ item.title || '' }</div>
                { contentDetailComponents }
            </div>
        )
    })
    return (
        <div className = 'render_page' >
            <div className = 'render_page_wrap' >
                <div className = 'render_page_content' >
                    <div className = 'content_head'>
                        <div style = {{ width : '100%', height : '150px', backgroundImage : `url(${wxActivityRenderParams.detailCover})`, backgroundSize : 'cover', backgroundPosition : 'center' }}>
                        </div>
                        <div className = 'content_head_title'>
                            <div className = 'head_title' >
                                <div className = 'title' >
                                    <div className = 'title_c'>{ wxActivityRenderParams.name || '活动名称' }<span style = {{ display : wxActivityRenderParams.activityType == '1' ? 'inline' : 'none' }} >&nbsp;&nbsp;(会员专属)</span></div>
                                </div>
                                <div className = 'applying'>报名中</div>
                            </div>
                            <div className = 'time' >
                                距离报名结束还有 : 1天20小时20分
                            </div>
                        </div>
                    </div>
                    <div className = 'orgId' >
                        <div className = 'orgName' >
                            <span className = 'name'>所属校区</span>
                            <span className = 'more' >查看更多></span>
                        </div>
                        <div className = 'orgAdd'>
                            <Icon className = 'orgAdd_icon' type = 'address' />
                            <span className = 'orgAdd_add' >校区地址</span>
                            <Icon className = 'orgAdd_icon_phone' type = 'phone' />

                        </div>
                    </div>
                    <div className = 'detail'>
                        <div className = 'title' >
                            <b>活动详情</b>
                        </div>
                        <div className = 'detail_content' >
                            <div className = 'detail_content_item'>
                                <div className = 'detail_item_title'>活动时间</div>
                                <div className = 'detail_item_content' >
                                    { wxActivityRenderParams.startTime || '活动开始时间' }
                                    ~
                                    { wxActivityRenderParams.endTime || '活动结束时间' }
                                </div>
                            </div>
                            <div className = 'detail_content_item'>
                                <div className = 'detail_item_title'>活动地点</div>
                                <div className = 'detail_item_content' >
                                    { wxActivityRenderParams.address || '活动地点' }
                                </div>
                            </div>
                            <div className = 'detail_content_item'>
                                <div className = 'detail_item_title'>活动人数</div>
                                <div className = 'detail_item_content' >
                                    { wxActivityRenderParams.number || '人数' }
                                </div>
                            </div>
                            <div className = 'detail_content_item'>
                                <div className = 'detail_item_title'>活动收费</div>
                                <div className = 'detail_item_content' >
                                </div>
                            </div>
                            <div className = 'detail_content_item'>
                                <div className = 'detail_item_title'>活动对象</div>
                                <div className = 'detail_item_content' >
                                    { wxActivityRenderParams.targetPeople || '活动对象' }
                                </div>
                            </div>
                            { activityContentComponents }
                        </div>
                    </div>
                    <div className = 'success' >
                        <div className = 'title' >
                            <b>已报名用户(3)</b>
                        </div>
                        <ul className = 'applyedUser'>
                            <li className = 'applyedUser_item' >
                                <img className = 'applyedUser_item_img' src = '//img.ishanshan.com/gimg/img/300f433150bdfe4c13fa0e137efce725' />
                                <div style = {{ textAlign : 'center' }} >宝宝</div>
                            </li>
                            <li className = 'applyedUser_item' >
                                <img className = 'applyedUser_item_img' src = '//img.ishanshan.com/gimg/img/85148fc80751d0efcf809ddab826ca11' />
                                <div style = {{ textAlign : 'center' }} >宝宝</div>
                            </li>
                            <li className = 'applyedUser_item' >
                                <img className = 'applyedUser_item_img' src = '//img.ishanshan.com/gimg/img/300f433150bdfe4c13fa0e137efce725' />
                                <div style = {{ textAlign : 'center' }} >宝宝</div>
                            </li>
                        </ul>
                    </div>
                    <div className = 'success' >
                        <div className = 'title' >
                            <b>等待用户(2)</b>
                        </div>
                        <ul className = 'applyedUser'>
                            <li className = 'applyedUser_item' >
                                <img className = 'applyedUser_item_img' src = '//img.ishanshan.com/gimg/img/300f433150bdfe4c13fa0e137efce725' />
                                <div style = {{ textAlign : 'center' }} >宝宝</div>
                            </li>
                            <li className = 'applyedUser_item' >
                                <img className = 'applyedUser_item_img' src = '//img.ishanshan.com/gimg/img/85148fc80751d0efcf809ddab826ca11' />
                                <div style = {{ textAlign : 'center' }} >宝宝</div>
                            </li>
                        </ul>
                    </div>
                    <div style = {{ width : '100%', height : '45px' }}></div>
                </div>
            </div>
            <div className = 'apply_soon'>立即报名</div>
        </div>
    )
}

export default WxActivityCreateFormRender;
