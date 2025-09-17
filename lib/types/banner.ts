export interface Banner {
  id?: string;
  titulo: string;
  subtitulo: string;
  imagemUrl?: string;
  linkDestino?: string;
  textoLink?: string;
  ativo: boolean;
  ordem: number;
  criadoEm?: Date;
  atualizadoEm?: Date;
}

export interface BannerFormData {
  titulo: string;
  subtitulo: string;
  imagemUrl?: string;
  linkDestino?: string;
  textoLink?: string;
  ativo: boolean;
  ordem: number;
}