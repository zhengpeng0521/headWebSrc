import './index.html';
import dva from 'dva';
import 'antd/dist/antd.min.css';
import '../../utils/request';
import './index.css';
import '../../assets/iconfont/iconfont.css';
import { message } from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

message.config({
  duration: 3,
});

// 1. Initialize
const app = dva();

// 2. Model
app.model(require('../../models/saasRegisteredH5Model/registeredH5Model'));

// 3. Router
app.router(require('./router'));

// 4. Start
app.start('#saasH5Registered');
