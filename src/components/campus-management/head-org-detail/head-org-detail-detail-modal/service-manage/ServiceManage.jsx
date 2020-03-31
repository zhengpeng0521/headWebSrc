import React from 'react';
import { Popover , Switch } from 'antd';
import { NullData , StatusFlag } from '../../../../common/new-component/NewComponent';
import thead from './ServiceManage.json';
import styles from './ServiceManage.less';

//服务管理
function ServiceManage({
    data,
    switchOnChange,
    coursewareSet, //课件可见人设置
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
            thead && thead.map((thead_item,thead_index) => {
                tr_inner.push(
                    <div className={styles.trow_item} key = { data_index + '_' + thead_index } style = {{ width : thead_item.width }}></div>
                )
            })
            thead && thead.map((thead_item,thead_index) => {
                tr_inner.splice(thead_index,1,
                    <div className={styles.trow_item} key = { data_index + '_' + thead_index } style = {{ width : thead_item.width }}>
                        {
                          thead_item.key == 'confValue' ?
                            <div className = 'head_org_detail_service_manage_switch'>
                                <Switch checked = { data_item[thead_item.key] == '1' ? true : false } size = 'small' onChange = {(e) => switchOnChange (data_item,e,'confValue')}/>
                            </div>
                        :thead_item.key == 'print' ?
                            <div className = 'head_org_detail_service_manage_switch'>
                                <Switch checked = { data_item[thead_item.key] == '1' ? true : false } size = 'small' onChange = {(e) => switchOnChange (data_item,e,'print')}/>
                            </div>
                        :thead_item.key == 'secondValue' ?
                            <div style={{textAlign:'center'}}>
                                  <Popover placement="top" content = { data_item[thead_item.key] } trigger="hover">
                                        <p>{ data_item[thead_item.key] || '全部' }</p>
                                  </Popover>
                                  <p><a onClick = { ()=>coursewareSet() }>设置</a></p>
                            </div>
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
        tr = <NullData height = '200px'/>
    }

    return(
        <div className = { styles.all }>
            <div className = { styles.thead }>{ th || [] }</div>
            <div className = { styles.trow_content }>
                { tr || [] }
            </div>
        </div>
    )
}

export default ServiceManage;
