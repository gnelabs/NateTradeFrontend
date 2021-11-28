
const navMenu = {
  items: [
    {
      name: 'Home',
      url: '/',
      icon: 'fa fa-home',
      attributes: { exact: true },
    },
    {
      name: 'About | Contact',
      url: '/about',
      icon: 'fa fa-address-book-o',
      attributes: { exact: true },
    },
    {
      divider: true,
      class: 'm-2'
    },
    {
      name: 'HFT Strategies',
      icon: 'fa fa-wpexplorer',
      itemAttr: {
        id: 'drop-1',
        title: true
      },
      children: [
        {
          name: 'DOPE Sight',
          url: '/indev',
          badge: {
            variant: 'primary',
            text: 'In Dev',
          },
          attributes: { exact: true },
        },
      ],
    },
    {
      name: 'Arbitrage Strategies',
      icon: 'fa fa-money',
      itemAttr: {
        id: 'drop-1',
        title: true
      },
      children: [
        {
          name: 'Divvy Arbs',
          url: '/divvyarb',
          attributes: { exact: true },
        },
        {
          name: 'Borrow Arbs',
          url: '/borrowarb',
          badge: {
            variant: 'success',
            text: 'New!',
          },
          attributes: { exact: true },
        },
        {
          name: 'SPAC Arbs',
          url: '/unknown',
          icon: 'icon-ban',
          attributes: { disabled: true },
        },
        {
          name: 'ETN Tracking Arbs',
          url: '/unknown',
          icon: 'icon-ban',
          attributes: { disabled: true },
        },
        {
          name: 'Reversal Arbs',
          url: '/unknown',
          icon: 'icon-ban',
          attributes: { disabled: true },
        },
        {
          name: 'Index Arbs',
          url: '/unknown',
          icon: 'icon-ban',
          attributes: { disabled: true },
        },
      ],
    },
    {
      name: 'Pairs Strategies',
      icon: 'fa fa-exchange',
      itemAttr: { id: 'pairs-drop' },
      children: [
        {
          name: 'Share Class Correlation',
          url: '/unknown',
          icon: 'icon-ban',
          attributes: { disabled: true },
        },
        {
          name: 'Index Correlation',
          url: '/unknown',
          icon: 'icon-ban',
          attributes: { disabled: true },
        },
      ],
    },
    {
      name: 'Trading Tools',
      icon: 'fa fa-wrench',
      itemAttr: { id: 'drop-1' },
      children: [
        {
          name: 'Stock Loan Rates',
          url: '/unknown',
          icon: 'icon-ban',
          attributes: { disabled: true },
        },
        {
          name: 'Hedging Table',
          url: '/unknown',
          icon: 'icon-ban',
          attributes: { disabled: true },
        },
        {
          name: 'Developer API',
          url: '/unknown',
          icon: 'icon-ban',
          attributes: { disabled: true },
        },
        {
          name: 'Data Warehouse',
          url: '/unknown',
          icon: 'icon-ban',
          attributes: { disabled: true },
        },
      ],
    },
  ]
};

export default navMenu;
