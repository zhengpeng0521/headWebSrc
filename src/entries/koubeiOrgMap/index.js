import './index.html';
import dva from 'dva';
import '../../utils/request';
import '../index/index.css';
import '../../assets/iconfont/iconfont.css';
import {message} from 'antd';

window.BASE_URL = window.BASE_URL||'/saas-web';

import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

message.config({
  duration: 3,
});

// 1. Initialize
const app = dva();

// 2. Model
app.model(require('../../models/koubei-org-map/tenantLoginModel'));     //口碑门店绑定 - 租户登陆
app.model(require('../../models/koubei-org-map/orgMapModel'));          //口碑门店绑定 - 门店绑定

// 3. Router
app.router(require('./router'));

// 4. Start
app.start('#root');
