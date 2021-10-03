
const navMenu = {
  items: [
    {
      name: 'Home',
      url: '/',
      icon: 'fa fa-home',
      attributes: { exact: true },
    },
    {
      divider: true,
      class: 'm-2'
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
          badge: {
            variant: 'success',
            text: 'New!',
          },
          attributes: { exact: true },
        },
        {
          name: 'Borrow Arbs',
          url: '/indev',
          badge: {
            variant: 'primary',
            text: 'In Dev',
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
          name: 'Special Divvy Arbs',
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
      ],
    },
  ]
};

export default navMenu;
