import { http } from '@/utils/http/Axios'
import type { ListInfo } from '~/types/api'

export interface ListResult {
  code: number
  data: ListInfo[]
}

/** 加载表格数据 */
export const getListApi = (jobs: Pick<PermissionRow, 'jobId' | 'jobName'>) => {
  return http.request<ListResult>('get', '/list', { params: { ...jobs } }).then(({ data }) => data)
}
