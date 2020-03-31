import React, {PropTypes} from 'react';
import styles from './ModulePagePrev.less';
import {objListSort} from '../../../../utils/arrayUtils';
import PageDragContainer from './PageDragContainer';

/*
 * 模板编辑页面-H5显示框架
 */
function ModulePagePrev({
    moduleConfigData, currentPageKey, changeActivePage, updatePagesSort,
    copyPage, deletePage, prevDraging, prevBeginDrag, prevEndDrag,
}) {

    /*格式化模板的页面*/
    function parsePages(moduleConfigData) {
        let pages = [];
        if(moduleConfigData && moduleConfigData.pages && moduleConfigData.pages.length > 0) {
            pages = moduleConfigData.pages;
        }

        let sortPages = [];
        pages && pages.length > 0 && pages.map(function(pageItem) {
            sortPages.push(pageItem);
        });

        return objListSort(sortPages, 'seq_no');
    }

    let pages = moduleConfigData.pages || [];

    let newPages = parsePages(moduleConfigData);

    let all_page_size = (newPages && newPages.length) || 0;

    let containerProps = {
        pages: newPages, pageType: moduleConfigData.page_type || '',
        dragging: prevDraging, beginDrag: prevBeginDrag, endDrag: prevEndDrag,
        all_page_size,
        updatePagesSort,
        currentPageKey, changeActivePage, copyPage, deletePage,
    };

    return (
        <div className={styles.page_prev_cont} >

           <div className={styles.page_item_list} >

               <PageDragContainer {...containerProps} />

            </div>

        </div>
    );
}

export default ModulePagePrev;
