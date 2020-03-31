import React from 'react'
import styles from './RefundTotal.less';

function RefundTotal({
  total
}){

  let columns = [
    {label: '业绩金额', key: 'dicmoney'},
    {label: '退费前业绩', key: 'dicmoneyBefore'},
    {label: '退费人数', key: 'refundsStu'},
    {label: '退费合同数', key: 'refundsPurchase'},
    {label: '退费金额', key: 'refunds'},
    {label: '退费业绩占比', key: 'dicmoneyRate'},
  ]

  return (
    <div className = { styles.report_form_top_total }>
      <ul className = { styles.report_form_top_total_title }>
        <li>统计类型</li>
        {columns.map((item, index) => {
          return (
            <li key={'title'+index}>{item.label}</li>
          )
        })}
      </ul>
      <ul className = { styles.report_form_top_total_date }>
        <li>总计</li>
        {columns.map((item, index) => {
          return (
            <li key={'value'+index}>{total[item.key] || '0'}</li>
          )
        })}
      </ul>
    </div>
  )
}

export default RefundTotal
