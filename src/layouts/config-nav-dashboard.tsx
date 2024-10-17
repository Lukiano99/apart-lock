import { paths } from "src/routes/paths";

import { CONFIG } from "@/config-global";

import { SvgColor } from "src/components/svg-color";

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon("ic-job"),
  blog: icon("ic-blog"),
  chat: icon("ic-chat"),
  mail: icon("ic-mail"),
  user: icon("ic-user"),
  file: icon("ic-file"),
  lock: icon("ic-lock"),
  tour: icon("ic-tour"),
  order: icon("ic-order"),
  label: icon("ic-label"),
  blank: icon("ic-blank"),
  kanban: icon("ic-kanban"),
  folder: icon("ic-folder"),
  course: icon("ic-course"),
  banking: icon("ic-banking"),
  booking: icon("ic-booking"),
  invoice: icon("ic-invoice"),
  product: icon("ic-product"),
  calendar: icon("ic-calendar"),
  disabled: icon("ic-disabled"),
  external: icon("ic-external"),
  menuItem: icon("ic-menu-item"),
  ecommerce: icon("ic-ecommerce"),
  analytics: icon("ic-analytics"),
  dashboard: icon("ic-dashboard"),
  parameter: icon("ic-parameter"),
  apartments: icon("ic-apartments"),
  plus: icon("ic-plus"),
  edit: icon("ic-edit"),
  ticket: icon("ic-ticket"),
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    subheader: "Osnovno",
    items: [
      {
        title: "Pregled",
        path: paths.dashboard.root,
        icon: ICONS.dashboard,
      },
      {
        title: "Rezervacije",
        path: paths.dashboard.reservations,
        icon: ICONS.ticket,
      },
      {
        title: "Apartmani",
        path: paths.dashboard.apartments.root,
        icon: ICONS.apartments,
        children: [
          {
            title: "Vaši apartmani",
            path: paths.dashboard.apartments.root,
            icon: ICONS.blog,
          },
          {
            title: "Unesi novi apartman",
            path: paths.dashboard.apartments.new,
            icon: ICONS.plus,
          },
          {
            title: "Izmeni apartman",
            // todo
            path: paths.dashboard.apartments.edit(
              `1fd69fbe-589c-42c5-92e3-017cd7c6e946`
            ),
            icon: ICONS.edit,
          },
        ],
      },
    ],
  },
];
