import { NavGroup } from "@/types";

export const getNavItems = (navItems: NavGroup[], url: string) => {
    return navItems
        .map((item) => {
            // 1. Clone the item to avoid mutating the original state
            const newItem = { ...item };

            // 2. Filter sub-items if they exist
            if (newItem.items) {
                newItem.items = newItem.items.filter((subItem) => 
                    url.startsWith(subItem.url)
                );
            }
            
            return newItem;
        })
        // .filter((item) => {
        //     // 3. Keep the parent item if it still has sub-items left, 
        //     // OR if it's a standalone link that matches the URL
        //     if (item.items) {
        //         return item.items.length > 0;
        //     }
        //     return url.startsWith(item.url);
        // });
};