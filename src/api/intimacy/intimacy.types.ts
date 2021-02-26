export interface KHIntimacyImage {
  id: string
  url: string
}

export interface KHIntimacyIndexResponse {
  img_url: string
  social_info: string
  last_read: number
  img_list: KHIntimacyImage[]
}

export interface IntimacyImageInternal {
  id: string
  url: string
}

export interface IntimacyIndexResponseInternal {
  imgUrl: string
  socialInfo: string
  lastRead: number
  imgList: IntimacyImageInternal[]
}
