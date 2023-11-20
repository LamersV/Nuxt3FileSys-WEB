<template>
  <div style="background-color: #363640">
    <DzFileManager 
      :file-system-provider="fileSystemProvider" selectionMode="single" locale="pt" rootFolderName="Arquivos"
      :onCurrentDirectoryChanged="directoryClick" :onContextMenuItemClick="menuClick" :onSelectedFileOpened="fileClick" :onToolbarItemClick="toolbarClick"
      :onErrorOccurred="onError" :customize-thumbnail="customizeIcon"
    >
      <DzUpload :chunkSize="50000000" :maxFileSize="50000000" />
      <DzNotifications :showPopup="true" :showPanel="true" />

      <DzItemView mode="thumbnails" :showFolders="true" :showParentFolder="false">
        <DzDetails>
          <DzColumn dataField="thumbnail"/>
          <DzColumn dataField="name" caption="Nome" />
          <DzColumn dataField="dateModified" caption="Modificado em" alignment="center" />
          <DzColumn dataField="size" caption="Tamanho" alignment="center"/>
        </DzDetails>
      </DzItemView>

      <DzContextMenu>
        <!-- <DzItem text="Abrir" icon="mdi mdi-eye"/> -->
        <DzItem text="Copiar" name="copy" />
        <DzItem text="Mover" name="move" />
        <DzItem text="Renomear" name="rename" />
        <DzItem text="Excluir" name="delete" />
        <DzItem text="Download" name="download" />
      </DzContextMenu>

      <DzToolbar>
        <DzItem name="showNavPane" :visible="true" />
        <DzItem name="separator"/>
        <DzItem name="create" text="Nova Pasta" icon="mdi mdi-folder-plus-outline" />
        <DzItem name="upload" text="Upload" icon="mdi mdi-upload" />
        <DzItem name="separator"/>
        <DzItem name="switchView" text="Alternar Visão" />
        <DzItem name="separator" location="after"/>
        <DzItem name="refresh" text="Atualizar" icon="mdi mdi-refresh" />

        <DzFileSelectionItem name="copy" text="Copiar" />
        <DzFileSelectionItem name="move" text="Mover" />
        <DzFileSelectionItem name="separator"/>
        <DzFileSelectionItem name="rename" text="Renomear" />
        <DzFileSelectionItem name="separator"/>
        <DzFileSelectionItem name="download"/>
        <DzFileSelectionItem name="separator"/>
        <DzFileSelectionItem name="delete" text="Excluir" />
        <DzFileSelectionItem name="clearSelection" text="Limpar" />
      </DzToolbar>

      <DzPermissions
        :get="true"
        :create="true"
        :copy="true"
        :move="true"
        :delete="true"
        :rename="true"
        :upload="true"
        :download="true"
      />
    </DzFileManager>
  </div>
</template>

<script setup>
import CustomFileSystemProvider from "devextreme/file_management/custom_provider";
import FileSystemError from "devextreme/file_management/error";

const fileClick = (e) => {
  if (e.file) openFile(e.file)
};

const directoryClick = (e) => {
  console.log('DIRECTORY', e);
};

const menuClick = (e) => {
  console.log('MENU', e);
};

const toolbarClick = (e) => {
  console.log('TOOLBAR', e);
};

const onError = (e) => {
  // Call Toast
  console.log('ERROR', e);
};

const fileSystemProvider = new CustomFileSystemProvider({
  getItems: async (parentDir) => {
    const response = await fetch('http://localhost:4000/file-system', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parentDir)
    });

    const { success, files, message } = await response.json();
    if (!success) throw new CustomError(message);

    return files;
  },
  moveItem: async (item, destinationDir) => {
    const response = await fetch('http://localhost:4000/file-system/move', { 
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item, destinationDir })
    });

    const { success, message } = await response.json();
    if (!success) throw new CustomError(message);
  },
  copyItem: async (item, destinationDir) => {
    const response = await fetch('http://localhost:4000/file-system/copy', { 
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item, destinationDir })
    });

    const { success, message } = await response.json();
    if (!success) throw new CustomError(message);
  },
  renameItem: async (item, newName) => {
    const response = await fetch('http://localhost:4000/file-system/rename', { 
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item, newName })
    });

    const { success, message } = await response.json();
    if (!success) throw new CustomError(message);
  },
  createDirectory: async (parentDir, name) => {
    const response = await fetch('http://localhost:4000/file-system/folder', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parentDir, name })
    });

    const { success, message } = await response.json();
    if (!success) throw new CustomError(message);
  },
  deleteItem: async (item) => {
    const response = await fetch('http://localhost:4000/file-system', { 
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item })
    });
    
    const { success, message } = await response.json();
    if (!success) throw new CustomError(message);
  },
  downloadItems: async (items) => {
    const response = await fetch('http://localhost:4000/file-system/open', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: items[0].dataItem.path })
    });

    const { success, message, file } = await response.json();
    if (!success) throw new CustomError(message);

    const blob = new Blob([new Uint8Array(file.buffer.data)], { type: file.mime });
    const newFile = new File([blob], file.name, { type: file.mime });

    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(newFile);
    downloadLink.setAttribute('download', file.name);
    downloadLink.click();
  },
  uploadFileChunk: async (fileData, uploadInfo, destinationDir) => {
    const formData = new FormData();
    formData.append('file', fileData);
    formData.append('uploadInfo', JSON.stringify(uploadInfo));
    formData.append('destinationDir', JSON.stringify(destinationDir));

    const response = await fetch('http://localhost:4000/file-system/file', { 
      method: 'POST',
      body: formData
    });

    const { success, message } = await response.json();
    if (!success) throw new CustomError(message);
  },
});

class CustomError extends FileSystemError {
  constructor(message) {
    super('Erro', null, message);
  }
}

const openFile = async (e) => {
  const response = await fetch('http://localhost:4000/file-system/open', { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path: e.dataItem.path })
  });

  const { success, message, file } = await response.json();
  if (!success) throw new FileSystemError(message);

  const blob = new Blob([new Uint8Array(file.buffer.data)], { type: file.mime });
  const newFile = new File([blob], file.name, { type: file.mime });

  const openList = ['txt', 'pdf', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'mp3', 'mp4', 'avi', 'mkv', 'mov', 'webm']

  //* open file in new tab
  if (openList.includes(file.extension)) {
    const url = window.URL.createObjectURL(newFile);
    window.open(url, '_blank')
  }
  //* download file
  else { 
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(newFile);
    downloadLink.setAttribute('download', file.name);
    downloadLink.click();
  }
};

const customizeIcon = (item) => {
  //from public folder
  if (item.isDirectory) return '/icons/pasta.png';

  const fileExtension = item.getFileExtension();

  switch (fileExtension) {
    case '.txt':
      return '/icons/txt.png';
    case '.pdf':
      return '/icons/pdf.png';
    case '.doc':
    case '.docx':
      return '/icons/docx.png';
    case '.xls':
    case '.xlsx':
      return '/icons/xlsx2.png';
    case '.ppt':
    case '.pptx':
      return '/icons/pptx.png';
    case '.zip':
    case '.rar':
    case '.7z':
      return '/icons/rar.png';
    case '.jpg':
    case '.jpeg':
    case '.png':
    case '.gif':
    case '.bmp':
    case '.svg':
      return '/icons/image.png';
    case '.mp3':
      return '/icons/mp3.png';
    case '.mp4':
    case '.avi':
    case '.mkv':
    case '.mov':
    case '.webm':
      return '/icons/video.png';
    default:
      return '/icons/doc.png';
  }

}

</script>