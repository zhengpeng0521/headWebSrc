import React from 'react';
import { Popover , Rate } from 'antd';
import { NullData , ProgressBar } from '../../../../../common/new-component/NewComponent';
import thead from './TeacherComment.json';
import styles from './TeacherComment.less';

/*老师评价tab页*/
function TeacherComment({
    teacherCommentLoading,                  //老师评价tab页是否是加载状态
    teacherCommentMsg,                      //老师评价列表数据

    OpenCommentEditModal,                   //打开老师评价编辑modal
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
    if(!!teacherCommentMsg && teacherCommentMsg.length > 0){
        tr = teacherCommentMsg.map((out_item,out_index) => {
            let tr_inner = [];
            for(let i in thead){
                if(i != thead.length - 1){
                    tr_inner.push(
                        <div className={styles.trow_item} key = { i } style = {{ width : thead[i].width }}>
                            <Popover placement="top" content='--' trigger="hover">--</Popover>
                        </div>
                    )
                }else{
                    tr_inner.push(
                        <div className={styles.trow_item} key = { i } style = {{ width : thead[i].width }}>
                            <a>编辑</a>
                        </div>
                    )
                }
            }
            if(out_item){
                for(let i in thead){
                    switch(thead[i].key){
                        case 'score' : tr_inner.splice(i,1,
                            <div className={styles.trow_item} key = { i } style = {{ width : thead[i].width }}>
                                <Rate disabled value = { out_item[thead[i].key] || '0' }/>
                            </div>) ; break;
                        case 'pic_num' : tr_inner.splice(i,1,
                            <div className={styles.trow_item} key = { i } style = {{ width : thead[i].width }}>
                                共{ out_item[thead[i].key] }张
                            </div>) ; break;
                        case 'operation' : tr_inner.splice(i,1,
                            <div className={styles.trow_item} key = { i } style = {{ width : thead[i].width }}>
                                <a onClick = {() => OpenCommentEditModal(out_item)}>编辑</a>
                            </div>) ; break;
                        default : tr_inner.splice(i,1,
                            <div className={styles.trow_item} key = { i } style = {{ width : thead[i].width }}>
                                <Popover placement = "top" content = { out_item[thead[i].key] } trigger = "hover">
                                    { out_item[thead[i].key] || '--' }
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
            { !teacherCommentLoading ? tr : <ProgressBar/> }
        </div>
    );
}

export default TeacherComment;
