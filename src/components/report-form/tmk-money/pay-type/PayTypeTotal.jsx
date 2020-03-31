import React from 'react'
import styles from './PayTypeTop.less';

function PayTypeTotal({
  totalProjects,
  totalData
}){
  return (
    <div className = { styles.report_form_top_total }>
      <ul className = { styles.report_form_top_total_title }>
        <li>统计类型</li>
        <li>业绩金额</li>
        <li>其他收入</li>
        <li>支出合计</li>
        <li>净现金流</li>
        {totalProjects && totalProjects.length > 0 ? totalProjects.map((item, index) => {
          return (
            <li key={'title'+index}>{item.projectName}</li>
          )
        }) : null}

      </ul>
      <ul className = { styles.report_form_top_total_date }>
        <li>总计</li>
        <li>{totalData.countPurchaseMoney}</li>
        <li>{totalData.countIncomeMoney}</li>
        <li>{totalData.countSpendMoney}</li>
        <li>{totalData.countMoney}</li>
        {totalProjects && totalProjects.length > 0 ? totalProjects.map((item, index) => {
          return (
            <li key={'value'+index}>{item.spendItemMoney || '0'}</li>
          )
        }) : null}

      </ul>
    </div>
  )
}

export default PayTypeTotal
