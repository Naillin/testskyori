export interface IProperties {
    name: string,
    foundation: string,
    capital: string
}

export enum TypeGeometry {
    Polygon = "Polygon",
    MultiPolygon = "MultiPolygon"
}

export interface IGeometry {
    type: TypeGeometry,
    coordinates: number[][][] | number[][][][]
}

export interface IState {
    type: string,
    id: string,
    properties: IProperties,
    geometry: IGeometry
}
