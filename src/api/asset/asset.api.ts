import FormData, { Stream } from 'form-data'
import { BotInstance } from '../../BotInstance'
import RequestError from '../../models/Error/RequestError'
import { KHAPIResponse } from '../../types/kaiheila/api'
import {
  AssetCreateResponseInternal,
  KHAssetCreateResponse,
} from './asset.types'

export class AssetAPI {
  private self: BotInstance
  constructor(self: BotInstance) {
    this.self = self
  }

  /**
   * 上传文件
   * @param file 文件，看到参数错误时需要在选项中补齐文件相关内容。
   * @param option 选项，参见 [form-data](https://github.com/form-data/form-data)
   */
  async create(
    file: Buffer | Stream,
    option?: FormData.AppendOptions
  ): Promise<AssetCreateResponseInternal> {
    const form = new FormData()
    form.append('file', file, option)
    const data = (
      await this.self.axios.post('v3/asset/create', form, {
        headers: form.getHeaders(),
      })
    ).data as KHAPIResponse<KHAssetCreateResponse>
    if (data.code === 0) {
      return { url: data.data.url }
    } else {
      throw new RequestError(data.code, data.message)
    }
  }
}
