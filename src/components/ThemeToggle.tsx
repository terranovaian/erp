import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export const ThemeToggle = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Función para sincronizar el estado local con el DOM
        const syncTheme = () => {
            const isDark = document.documentElement.classList.contains('dark');
            setTheme(isDark ? 'dark' : 'light');
            console.log('Theme synchronized:', isDark ? 'dark' : 'light');
        };

        syncTheme();

        // Escuchar cambios de otras instancias o pestañas
        const handleThemeChange = () => {
            syncTheme();
        };

        window.addEventListener('storage', handleThemeChange);
        window.addEventListener('theme-change', handleThemeChange);

        return () => {
            window.removeEventListener('storage', handleThemeChange);
            window.removeEventListener('theme-change', handleThemeChange);
        };
    }, []);

    const toggleTheme = (e: React.MouseEvent) => {
        // Detener eventos para evitar cierres de menús o comportamientos extraños
        e.preventDefault();
        e.stopPropagation();

        const root = document.documentElement;
        const isDark = root.classList.contains('dark');
        const nextTheme = isDark ? 'light' : 'dark';

        console.log('Toggling theme to:', nextTheme);

        if (nextTheme === 'dark') {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }

        setTheme(nextTheme);

        // Emitir evento para otros componentes ThemeToggle
        window.dispatchEvent(new CustomEvent('theme-change'));
    };

    if (!mounted) {
        return <div className="p-2 w-10 h-10" />;
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-95 z-50 relative"
            title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
            aria-label="Alternar tema oscuro"
        >
            <div className="relative w-5 h-5 flex items-center justify-center">
                {theme === 'light' ? (
                    <Moon size={20} className="animate-in fade-in zoom-in duration-300" />
                ) : (
                    <Sun size={20} className="animate-in fade-in zoom-in duration-300" />
                )}
            </div>
        </button>
    );
};
