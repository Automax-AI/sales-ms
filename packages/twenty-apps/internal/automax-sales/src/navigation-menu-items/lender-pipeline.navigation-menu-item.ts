import {
  defineNavigationMenuItem,
  NavigationMenuItemType,
} from 'twenty-sdk/define';

import { LENDER_PIPELINE_VIEW_UNIVERSAL_IDENTIFIER } from 'src/views/lender-pipeline.view';

export default defineNavigationMenuItem({
  universalIdentifier: '3f7a8e3e-97bc-4b7f-bf05-cd9852e80ff4',
  name: 'lender-pipeline',
  icon: 'IconLayoutKanban',
  color: 'blue',
  position: 0,
  type: NavigationMenuItemType.VIEW,
  viewUniversalIdentifier: LENDER_PIPELINE_VIEW_UNIVERSAL_IDENTIFIER,
});
