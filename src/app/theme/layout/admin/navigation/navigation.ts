import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'dashboard',
        title: 'Dashboard',
        type: 'item',
        url: '/dashboard',
        icon: 'feather icon-home',
        classes: 'nav-item'
      }
    ]
  },
  {
    id: 'ui-element',
    title: 'MANAGEMENT TIKETING',
    type: 'group',
    icon: 'icon-ui',
    children: [
      {
        id: 'basic',
        title: 'Tiketing',
        type: 'collapse',
        icon: 'feather icon-box',
        children: [
          {
            id: 'button',
            title: 'Wifi zone',
            type: 'item',
            url: '/basic/button'
          },
          {
            id: 'profile',
            title: 'Profile',
            type: 'item',
            url: '/basic/badges'
          },
          {
            id: 'breadcrumb-pagination',
            title: 'Mes tikets',
            type: 'item',
            url: '/basic/breadcrumb-paging'
          },
          {
            id: 'collapse',
            title: 'Recette',
            type: 'item',
            url: '/basic/collapse'
          },
          // {
          //   id: 'tabs-pills',
          //   title: 'Tabs & Pills',
          //   type: 'item',
          //   url: '/basic/tabs-pills'
          // },
          // {
          //   id: 'typography',
          //   title: 'Typography',
          //   type: 'item',
          //   url: '/basic/typography'
          // }
        ]
      }
    ]
  },
  {
    id: 'forms',
    title: 'Management router',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'manager-route',
        title: 'Manger router',
        type: 'collapse',
        icon: 'fa fa-server',
        children: [
          {
            id: 'one1',
            title: 'One1',
            type: 'item',
            url: '/forms/basic'
          },
          {
            id: 'one2',
            title: 'One2',
            type: 'item',
            url: '/forms/basic'
          },
        ]
      },
      {
        id: 'monitoring',
        title: 'Monitoring',
        type: 'collapse',
        icon: 'feather icon-pie-chart',
        children: [
          {
            id: 'monitoring1',
            title: 'Monitoring2',
            type: 'item',
            url: '/tables/bootstrap'
          },
          {
            id: 'monitoring2',
            title: 'Monitoring',
            type: 'item',
            url: '/tables/bootstrap'
          },
          {
            id: 'apexChart',
            title: 'Monitoring router',
            type: 'item',
            url: 'apexchart',
            // classes: 'nav-item',
            // icon: 'feather icon-pie-chart'
          }
        ]
      },
    ]
  },
  // {
  //   id: 'chart-maps',
  //   title: 'Chart',
  //   type: 'group',
  //   icon: 'icon-charts',
  //   children: [
  //     {
  //       id: 'apexChart',
  //       title: 'ApexChart',
  //       type: 'item',
  //       url: 'apexchart',
  //       classes: 'nav-item',
  //       icon: 'feather icon-pie-chart'
  //     }
  //   ]
  // },
  {
    id: 'comptablite',
    title: 'Comptabilite',
    type: 'group',
    icon: 'icon-pages',
    children: [
      {
        id: 'auth',
        title: 'Authentication',
        type: 'collapse',
        icon: 'feather icon-lock',
        children: [
          {
            id: 'signup',
            title: 'Sign up',
            type: 'item',
            url: '/auth/signup',
            target: true,
            breadcrumbs: false
          },
          {
            id: 'signin',
            title: 'Sign in',
            type: 'item',
            url: '/auth/signin',
            target: true,
            breadcrumbs: false
          },
          {
            id: 'sample-page',
            title: 'Sample Page',
            type: 'item',
            url: '/sample-page',
            classes: 'nav-item',
            icon: 'feather icon-sidebar'
          },
          {
            id: 'disabled-menu',
            title: 'Disabled Menu',
            type: 'item',
            url: 'javascript:',
            classes: 'nav-item disabled',
            icon: 'feather icon-power',
            external: true
          },
          {
            id: 'buy_now',
            title: 'Buy Now',
            type: 'item',
            icon: 'feather icon-book',
            classes: 'nav-item',
            url: 'https://codedthemes.com/item/datta-able-angular/',
            target: true,
            external: true
          }
        ]
      }
    ]
  }
];

@Injectable()
export class NavigationItem {
  get() {
    return NavigationItems;
  }
}
