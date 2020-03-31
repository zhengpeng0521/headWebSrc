import React from 'react';
import { Popover , Rate } from 'antd';
import { NullData , ProgressBar } from '../../../../common/new-component/NewComponent';
import thead from './ParentComment.json';
import styles from './ParentComment.less';

/*家长评价tab页*/
function ParentComment({
    parentCommentLoading,                   //家长评价tab页是否是加载状态
    parentCommentMsg,                       //家长评价列表数据
}){

    let th = [];
    if(thead && thead.length > 0){
        th = thead.map((item,index) => (
            <div className = { styles.thead_item } key = { item.key } style = {{ width : item.width }}>
                { item.value }
            </div>
        ))
    }

    let tr = [];
    if(!!parentCommentMsg && parentCommentMsg.length > 0){
        tr = parentCommentMsg.map((out_item,out_index) => {
            let tr_inner = [];
            for(let i in thead){
                tr_inner.push(
                    <div className={styles.trow_item} key = { i } style = {{ width : `${100/thead.length}%` }}>
                        <Popover placement="top" content='--' trigger="hover">--</Popover>
                    </div>
                )
            }
            if(out_item){
                for(let i in thead){
                    switch(thead[i].key){
                        case 'score' : tr_inner.splice(i,1,
                            <div className={styles.trow_item} key = { i } style = {{ width : thead[i].width }}>
                                <Rate disabled value = { out_item[thead[i].key] }/>
                            </div>) ; break;
                        default : tr_inner.splice(i,1,
                            <div className={styles.trow_item} key = { i } style = {{ width : thead[i].width }}>
                                <Popover placement = "top" content = { out_item[thead[i].key] } trigger = "hover">
                                    { out_item[thead[i].key] }
                                </Popover>
                            </div>)
                    }
                }
            }
            return(
                <div className={styles.trow} key = { out_index }>
                    { tr_inner || [] }
                </div>
            );
        })
    }else{
        tr = <NullData height = '200px'/>
    }

    return(
        <div className = { styles.all }>
            <div className = { styles.thead }>
                { th || [] }
            </div>
            { !parentCommentLoading ? tr : <ProgressBar/> }
        </div>
    );
}

export default ParentComment;
