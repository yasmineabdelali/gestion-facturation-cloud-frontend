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
  badge?: {
    title?: string;
    type?: string;
  };
  children?: NavigationItem[];
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'navigation',
    title: 'Navigation',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'dashboard',
        title: 'Tableau de bord',
        type: 'item',
        url: '/dashboard',
        icon: 'feather icon-home'
      }
    ]
  },
  {
    id: 'gestion',
    title: 'Gestion',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'societes',
        title: 'Sociétés',
        type: 'item',
        url: '/societes',
        icon: 'feather icon-briefcase'
      },
      {
        id: 'projets',
        title: 'Projets (SO)',
        type: 'item',
        url: '/projets',
        icon: 'feather icon-folder'
      },
      {
        id: 'factures',
        title: 'Factures',
        type: 'item',
        url: '/factures',
        icon: 'feather icon-file-text'
      }
    ]
  },
  {
    id: 'administration',
    title: 'Administration',
    type: 'group',
    icon: 'icon-group',
    children: [
      {
        id: 'utilisateurs',
        title: 'Utilisateurs',
        type: 'item',
        url: '/users',
        icon: 'feather icon-users'
      }
    ]
  }
];