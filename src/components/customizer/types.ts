export type ModelId =
  | 'trucker'
  | 'americano'
  | 'americano-aba-reta'
  | 'seis-gomos'
  | 'seis-gomos-aba-reta'
  | 'dad-hat'
  | 'viseira';

/** Partes do boné que recebem cor. */
export type PartId = 'frente' | 'laterais' | 'aba' | 'detalhes';

/** Superfícies onde uma arte pode ser aplicada. */
export type SurfaceId = 'copa' | 'aba' | 'faixa';

/** Atalhos de posicionamento mostrados para o cliente. */
export type AreaId = 'frente' | 'lado-esquerdo' | 'lado-direito' | 'tras' | 'aba';

export type ViewId = 'destaque' | 'frente' | 'esquerda' | 'direita' | 'tras' | 'aba';

export type FontId = 'moderna' | 'impacto' | 'cursiva' | 'classica';

interface BaseLayer {
  id: string;
  surface: SurfaceId;
  /** Horizontal: graus em volta da copa/faixa (0 = centro da frente); de -1 a 1 na aba. */
  u: number;
  /** Vertical: 0 = embaixo e 1 = em cima. Na aba, 0 = junto à copa e 1 = na ponta. */
  v: number;
  /** Largura da arte em unidades do modelo (o boné tem cerca de 2 de largura). */
  size: number;
  /** Giro da arte, em graus. */
  rotation: number;
}

export interface TextLayer extends BaseLayer {
  kind: 'text';
  text: string;
  font: FontId;
  color: string;
}

export interface ImageLayer extends BaseLayer {
  kind: 'image';
  name: string;
  /** Imagem enviada, já reduzida, antes de remover o fundo. */
  original: string;
  /** Imagem aplicada no boné (recortada e, se pedido, sem fundo branco). */
  src: string;
  aspect: number;
  removeWhite: boolean;
}

export type Layer = TextLayer | ImageLayer;

export type Colors = Record<PartId, string>;

export interface Design {
  model: ModelId;
  colors: Colors;
  layers: Layer[];
}

export interface OrderInfo {
  nome: string;
  quantidade: string;
  observacoes: string;
}

export type CapturedViews = Partial<Record<ViewId, string>>;

export interface CaptureApi {
  capture(views: ViewId[]): Promise<CapturedViews>;
}

export interface ViewRequest {
  view: ViewId;
  /** Muda a cada pedido, para repetir a mesma vista. */
  nonce: number;
}
