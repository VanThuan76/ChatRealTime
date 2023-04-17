import { ThemeConfig } from "antd"

export const APP_REGEX = {
    VN_PHONENUMBER: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
    EMAIL : /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
}
export const APP_THEME = {
    theme: {
        light: {
            token: {
                colorPrimary: '#C0DBEA',
                colorBgContainer: '#C0DBEA',
                colorBgBase: "#fff",
                colorText: '#000',
                colorTextPlaceholder: "#000",
            },
            components: {
                Typography: {
                    colorText: '#000'
                },
                Input: {
                    colorTextPlaceholder: '#cbd5e1'
                }
            }
        } as ThemeConfig,
        dark: {
            token: {
                colorPrimary: '#F3732A',
                colorBgBase: "rgb(33, 33, 52)",
                colorBgContainer: '#C0DBEA',
                colorText: '#fff',
                colorTextPlaceholder: "#fff"
            },
            components: {
                Typography: {
                    colorText: '#fff'
                },
                Input: {
                    colorTextPlaceholder: '#cbd5e1'
                }
            }
        } as ThemeConfig
    }
}
export const APP_SAVE_KEYS = {
    KEYS: 'keys',
    SESSION_KEY: 'sessionKey',
    ROLE: 'role',
    TIME_EXPIRED: 'timeExpired',
    THEME: 'THEME',
    LANGUAGE: 'LANGUAGE'
}
