import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { LENDERS_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/lenders.view';

export default defineNavigationMenuItem({
  universalIdentifier: '77d3fd9d-5d35-4e22-aab7-69257d7cb881',
  name: 'lenders',
  icon: 'IconBuildingBank',
  color: 'blue',
  position: 1,
  type: NavigationMenuItemType.VIEW,
  viewUniversalIdentifier: LENDERS_VIEW_UNIVERSAL_IDENTIFIER,
});
