import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import styles from './ModulePagePrev.less';
import {moduleRenderParse} from '../../../../utils/module-util/microModuleRenderUtil';
import {Icon} from 'antd';

const ItemTypes = {
    CARD: 'card',
};

const pageSource = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index,
        };
    },

    endDrag(props, monitor) {
        props.endDrag && props.endDrag();
    },
};

const pageTarget = {
    hover(props, monitor, component) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Determine rectangle on screen
        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

        // Determine mouse position
        const clientOffset = monitor.getClientOffset();

        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return;
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return;
        }

        // Time to actually perform the action
        props.movePage(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    },
};

const style = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
};

let loodRender = data => data.map(function(dateItem, dateIndex) {
    return (
        <div key={'loop_item_'+dateIndex}>
            {moduleRenderParse('2', dateItem)}
        </div>
    );
});

@DropTarget(ItemTypes.CARD, pageTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
}))
@DragSource(ItemTypes.CARD, pageSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
}))
export default class PageDragItem extends Component {

    static propTypes = {
        connectDragSource: PropTypes.func.isRequired,
        connectDropTarget: PropTypes.func.isRequired,
        index: PropTypes.any.isRequired,
        isDragging: PropTypes.bool.isRequired,
        id: PropTypes.any.isRequired,
        page: PropTypes.object.isRequired,
        movePage: PropTypes.func.isRequired,
    };

    componentWillReceiveProps(nextProps){
        if(!this.props.isDragging && nextProps.isDragging) {
            this.props.beginDrag && this.props.beginDrag();
        }
    }

    render() {
        let {
            isDragging, connectDragSource, connectDropTarget,
            dragging,//自定义控制的拖拽状态
            index, page, currentPageKey, all_page_size, seqNo,
            copyPage, deletePage, changeActivePage, pageType,
        } = this.props;

        let isActive = currentPageKey == page.page_key;
        let data = page.items;

        let props = page.props || {};
        let bg =    props.bg || {};

        let page_bg_img = bg.bg_img || '';
        let page_bg_color = bg.bg_color || '';

        let bgStyle = {};
        if(page_bg_img && page_bg_img.length > 0) {
            bgStyle.background = 'url(' + page_bg_img + ') no-repeat';
            bgStyle.backgroundSize = 'cover';
        }

        if(page_bg_color && page_bg_color.length > 0) {
            bgStyle.backgroundColor = page_bg_color;
        }

        let page_prev_item_style = {
            top: 152 * seqNo,
        };

        return connectDragSource(connectDropTarget(
            <div
                key={'page_prev_item_' + page.page_key}
                style={page_prev_item_style}
                id={page.page_key}
                className={isDragging ? styles.page_prev_item_drag : isActive ? styles.page_prev_item_active : styles.page_prev_item} >
                <div className={styles.item_prev_cont}
                     style={{
                                transform:'scale(0.12, 0.095)',
                                transformOrigin: 'left top',
                                width: '750px',
                                height: '1206px',
                                ...bgStyle
                            }}
                     onClick={()=>changeActivePage(page.page_key)}>

                    {(page.items.length >0)?
                        (loodRender(data))
                        :
                        <div></div>
                    }
                </div>
                <div className={styles.item_bar}>
                    <div className={styles.page_item_name} title={'第' + (seqNo + 1) + '个页面'}>
                        {seqNo + 1} / {all_page_size}
                    </div>

                    {!!(!dragging && pageType == 'many') &&
                        <div className={styles.page_item_bar} >
                            <Icon type="copy" className={styles.page_item_bar_item} title="复制" onClick={()=>copyPage(page.page_key)} />
                            <Icon type="delete" className={styles.page_item_bar_item} title="删除" onClick={()=>deletePage(page.page_key)} />
                        </div>
                    }

                </div>
            </div>
        ));
    }
}