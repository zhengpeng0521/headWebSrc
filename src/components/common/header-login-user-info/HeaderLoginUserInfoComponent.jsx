import React from 'react';
import styles from './HeaderLoginUserInfoComponent.less';
import {Menu, Dropdown, Icon} from 'antd';

function HeaderLoginUserInfoComponent ({
    userImg,userName,
    loginOut,
    updatePassword,
    ChangePassWord,         //修改密码点击事件
}) {
    let menu = (
        <Menu>
            <Menu.Item>
              <a href="javascript:void(0)" onClick={ChangePassWord}>修改密码</a>
            </Menu.Item>
            <Menu.Item>
              <a href={BASE_URL + '/logout/'} target="_self">注销</a>
            </Menu.Item>
        </Menu>
    );

    return (
        <div className={styles.header_login_user_cont} >
           <img src={userImg} className={styles.login_user_info_img} />
            <Dropdown overlay={menu}>
                <div className={styles.login_user_info}>
                    <a className={styles.login_uer_name_text}>{userName}</a>
                    <div className={styles.triangle_border_right}>
                        <span className={styles.triangle_border_right_span}></span>
                    </div>
                </div>
            </Dropdown>
        </div>
    );
}

export default HeaderLoginUserInfoComponent;
