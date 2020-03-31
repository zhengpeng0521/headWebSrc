import React from 'react';
import styles from './ModuleShowComponent.less';
import MobileContent from './MobileContent';
import {moduleRenderParse} from '../../../../utils/module-util/microModuleRenderUtil';
import moment from 'moment';
import {Icon} from 'antd';
import {objListSort} from '../../../../utils/arrayUtils';

function ModuleShowComponent ({
    moduleConfigData, currentPageKey, pageConfig, activeItemKey,
    renderShowType, changeActiveItem,
    toPrevPage, toNextPage,
}) {

    function pageItemOnClick(itemKey) {
        changeActiveItem && changeActiveItem(currentPageKey, itemKey);
    }

    let items = (pageConfig && pageConfig.items) || [];
    let props = (pageConfig && pageConfig.props) || {};
    let bg_props = props.bg || {};

    let bgStyle = {
        position: 'relative',
    };
    if(bg_props.bg_img && bg_props.bg_img.length > 0) {
        bgStyle.background = 'url("' + bg_props.bg_img + '") 0% 0% / cover no-repeat';
        bgStyle.backgroundSize = '100% 100%';
    }

    if(bg_props.bg_color && bg_props.bg_color.length > 0) {
        bgStyle.backgroundColor = bg_props.bg_color;
    }

    let page_type = moduleConfigData && moduleConfigData.page_type;
    if(page_type == 'one') {
        bgStyle.overflowY = 'auto';
    } else {
        bgStyle.overflowY = 'hidden';
    }

    //分享设置相关
    let module_props = (moduleConfigData && moduleConfigData.props) || {};
    let share_config = (module_props && module_props.share) || {};
    let share_title = share_config.title || '';
    let share_intro = share_config.intro || '';
    let share_img_url = share_config.img_url || '';
    let share_max_title_word = share_config.max_title_word || 10;
    let share_max_intro_word = share_config.max_intro_word || 50;

    let all_page_count = 0, current_page_index = 0;
    let pages = (moduleConfigData && moduleConfigData.pages) || [];

    let sortPages = [];
    pages && pages.map(function(pageItem, pageIndex) {
        sortPages.push({
            page_key: pageItem.page_key,
            seq_no: pageItem.seq_no,
        });
    });

    sortPages = objListSort(sortPages, 'seq_no');
    sortPages && sortPages.map(function(item, index) {
        if(item.page_key == currentPageKey) {
            current_page_index = index + 1;
        }
    });
    all_page_count = pages.length;


    return (
        <MobileContent toPrevPage={toPrevPage} toNextPage={toNextPage} current_page_index={current_page_index} all_page_count={all_page_count} >

           {renderShowType == 'page' ?
            <div
               className={styles.module_building_cont}
               style={bgStyle}
            >
               {items && items.map(function(item, index) {
                    item.onClick = pageItemOnClick;
                    item.isActivity = item.item_key == activeItemKey;
                    return moduleRenderParse('3', item);
                })}
            </div>
            : renderShowType == 'share' ?
            <div className={styles.module_share_cont}>
                <div className={styles.current_time}>{moment().format('HH:mm')}</div>
                <div className={styles.share_render_content}>
                    <div className={styles.user_img}>
                        <img src='//img.ishanshan.com/gimg/img/193dc794235cf1187b9682c7f7eeb564' />
                    </div>

                    <div className={styles.share_intro_cont}>
                        <div className={styles.share_intro_text_cont}>
                            <div className={styles.share_title_text}>
                                {share_title}
                            </div>
                            <div className={styles.share_intro_text}>
                                {share_intro}
                            </div>
                        </div>
                        <div className={styles.share_config_img}>
                            <img src={share_img_url} />
                        </div>
                    </div>
                </div>
            </div>
            :
            null}

        </MobileContent>
    );
}

export default ModuleShowComponent;
