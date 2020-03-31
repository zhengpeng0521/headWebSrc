import React from 'react';
import styles from './SubordinateFilterComponent.less';
import {Dropdown,Menu,Icon} from 'antd';
let SubMenu = Menu.SubMenu;
let MenuItem = Menu.Item;

/*
 * currentUserId    当前登陆用户编号
 * subordinates     当前登陆用户的下属编号
 * selectSubordinate    当前选中的下属
 * subordinateChange    下属选择变更事件
 * SubordinateType       类型 如学员，订单，合同
 */
function SubordinateFilterComponent ({subordinates,selectSubordinate,subordinateChange,SubordinateType}) {
    var titelstr= "我的下属";
    if (SubordinateType) {
        titelstr = "我下属的"+ SubordinateType;
    }
    let menu = (
        <Menu onSelect={(item)=>subordinateChange(item.key)} >
            {!!false && <MenuItem key="all">{'全部' +SubordinateType}</MenuItem>}
            <MenuItem key="my">{'我的' +SubordinateType }</MenuItem>
            <SubMenu title={<span style = {{ marginRight : '12px', position : 'relative', top : '-1px' }}>{titelstr}</span>}>
                <MenuItem key="all_sub" disabled={subordinates.length == 0}>{'全部下属' + SubordinateType}</MenuItem>
                {subordinates && subordinates.length > 0 && subordinates.map(function(item) {
                    return (
                        <MenuItem key={item.id}>{item.name +SubordinateType}</MenuItem>
                    );
                })}
            </SubMenu>
        </Menu>
    );

    let selectSubordinateText = '其他';
    var string= ' ';
    if(selectSubordinate == 'all') {
        selectSubordinateText = '全部' +SubordinateType ;
        string =(<span>{selectSubordinateText}</span>);
    } else if(selectSubordinate == 'my') {
        selectSubordinateText =  '我的'+SubordinateType;
        string =(<span>{selectSubordinateText}</span>);
    } else if(selectSubordinate == 'all_sub') {
        selectSubordinateText = '全部下属'+SubordinateType;
        string =selectSubordinateText;
    } else {
        subordinates && subordinates.length > 0 && subordinates.map(function(item) {
            if(item.id == selectSubordinate) {
                selectSubordinateText = item.name +SubordinateType;
                string =selectSubordinateText;
            }
        })
    }

    return (
        <div className={styles.subordinate_filter_cont} >
            <Dropdown overlay = { menu } >
                <a className="ant-dropdown-link" href="javascript:void(0)" >
					<span style = {{ marginRight : '6px' }}>
                    	{string}
					</span>
					<Icon type = "caret-down" style = {{ marginRight : '20px' }}/>
                </a>
            </Dropdown>
        </div>
    );
}

export default SubordinateFilterComponent;
