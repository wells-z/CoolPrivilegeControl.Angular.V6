export class MenuItem {
    MenuItemIcon: string;

    MenuItemName: string;

    MenuItemPath: string;

    MenuItemUrl: string;

    SubMenuItems: MenuItem[];

    constructor(MenuItemIcon: string, MenuItemUrl: string, MenuItemName: string, MenuItemPath: string, SubMenuItems: MenuItem[]) {
        this.MenuItemIcon = MenuItemIcon;
        this.MenuItemUrl = MenuItemUrl;
        this.MenuItemName = MenuItemName;
        this.MenuItemPath = MenuItemPath;
        this.SubMenuItems = SubMenuItems;
    }
}
