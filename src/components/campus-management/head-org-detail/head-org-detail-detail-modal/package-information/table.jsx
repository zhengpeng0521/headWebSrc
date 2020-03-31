import React from 'react';
import { Popover , Button } from 'antd';
import { NullData , StatusFlag } from '../../../../common/new-component/NewComponent';
import styles from './table.less';
import thead from './thead.json';

//套餐信息tab
function Table({
    data,                       //列表内容
    OpenPackageModal,           //打开套餐编辑modal
}){

    //列表头部渲染
    let th = [];
    if(thead && thead.length > 0){
        th = thead.map((item,index) => (
            <div className = { styles.thead_item } key = { item.key } style = {{ width : item.width }}>
                <Popover placement = 'top' content = { item.value }>
                    { item.value }
                </Popover>
            </div>
        ))
    }

    //渲染列表信息
    let tr = [];
    if(data && data.length > 0){
        data && data.map((data_item,data_index) => {
            let tr_inner = [];
            //初始化行数据
            thead && thead.map((thead_item,thead_index) => {
                tr_inner.push(
                    <div className={styles.trow_item} key = { data_index + '_' + thead_index } style = {{ width : thead_item.width }}></div>
                )
            })
            //根据thead和所得数据渲染行数据
            thead && thead.map((thead_item,thead_index) => {
                tr_inner.splice(thead_index,1,
                    <div className={styles.trow_item} key = { data_index + '_' + thead_index } style = {{ width : thead_item.width }}>
                        { thead_item.key == 'status' ?
                            (!!data_item[thead_item.key] ?
                             <StatusFlag type = { data_item[thead_item.key] == '使用中' ? 'green' : data_item[thead_item.key] == '已过期' ? 'red' : data_item[thead_item.key] == '已失效' ? 'gray' : '' }>{ data_item[thead_item.key] }</StatusFlag> : null )
                             :
                            <Popover placement="top" content = { data_item[thead_item.key] } trigger="hover">
                                <div className={styles.trow_item_inner}>{ data_item[thead_item.key] }</div>
                            </Popover>
                        }
                    </div>)
            })
            tr.push(
                <div className={styles.trow} key = { data_index }>
                    { tr_inner || [] }
                </div>
            );
        })
    }else{
        tr = <NullData height = '200px' content = '暂时没有套餐信息'/>
    }

    return(
        <div className = { styles.all }>
            <div className = { styles.left_table }>
                <div className = { styles.thead }>{ th || [] }</div>
                <div className = { styles.trow_content }>
                    { tr || [] }
                </div>
            </div>
            <div className = { styles.right_button }>
                <Button type = 'primary' onClick = {() => OpenPackageModal('edit')} style = {{ float : 'right' }}>开通套餐</Button>
            </div>
        </div>
    )
}

export default Table;
