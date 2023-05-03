import { Card, Typography, Radio, RadioChangeEvent } from "antd";
import Head from "next/head";
import useTheme from "~/shared/hooks/useTheme";
import { APP_SAVE_KEYS, APP_SETTINGS } from '~/shared/constant/AppConstant'
import { LocalStorageHelper } from "~/shared/utils/localStorage";

const Setting = () => {
    const { theme } = useTheme()
    function onChangeTheme(e: RadioChangeEvent) {
        LocalStorageHelper.set(APP_SAVE_KEYS.THEME, e.target.value)
        window.location.reload()
    }
    return (
        <>
        <Head>
            <title>Setting</title>
        </Head>
        <Card>
            <div className='flex flex-col gap-6 '>
                <div className='flex gap-10 items-center'>
                    <Typography className='font-bold'>Setting Theme</Typography>
                    <Radio.Group value={theme} onChange={(e) => onChangeTheme(e)}>
                        <Radio value={APP_SETTINGS.THEME.LIGHT}>Light</Radio>
                        <Radio value={APP_SETTINGS.THEME.NIGHT}>Dark</Radio>
                    </Radio.Group>
                </div>
                {/* <div className='flex gap-10 items-center'>
                    <Typography className='font-bold w-20'>{trans.page.setting.language}</Typography>
                    <Radio.Group value={lang} onChange={(e) => changeLanguage(e.target.value)}>
                        <Radio value={APP_SETTINGS.LANGUAGE.EN}>{trans.page.setting.enLang}</Radio>
                        <Radio value={APP_SETTINGS.LANGUAGE.VI}>{trans.page.setting.vnLang}</Radio>
                    </Radio.Group>
                </div> */}
            </div>

        </Card>
    </>

    );
}
 
export default Setting;