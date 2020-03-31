import React from 'react'
import { Popover } from 'antd'
import { NullData } from '../common/new-component/NewComponent'
import styles from './TmkHome.less'

const TmkHome = ({
  funnelList,         //漏斗数据
  tmkData,            //表格数据
}) => {
  const table = [
    { value: '待分配名单', key: 'notAllotClueNum' },
    { value: '已跟进名单', key: 'followedNum' },
    { value: '预约到访客户', key: 'bookArriveNum' },
    { value: '实际到访客户', key: 'arriveNum' },
    { value: '签约客户', key: 'signingNum' },
    { value: '退回TMK公海池', key: 'recycleClueNum' },
    { value: '待跟进名单', key: 'unFollowNum' },
    { value: '预约试听客户', key: 'subscribeAuditionNum' },
    { value: '实际试听客户', key: 'auditionNum' },
    { value: '签约金额', key: 'signingMoney' }
  ]

  return (
    <div className={styles.tmk_container}>
      <h3>数据总览</h3>

      <div className={styles.tmk_box}>
        <div className={styles.sale_funnel}>
          <div className={styles.sale_funnel_box}>
            {funnelList && funnelList.length > 0 ? funnelList.map((item, index) => (
              <div
                key={`funnel${index}`}
                className={styles.sale_funnel_flex}
              >
                <div className={styles.sale_funnel_one} />
                <div className={styles.sale_funnel_line} />
                <div>
                  <Popover
                    placement="right"
                    content={item.name || '未跟进'}
                  >
                    <span className={styles.funnel_tip_text}>{ item.name || '未跟进' }</span>
                  </Popover>
                  <span>{ item.num || '0' }人</span>
                </div>
              </div>
            )) : <NullData />}
          </div>
        </div>

        <div className={styles.tmk_table}>
          <ul className={styles.tmk_table_list}>
            {table && table.map((col, key) => (
              <li key={`tmkTable${key}`}>
                <div>{col.value}</div>
                <div>{tmkData[col.key] || '0'}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default TmkHome
