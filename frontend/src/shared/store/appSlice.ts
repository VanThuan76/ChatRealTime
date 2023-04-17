import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IUser } from "../typeDef/auth.type"

type APPSTATE = {
    dataUser: IUser | undefined,
    currentConversationIdChat: number
    currentUserIdChat: number
    currentBoxChat: number
}

const initialState: APPSTATE = {
    dataUser: undefined,
    currentConversationIdChat: 0,
    currentUserIdChat: 0,
    currentBoxChat: -1,
}

export const appSlice = createSlice({
    name: 'appSlice',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<IUser | undefined>) => {
            state.dataUser = action.payload
        },
        logout: (state) => {
            state.dataUser = undefined
        },
        setCurrentConversationIdChat: (state, action) => {
            state.currentConversationIdChat = action.payload
        },
        setCurrentUserIdChat: (state, action) => {
            state.currentUserIdChat = action.payload
        },
        setCurrentBoxChat: (state, action) => {
            state.currentBoxChat = action.payload
        }
    }
}
)
// Action creators are generated for each case reducer function
export const { login, logout, setCurrentConversationIdChat, setCurrentUserIdChat, setCurrentBoxChat } = appSlice.actions
export default appSlice.reducer
