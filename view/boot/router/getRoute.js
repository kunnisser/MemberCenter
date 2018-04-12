import App from '../../App';
import Index from '../../pages/index/index';
import Manor from '../../../stage/index';
import NoFound from '../../pages/noFound/pageLoss';
import Uc from '../../pages/usercenter/uc';
import UcIndex from '../../pages/usercenter/uc/index';
import EditInfo from '../../pages/usercenter/editeinfo/editeInfo';
import MyScore from '../../pages/usercenter/uc/score/myScore';
import ScoreDetail from '../../pages/usercenter/uc/score/scoreDetail';
import MyCard from '../../pages/usercenter/uc/card/myCard';
import CardDetail from '../../pages/usercenter/uc/card/cardDetail';
import MyPrize from '../../pages/usercenter/uc/prize/myPrize';
import MyOrder from '../../pages/usercenter/uc/order/myOrder';
import MyZone from '../../pages/usercenter/uc/zone/myZone';
import MyTravelNoteDetail from '../../pages/usercenter/uc/zone/myTravelNote/travelNoteDetail';
import EditComments from '../../pages/usercenter/uc/zone/editComments/editComments';
import MyPhotos from '../../pages/usercenter/uc/zone/myPhotos/myPhotos';
import EditTravelNote from '../../pages/usercenter/uc/zone/editTravelNote/editTravelNote';
import MyInteraction from '../../pages/usercenter/uc/interaction/myInteraction';
import MyComments from '../../pages/usercenter/uc/interaction/comments/myComments';
import MemberDay from '../../pages/memberday/memberDay';
import MemberMall from '../../pages/membermall/memberMall';
import MallIndex from '../../pages/membermall/index/mallIndex';
import GoodsDetail from '../../pages/membermall/detail/goodsDetail';
import GenerateOrder from '../../pages/membermall/generateOrder/generateOrder';
import PaySuccess from '../../pages/membermall/pay/paySuccess';
import Zone from '../../pages/memberzone/zone';
import Lottery from '../../pages/lottery/lottery';

const proPath = [
  {
  // 一级路由配置
  path: '/',
  component: App,
  // 相关子路由配置
  children: [
    // 二级路由为空重定向到首页
    {
      path: '',
      redirect: '/home'
    },
    // 定义首页
    {
      path: '/home',
      component: Index
    },
    // 囧囧庄园
    {
      path: '/manor',
      component: Manor
    },
    // 抽奖
    {
      path: '/lottery',
      component: Lottery
    },
    // 会员中心
    {
      path: '/uc',
      component: Uc,
      children: [
        {
          path: '',
          redirect: '/uc/index'
        },
        {
          path: '/uc/index',
          component: UcIndex
        },
        {
          path: '/uc/edit',
          component: EditInfo
        },
        {
          path: '/uc/myscore',
          component: MyScore
        },
        {
          path: '/uc/scoredetail',
          component: ScoreDetail
        },
        {
          path: '/uc/mycard',
          component: MyCard
        },
        {
          path: '/uc/carddetail',
          component: CardDetail
        },
        {
          path: '/uc/myprize',
          component: MyPrize
        },
        {
          path: '/uc/myorder',
          component: MyOrder
        },
        {
          path: '/uc/myzone',
          component: MyZone
        },
        {
          path: '/uc/tndetail',
          component: MyTravelNoteDetail
        },
        {
          path: '/uc/editcomments',
          component: EditComments
        },
        {
          path: '/uc/myphotos',
          component: MyPhotos
        },
        {
          path: '/uc/edittravelnote',
          component: EditTravelNote
        },
        {
          path: '/uc/myinteraction',
          component: MyInteraction
        },
        {
          path: '/uc/mycomments',
          component: MyComments
        }
      ]
    },
    // 会员日
    {
      path: '/md',
      component: MemberDay
    },
    // 商城
    {
      path: '/mall',
      component: MemberMall,
      children: [
        {
          path: '',
          redirect: '/mall/index'
        },
        {
          path: '/mall/index',
          component: MallIndex
        },
        {
          path: '/mall/detail',
          component: GoodsDetail
        },
        {
          path: '/mall/generateorder',
          component: GenerateOrder
        },
        {
          path: '/mall/paysuccess',
          component: PaySuccess
        }
      ]
    },
    // 会员社区
    {
      path: '/zone',
      component: Zone
    }
   ]
  },
  // 无匹配路由重定向到404
  {
    path: '*',
    component: NoFound
  }
];

export default proPath;
