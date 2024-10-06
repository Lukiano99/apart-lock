import { paths } from "src/routes/paths";

import { CONFIG } from "@/config-global";

import { SvgColor } from "src/components/svg-color";

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  house: icon("ic_house"),
  smile: icon("ic_smile"),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    subheader: "Overview",
    items: [
      { title: "Stays", path: paths.apartments.root, icon: ICONS.house },
      {
        title: "Experiences",
        path: paths.apartments.expiriences,
        icon: ICONS.smile,
      },
    ],
  },
];
