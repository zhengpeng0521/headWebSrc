import React from 'react';
import { Carousel, Icon } from 'antd';
import moment from 'moment';
import styles from './WxActivityPhoneReview.less'

const boyImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEMxQTQxM0U5MjhCMTFFN0JFN0NCMTVERTFBMDg2NDYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NEJDNzhDNEE5MjkwMTFFN0JFN0NCMTVERTFBMDg2NDYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4QzFBNDEzQzkyOEIxMUU3QkU3Q0IxNURFMUEwODY0NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4QzFBNDEzRDkyOEIxMUU3QkU3Q0IxNURFMUEwODY0NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuKwQR8AABCTSURBVHja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';
const grilImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NEJDNzhDNEQ5MjkwMTFFN0JFN0NCMTVERTFBMDg2NDYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NEJDNzhDNEU5MjkwMTFFN0JFN0NCMTVERTFBMDg2NDYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0QkM3OEM0QjkyOTAxMUU3QkU3Q0IxNURFMUEwODY0NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0QkM3OEM0QzkyOTAxMUU3QkU3Q0IxNURFMUEwODY0NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PskTCSMAABGxSURBVHja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';
const placeholderImage = 'data:image/jpeg;base64,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';
function WxActivityPhoneReview({

    dataSource,

}) {

    let data = dataSource || {};

    //数据处理
    let params = {};

    if (data.form_activity_time && data.form_activity_time.length) {
        let m = data.form_activity_time;
        params.activityStartTime   = moment(m[0]).format('YYYY-MM-DD HH:mm:ss');
        params.activityEndTime  = moment(m[1]).format('YYYY-MM-DD HH:mm:ss');
    }

    if (data.form_activity_apply_time && data.form_activity_apply_time.length) {
        let m = data.form_activity_apply_time;
        params.applyStartTime   = moment(m[0]).format('YYYY-MM-DD HH:mm:ss');
        params.applyEndTime     = moment(m[1]).format('YYYY-MM-DD HH:mm:ss');
    }

    //分享图片
    if (data.form_activity_share_pic && data.form_activity_share_pic.length) {
        let d = data.form_activity_share_pic[0].response;
        params.activityShare = d && d.data.url || '';
    }
    if (data.form_activity_cover && data.form_activity_cover.length) {
        let d = data.form_activity_cover[0].response;
        params.activityCover = d && d.data.url || '';
    }
    
    if (data.form_activity_banner && data.form_activity_banner.length) {
        let bannerArr = [];
        data.form_activity_banner.map((item, index) => {
            if (item.response && item.response.errorCode === '9000' || item.response && item.response.errorCode === 9000) {
                bannerArr.push(item.response && item.response.data.url);
            } else {
                bannerArr.push(item.url);
            }
        })
        params.activityBanner = bannerArr.join(',');
    }

    params.name             = data.form_activity_name                   || data.name;
    params.activityContent  = data.html                                 || data.html;
    params.sort             = data.form_activity_sort                   || data.sort ;
    params.address          = data.form_activity_address                || data.address ;
    params.targetPeople     = data.form_activity_target_people          || data.target ;
    params.materialFee      = data.form_activity_material_fee           || data.materialFee ;
    params.applyType        = data.form_activity_apply_type             || data.applyType ;
    params.classCus         = data.form_activity_apply_class_cus        || data.classCus ;
    params.activityType     = data.form_activity_activity_type          || data.activityType ;
    params.vipSet           = data.form_activity_vip_set                || data.vipSet ;
    params.number           = data.form_activity_number                 || data.number ;
    params.enablePay        = data.form_activity_money_set              || data.enablePay ;
    params.payAmount        = data.form_activity_money_number           || data.payAmount ;
    params.shareInfo        = data.form_activity_share_intro            || data.shareInfo ;
    params.waiting          = data.form_activity_waiting_list           || data.waiting ;
    params.participate      = data.form_activity_participate_list       || data.participate ;    
    
    let bannerArr = params.activityBanner && params.activityBanner.split(',');

    //设置HTML展示    
    let html_content = document.getElementsByClassName('DraftEditor-editorContainer');

    if (html_content.length > 0) {
        html_content = html_content && html_content[0].outerHTML;
    } else {
        html_content = '';
    }

    function closeHTMLEdit(value) {
    //     let _eArr = document.getElementsByClassName('htmlStyle');
    //     if (_eArr && _eArr.length > 0) {
    //         let _element = document.getElementsByClassName('public-DraftEditor-content');
    //         if (_element && _element.length > 0) {
    //             _element[0].setAttribute('contenteditable', 'false');
    //         }
    //     }
    }

    return(
        <div className="baseReview">
            <div className={styles.phoneBackground}>
                <div className="actualContent">
                    {
                        bannerArr && bannerArr.length > 0 ? 
                            <Carousel autoplay>
                                {
                                    bannerArr && bannerArr.map((item, index) => {
                                        return <div key={index} className={styles.bannerBase} style={{backgroundImage : `url(${item || ''})`}}></div>
                                    })
                                }
                            </Carousel>
                            : 
                            <div className={styles.bannerBase} style={{ backgroundImage: `url(${placeholderImage})` }}></div>
                    }
                    
                    <p className={styles.actName}>
                        <span className={styles.vipMark}>{params.activityType == '1' ? `[会员专属] ` : ''}</span>
                        {params.name || '活动名称'}
                    </p>
                    <p className={styles.subTitle}>距报名结束：1天20小时20分</p>
                    <div className={styles.clearance}></div>
                    <div className={styles.addressBase}>
                        <p className={styles.address}>
                            <span><Icon type='address' className={styles.generalIconStyle}/> </span>校区地址
                        </p>
                        <p className={styles.addressPhone}> <Icon type='phonenew' /> </p>
                    </div>
                    <div className={styles.setOption}>
                        <p className={styles.actLabel}>
                            <span><Icon type='Shape' className={styles.generalIconStyle} /> </span>所属校区：{window._current_user_info && window._current_user_info.orgName || ''}
                        </p>
                        <p className={styles.actLabel}>
                            <span>
                                <Icon type='location' className={styles.generalIconStyle} />
                            </span>
                            活动地址：{params.address || '获取失败'}
                        </p>
                        <p className={styles.actLabel}>
                            <span>
                                <Icon type='time1' className={styles.generalIconStyle} />
                            </span>
                            活动时间：{params.activityStartTime || ''} 至 {params.activityEndTime || ''}
                        </p>
                        {
                            params.number ? 
                                <p className={styles.actLabel}>  
                                    <span><Icon type='peoplenew' className={styles.generalIconStyle} /> </span>活动人数：{params.number || '0'}人
                                </p>
                                : ''
                        }
                        {
                            params.payAmount ?
                                <p className={styles.actLabel}>
                                    <span><Icon type='moneynew' className={styles.generalIconStyle} /> </span>活动费用：{params.payAmount || '0'}元
                                </p>
                                : ''
                        }
                        {
                            params.targetPeople ?
                                <p className={styles.actLabel}>
                                    <span><Icon type='duixiangnew' className={styles.generalIconStyle} /> </span>活动对象：{params.targetPeople || ''}
                                </p>
                                : ''
                        }
                    </div>
                    {params.activityContent ? <div className={styles.clearance}></div> : ''}
                    {params.activityContent ? <p className={styles.contentTitle}>活动内容</p> : ''}
                    {params.activityContent ? <div className="htmlStyle" onClick={() => closeHTMLEdit()} dangerouslySetInnerHTML={{ __html: html_content || (params.activityContent || '') }} contentEditable={false}></div> : ''}                    
                    {params.participate == '1' ? <div className={styles.clearance}></div> : ''}
                    {params.participate == '1' ? <p className={styles.contentTitle}>已报名<span className={styles.applyNumber}>10</span>人</p> : ''}
                    {params.participate == '1' ?
                        <div className={styles.userHeaderBase}>
                            {
                                [1,2,3,4,5,6,7,8,9,10].map((item, index) => {
                                    return  <div className={styles.userDiv} key={index}>
                                        <div className={styles.userHeader} style={{ backgroundImage: `url(${parseInt(Math.random() * 10) % 2 == 0 ? grilImage : boyImage})` }}></div>
                                                <p className={styles.userName}>宝宝</p>
                                            </div>
                                })
                            }
                        </div>
                     : ''}
                    {params.waiting == '1' ? <div className={styles.clearance}></div> : ''}
                    {params.waiting == '1' ? <p className={styles.contentTitle}>已等位<span className={styles.applyNumber}>10</span>人</p> : ''}
                    {params.waiting == '1' ?
                        <div className={styles.userHeaderBase}>
                            {
                                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => {
                                    return <div className={styles.userDiv} key={index}>
                                        <div className={styles.userHeader} style={{ backgroundImage: `url(${parseInt(Math.random() * 10) % 2 == 0 ? grilImage : boyImage})` }}></div>
                                        <p className={styles.userName}>宝宝</p>
                                    </div>
                                })
                            }
                        </div>
                        : ''
                    }
                    <div className={styles.createActivityButton}>我也要创建活动</div>
                    <div className={styles.bottomTabbar}>
                        <p className={styles.createActivity}><Icon type='jianew' className={styles.addIconStyle} />创建活动</p>
                        <p className={styles.applyActivity}>我要报名</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
 
export default WxActivityPhoneReview;
