import React, { Component } from 'react';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import PageDragItem from './PageDragItem';

@DragDropContext(HTML5Backend)
export default class PageDragContainer extends Component {
    constructor(props) {
        super(props);
        this.movePage = this.movePage.bind(this);
        this.state = {
            pages: this.props.pages || [],
        };
    }

    movePage(dragIndex, hoverIndex) {
        const { pages } = this.state;
        const dragPage = pages[dragIndex];

        let state = update(this.state, {
            pages: {
                $splice: [
                    [dragIndex, 1],
                    [hoverIndex, 0, dragPage],
                ],
            },
        });

        let currentPages = state.pages;

        currentPages && currentPages.map(function(item, index) {
            item.seq_no = index;
        });

        this.setState({
            pages: currentPages
        });
    }

    componentWillReceiveProps(nextProps){

        if(this.props.pages.length == 0 && nextProps.pages.length > 0) {
            this.setState({
                pages: nextProps.pages
            });
        }

        if(!this.props.dragging && nextProps.dragging != undefined && !nextProps.dragging) {
            this.setState({
                pages: nextProps.pages
            });
        }

        if(this.props.dragging && nextProps.dragging != undefined && !nextProps.dragging) {

            let currentPages = this.state.pages;

            currentPages && currentPages.map(function(item, index) {
                item.seq_no = index;
            });

            this.props.updatePagesSort && this.props.updatePagesSort(currentPages);
        }

    }

    render() {
        let { pages} = this.state;

        let {
            all_page_size, currentPageKey, copyPage, deletePage, changeActivePage, dragging, beginDrag, endDrag, pageType,
        } = this.props;

        let commonProps = {
            all_page_size, currentPageKey, copyPage, deletePage, changeActivePage, dragging, beginDrag, endDrag, pageType,
        };

        return (
            <div >
                {pages.map((page, i) => (
                    <PageDragItem
                        key={page.page_key}
                        index={i}
                        id={page.index}
                        seqNo={i}
                        page={page}
                        movePage={this.movePage}
                        {...commonProps}
                    />
                ))}
            </div>
        );
    }

}