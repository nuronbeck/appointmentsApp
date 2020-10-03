import { app_config } from '@/configs/app'
import { sidebarMenu } from '@/configs/app'

export default {
    namespaced: true,
    state: {
        app_name: app_config.name,
        sidebarMenu: sidebarMenu
    },
    mutations: {
    },
    actions: {
    },
    getters: {
        app_name: state => state.app_name,
        sidebarMenuItems: state => state.sidebarMenu.items
    }
}