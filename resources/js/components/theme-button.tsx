import { Button } from '@/components/ui/button';
import { useAppearance } from '@/hooks/use-appearance';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
    const { appearance, updateAppearance } = useAppearance();

    const isDark = appearance === 'dark' || (appearance === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    const toggleTheme = () => {
        const newTheme = isDark ? 'light' : 'dark';
        updateAppearance(newTheme as 'light' | 'dark');
    };

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full border-white/20 bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
        >
            <Sun className={`h-5 w-5 text-yellow-300 transition-all ${isDark ? 'scale-0 rotate-90' : 'scale-100 rotate-0'}`} />
            <Moon className={`absolute h-5 w-5 transition-all ${isDark ? 'scale-100 rotate-0' : 'scale-0 -rotate-90'}`} />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
