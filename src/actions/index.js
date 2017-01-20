import cozy from 'cozy-client-js'
import { v4 } from 'node-uuid'

export const ROOT_DIR_ID = 'io.cozy.files.root-dir'
export const TRASH_DIR_ID = 'io.cozy.files.trash-dir'

export const FETCH_FILES = 'FETCH_FILES'
export const RECEIVE_FILES = 'RECEIVE_FILES'
export const OPEN_FOLDER = 'OPEN_FOLDER'
export const OPEN_FOLDER_SUCCESS = 'OPEN_FOLDER_SUCCESS'
export const OPEN_FOLDER_FAILURE = 'OPEN_FOLDER_FAILURE'
export const ADD_FOLDER = 'ADD_FOLDER'
export const CREATE_FOLDER = 'CREATE_FOLDER'
export const CREATE_FOLDER_SUCCESS = 'CREATE_FOLDER_SUCCESS'
export const UPLOAD_FILE = 'UPLOAD_FILE'
export const UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS'

const extractFileAttributes = f => Object.assign({}, f.attributes, { id: f._id })

export const openFolder = (folderId = ROOT_DIR_ID, isInitialFetch = false, router = null) => {
  return async dispatch => {
    if (isInitialFetch) {
      dispatch({ type: FETCH_FILES, folderId })
    }
    dispatch({ type: OPEN_FOLDER, folderId })
    let folder
    try {
      folder = await cozy.files.statById(folderId)
    } catch (err) {
      return dispatch({type: OPEN_FOLDER_FAILURE, error: err})
    }

    const parentId = folder.attributes.dir_id
    let parent
    try {
      parent = !!parentId && await cozy.files.statById(parentId)
    } catch (err) {
      return dispatch({type: OPEN_FOLDER_FAILURE, error: err})
    }

    if (isInitialFetch) {
      dispatch({ type: RECEIVE_FILES, folderId })
    } else if (router) {
      router.push(`/files/${folderId}`)
    }
    dispatch({
      type: OPEN_FOLDER_SUCCESS,
      folder: Object.assign(extractFileAttributes(folder), {
        parent: extractFileAttributes(parent)
      }),
      files: folder.relations('contents').map(
        c => extractFileAttributes(c)
      )
    })
  }
}

export const uploadFile = (file) => {
  return async (dispatch, getState) => {
    dispatch({ type: UPLOAD_FILE })
    const created = await cozy.files.create(
      file,
      { dirID: getState().folder.id }
    )
    dispatch({
      type: UPLOAD_FILE_SUCCESS,
      file: extractFileAttributes(created)
    })
  }
}

export const addFolder = () => ({
  type: ADD_FOLDER,
  folder: {
    id: v4(),
    name: '',
    type: 'directory',
    created_at: Date.now(),
    isNew: true
  }
})

const isDir = attrs => attrs.type === 'directory'

export const renameFile = (newName, attrs) => {
  if (isDir(attrs)) {
    return attrs.isNew === true
      ? createFolder(newName, attrs.id)
      : renameFolder(newName, attrs.id)
  }
}

export const createFolder = (newName, tempId) => {
  return async (dispatch, getState) => {
    dispatch({ type: CREATE_FOLDER, id: tempId })
    const folder = await cozy.files.createDirectory({
      name: newName,
      dirID: getState().folder.id
    })
    dispatch({
      type: CREATE_FOLDER_SUCCESS,
      folder: extractFileAttributes(folder),
      tempId
    })
  }
}

export const renameFolder = (newName, id) => {

}
