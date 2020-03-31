import React from 'react';
import { Button , Form , Input , Select , DatePicker , message , Icon , Spin , Popconfirm } from 'antd';
import { StatusFlag , NullData } from '../../../common/new-component/NewComponent';
import styles from './FollowRecordList.less';
const Option = Select.Option;

/*跟进记录*/
function FollowRecordList({
    leadsFollowFollowRecordContentLoading,  //当前跟进记录loading状态
    leadsFollowFollowRecordContent,         //当前leads跟进记录list
    leadsFollowFollowRecordScrollFinish,    //滚动加载是否完成(即数据加载完毕)

    LeadsFollowFollowRecordScrollBottom,    //leads跟进记录已经滑动到最底部
    // LeadsFollowFollowRecordEditItem,        //leads跟进记录编辑
    LeadsFollowFollowRecordDeleteItem,      //leads跟进记录删除
}){

    let followRecord = [];
    if(leadsFollowFollowRecordContent && leadsFollowFollowRecordContent.length > 0){
        followRecord = leadsFollowFollowRecordContent.map((item,index) => {
            return(
                <div className={styles.follow_record_list_item} key = { index }>
                    <div className={styles.follow_record_list_item_title}>
                        <p><span>跟进时间：</span><span>{ item.createTime || '--' }</span></p>
                        <p><span>跟进方式：</span><span>{ item.type || '--' }</span></p>
                    </div>
                    <div className={styles.follow_record_list_item_content}>
                        <div className={styles.follow_record_list_item_img}>
                            <img src='https://img.ishanshan.com/gimg/img/e51c6060b326c9cf12ddb4f1c4e12443' width='60px' height='60px'/>
                        </div>
                        <div className={styles.follow_record_list_item_name}>
                            <StatusFlag>{ item.stuName || '--' }</StatusFlag>
                        </div>
                        <div className={styles.follow_record_list_item_parent}>
                            跟进家长：{ item.parentName || '--' }
                        </div>
                        <div className={styles.follow_record_list_item_operation}>
                            {/*<span onClick = {() => LeadsFollowFollowRecordEditItem(item)}>编辑</span>*/}
                            <Popconfirm placement="left" title='确定删除吗' okText="是" cancelText="否" onConfirm={() => LeadsFollowFollowRecordDeleteItem(item.id)} >
                                <span>删除</span>
                            </Popconfirm>
                        </div>
                        {/*超过110个字显示省略号*/}
                        <div className={styles.follow_record_list_item_intro}>

                            { item.content && item.content.length > 110 ? item.content.substr(0,110) + '...' : item.content }
                        </div>
                    </div>
                </div>
            );
        })
    }

    return(
        <div className={styles.leads_follow_record_inner_list}>
            <Spin spinning = { leadsFollowFollowRecordContentLoading }>
                { followRecord || [] }
                { followRecord.length == 0 ?
                    <NullData height = '200px' content = '没有更多了'/>
                    :
                  leadsFollowFollowRecordScrollFinish ?
                    <div className={styles.leads_follow_record_inner_bottom}>
                        <span>没有更多了</span>
                    </div>
                    :
                    <div className={styles.leads_follow_record_inner_bottom}>
                        <Icon type="loading" style={{fontSize:'2rem'}}/>
                        <span>加载中...</span>
                    </div>
                }
            </Spin>
        </div>
    );
}

export default FollowRecordList;
