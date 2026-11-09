// Special (seasonal) menu types. To add a new type later (e.g. "valentines"),
// add an entry here and give it a theme in the components that switch on `type`.
export const SPECIAL_MENU_TYPES = {
    christmas: {
        label: "Christmas",
        sectionHeading: "Christmas",
        sectionKicker: "Festive Season at Kin Dee",
        heroBadge: "Our Christmas Set Menu is here",
        tagline: "A Festive Taste of Thailand",
        footerWords: ["Eat", "Drink", "Celebrate"],
    },
} as const;

export type SpecialMenuType = keyof typeof SPECIAL_MENU_TYPES;

export interface SpecialMenu {
    id: string;
    type: SpecialMenuType | string;
    title: string;
    description?: string | null;
    price_text?: string | null;
    image_url?: string | null;
    pdf_url?: string | null;
    is_active: boolean;
    enable_theme: boolean;
    display_order: number;
}

export function getSpecialMenuTypeConfig(type: string) {
    return SPECIAL_MENU_TYPES[type as SpecialMenuType] ?? null;
}

/** The festive theme to apply site-wide, taken from the first active menu that has the theme switched on. */
export function getActiveTheme(menus: SpecialMenu[]): SpecialMenuType | null {
    const themed = menus.find((m) => m.is_active && m.enable_theme && getSpecialMenuTypeConfig(m.type));
    return (themed?.type as SpecialMenuType) ?? null;
}
