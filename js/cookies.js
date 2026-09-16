// --- COOKIE UTILITIES FOR AUTHENTICATION & AUTOMATION TESTING ---
const CookieUtils = {
    _mem: {},
    set: (name, value, days = null, path = '/') => {
        const isFile = window.location.protocol === 'file:';
        let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=${path};`;
        if (!isFile) {
            cookieStr += ` SameSite=Lax;`;
        }
        if (days !== null) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            cookieStr += ` expires=${date.toUTCString()};`;
        }
        try {
            document.cookie = cookieStr;
        } catch (e) {}

        try {
            localStorage.setItem('qs_cookie_' + name, value);
        } catch (e) {}
        CookieUtils._mem[name] = value;
    },
    get: (name) => {
        try {
            const nameEQ = encodeURIComponent(name) + "=";
            if (document.cookie) {
                const ca = document.cookie.split(';');
                for (let i = 0; i < ca.length; i++) {
                    let c = ca[i].trim();
                    if (c.indexOf(nameEQ) === 0) {
                        return decodeURIComponent(c.substring(nameEQ.length, c.length));
                    }
                }
            }
        } catch (e) {}

        try {
            const stored = localStorage.getItem('qs_cookie_' + name);
            if (stored !== null) return stored;
        } catch (e) {}

        return CookieUtils._mem[name] !== undefined ? CookieUtils._mem[name] : null;
    },
    delete: (name, path = '/') => {
        try {
            document.cookie = `${encodeURIComponent(name)}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
        } catch (e) {}
        try {
            localStorage.removeItem('qs_cookie_' + name);
        } catch (e) {}
        delete CookieUtils._mem[name];
    },
    getAll: () => {
        const cookies = {};
        try {
            if (document.cookie) {
                const ca = document.cookie.split(';');
                for (let i = 0; i < ca.length; i++) {
                    const parts = ca[i].trim().split('=');
                    if (parts[0]) {
                        const key = decodeURIComponent(parts[0]);
                        const val = parts.slice(1).join('=');
                        cookies[key] = val ? decodeURIComponent(val) : '';
                    }
                }
            }
        } catch (e) {}

        try {
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && k.startsWith('qs_cookie_')) {
                    const cName = k.replace('qs_cookie_', '');
                    if (!(cName in cookies)) {
                        cookies[cName] = localStorage.getItem(k);
                    }
                }
            }
        } catch (e) {}

        for (const [k, v] of Object.entries(CookieUtils._mem)) {
            if (!(k in cookies)) {
                cookies[k] = v;
            }
        }
        return cookies;
    },
    clearAuth: () => {
        ['auth_token', 'user_email', 'user_role', 'user_name', 'session_id', 'remember_me', 'logged_in'].forEach(name => {
            CookieUtils.delete(name);
        });
    }
};
