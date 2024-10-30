import { paths } from "src/routes/paths";

import { CONFIG } from "@/config-global";

import { SvgColor } from "src/components/svg-color";

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  house: icon("ic-house"),
  smile: icon("ic-smile"),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    subheader: "Pregled",
    items: [
      { title: "Apartmani", path: paths.apartments.root, icon: ICONS.house },
      {
        title: "Iskustva",
        path: paths.apartments.expiriences,
        icon: ICONS.smile,
      },
    ],
  },
];
