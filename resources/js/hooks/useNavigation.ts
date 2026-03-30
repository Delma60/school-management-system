import { useEffect, useState } from 'react';

export interface NavItem {
    title: string;
    url: string;
    icon?: string | null;
    isActive?: boolean;
    permission?: string;
    items?: NavItem[];
}

export const useNavigation = () => {
    const [navItems, setNavItems] = useState<NavItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNavItems = async () => {
            try {
                const response = await fetch('/api/navigation/main');
                if (!response.ok) {
                    throw new Error('Failed to fetch navigation items');
                }
                const data = await response.json();
                setNavItems(data.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchNavItems();
    }, []);

    return { navItems, loading, error };
};

export const useSettingsNavigation = () => {
    const [navItems, setNavItems] = useState<NavItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNavItems = async () => {
            try {
                const response = await fetch('/api/navigation/settings');
                if (!response.ok) {
                    throw new Error('Failed to fetch settings navigation items');
                }
                const data = await response.json();
                setNavItems(data.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchNavItems();
    }, []);

    return { navItems, loading, error };
};
