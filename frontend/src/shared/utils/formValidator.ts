import dayjs from "dayjs";
import { APP_REGEX } from "../constant/AppConstant";
import 'dayjs/locale/en'; // import the English locale
import { ReactNode } from "react";
dayjs.locale('en');
interface List {
    message: ReactNode;
    user: any; 
    time: "string"
}

export function validateTime(time?: string){
    const formattedTime = dayjs(time).format('h:mm A (DD - MMMM)');
    return formattedTime
}
export function validateEmail(message?: string) {
    return {
        validator: (_: any, value: string) => {
            console.log(value.toString())
            if (value) {
                if (value.toString().match(APP_REGEX.EMAIL)) {
                    return Promise.resolve();
                } else {
                    return Promise.reject(message || 'Vui lòng nhập đúng định dạng email');
                }
            }

        }
    }
}

export function arrangeListMessage(list: List[]){
    const listArranged = list.sort((a, b) => dayjs(a.time).diff(dayjs(b.time)));
    return listArranged
}
