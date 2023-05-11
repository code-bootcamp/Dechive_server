export enum PROVIDER_ENUM {
  GOOGLE = 'google',
  KAKAO = 'kakao',
  NAVER = 'naver',
  DECHIVE = 'dechive',
}

export interface IProvider {
  params: {
    social: PROVIDER_ENUM;
  };
}
