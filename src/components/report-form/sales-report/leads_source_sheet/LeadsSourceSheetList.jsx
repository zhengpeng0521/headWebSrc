import React from 'react';
import { Popover } from 'antd';
import { NullData , ProgressBar } from '../../../common/new-component/NewComponent';
import Media from 'react-media';
import thead from './thead.json';
import styles from './LeadsSourceSheetList.less';

/*名单来源表*/
function LeadsSourceSheetList({
    sheetLoading,               //报表加载状态
    sheetData,                  //报表数据
}){

    let th = [];
    if(thead && thead.length > 0){
        th = thead.map((item,index) => {
            return(
                <div key = { index } style={{ width : `calc(100%/${thead.length})` , lineHeight : '50px' }}>
                    <Popover placement="top" content={ item.name } trigger="hover">{ item.name }</Popover>
                </div>
            );
        })
    }

    let trow = [];
    if(sheetData && sheetData.length > 0){
        trow = sheetData.map((channel_type,channel_index) => {
            let trowType = [];
            if(channel_type.items && channel_type.items.length > 0){
                trowType = channel_type.items.map((trow_type,trow_index) => {
                    let content = [];
                    for(let i = 0 ; i < 5 ; i++){
                        content.push(
                            <div key = { i }><Popover placement="top" content='--' trigger="hover">--</Popover></div>
                        )
                    }
                    for(let i in thead){
                        for(let j in trow_type){
                            if(j == thead[i].id){
                                content.splice(thead[i].index,1,<div key = { i }><Popover placement="top" content={trow_type[j]} trigger="hover">{trow_type[j]}</Popover></div>)
                                break;
                            }
                        }
                    }
                    return(
                        <div
                            key = {'trow_type_' + trow_index}
                            style = {{
                                height : 50,
                                width : '100%'
                            }}
                            className={styles.trow_type}>
                            { content || [] }
                        </div>
                    );
                })
            }
            return(
                <div className={styles.channel} key={'channel_type_' + channel_index}>
                    <div style={{
                        height : channel_type.items && channel_type.items.length > 0 ? `${channel_type.items.length * 50}px` : 50 ,
                        lineHeight : channel_type.items && channel_type.items.length > 0 ? `${channel_type.items.length * 50}px` : '50px' ,
                        width : `calc(100%/${thead.length})` }}>
                        <Popover placement="top" content={channel_type.name} trigger="hover">
                            { channel_type.channelName }
                        </Popover>
                    </div>
                    <div className={styles.trow_type_array} style = {{ width : `calc(100% - 100%/${thead.length})` }}>
                        { trowType || [] }
                    </div>
                </div>
            );
        })
    }else{
        trow = <NullData/>
    }

    return(
        <Media query="(max-width: 1650px)">
            { matches => matches ?
                <div className={styles.all}>
                    <div className={styles.table}>
                        <div className={styles.thead}>
                            { th || [] }
                        </div>
                        { !sheetLoading ?
                            trow
                            :
                            <ProgressBar content = '统计中'/>
                        }
                    </div>
                </div>
                :
                <div className={styles.all} style={{ padding : '0 20px' }}>
                    <div className={styles.table}>
                        <div className={styles.thead}>
                            { th || [] }
                        </div>
                        { !sheetLoading ?
                            trow
                            :
                            <ProgressBar content = '统计中'/>
                        }
                    </div>
                </div>
            }
        </Media>
    );
}

export default LeadsSourceSheetList;
