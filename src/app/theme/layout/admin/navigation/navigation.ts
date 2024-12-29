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
            url: '/tiketting/wifizone'
          },
          {
            id: 'profile',
            title: 'Profile',
            type: 'item',
            url: '/tiketting/profile'
          },
          {
            id: 'breadcrumb-pagination',
            title: 'Mes tikets',
            type: 'item',
            url: '/tiketting/tikets'
          },
          {
            id: 'collapse',
            title: 'Recette',
            type: 'item',
            url: '/tiketting/recette'
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
    id: 'Management',
    title: 'Management profile',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'Profile',
        title: 'Profile',
        type: 'collapse',
        icon: 'fa fa-server',
        children: [
          {
            id: 'profile',
            title: 'Profile',
            type: 'item',
            url: '/user/profile'
          },
          {
            id: 'settings',
            title: 'Settings',
            type: 'item',
            url: '/user/settings'
          }
        ]
      },
      {
        id: 'Administration',
        title: 'admin',
        type: 'collapse',
        icon: 'feather icon-pie-chart',
        children: [
          {
            id: 'wifizones',
            title: 'Wifizones',
            type: 'item',
            url: '/admin/wifizones'
          },
          {
            id: 'profiles',
            title: 'Profiles',
            type: 'item',
            url: '/admin/profiles'
          },
          {
            id: 'tikets',
            title: 'Tikets',
            type: 'item',
            url: 'apexchart',
          },
          {
            id: 'users',
            title: 'Users',
            type: 'item',
            url: '/admin/users'
          }
        ]
      },
    ]
  },
  {
    id: 'faq',
    title: 'Answers questions',
    type: 'group',
    icon: 'icon-pages',
    children: [
      {
        id: 'faq',
        title: 'FAQ',
        type: 'item',
        // url: '/faq',
        url: '/sample-page',
        icon: 'feather icon-home',
        classes: 'nav-item'
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
