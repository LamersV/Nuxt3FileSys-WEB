import { DxFileManager, DxPermissions, DxItemView, DxContextMenu, DxContextMenuItem, DxDetails, DxItem, DxToolbar, DxToolbarItem, DxUpload, DxFileSelectionItem, DxNotifications, DxColumn } from 'devextreme-vue/file-manager';
import { DxFileUploader } from 'devextreme-vue/file-uploader';

import ptMessages from "devextreme/localization/messages/pt.json";
import { locale, loadMessages } from "devextreme/localization";

loadMessages(ptMessages);
locale("pt");

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp
        .component("DzFileManager", DxFileManager)
        .component("DzPermissions", DxPermissions)
        .component("DzItem", DxItem)
        .component("DzItemView", DxItemView)
        .component("DzContextMenu", DxContextMenu)
        .component("DzContextMenuItem", DxContextMenuItem)
        .component("DzDetails", DxDetails)
        .component("DzToolbar", DxToolbar)
        .component("DzToolbarItem", DxToolbarItem)
        .component("DzUpload", DxUpload)
        .component("DzFileSelectionItem", DxFileSelectionItem)
        .component("DzNotifications", DxNotifications)
        .component("DzColumn", DxColumn)
        .component("DzFileUploader", DxFileUploader)
})