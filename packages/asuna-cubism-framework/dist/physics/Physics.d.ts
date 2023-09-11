export interface PhysicsJson {
    Version: number;
    Meta: Meta;
    PhysicsSettings: PhysicsSetting[];
}
export interface Meta {
    PhysicsSettingCount: number;
    TotalInputCount: number;
    TotalOutputCount: number;
    VertexCount: number;
    Fps: number;
    EffectiveForces: EffectiveForces;
    PhysicsDictionary: PhysicsDictionary[];
}
export interface EffectiveForces {
    Gravity: Gravity;
    Wind: Wind;
}
export interface Gravity {
    X: number;
    Y: number;
}
export interface Wind {
    X: number;
    Y: number;
}
export interface PhysicsDictionary {
    Id: string;
    Name: string;
}
export interface PhysicsSetting {
    Id: string;
    Input: Input[];
    Output: Output[];
    Vertices: Vertice[];
    Normalization: Normalization;
}
export interface Input {
    Source: Source;
    Weight: number;
    Type: string;
    Reflect: boolean;
}
export interface Source {
    Target: string;
    Id: string;
}
export interface Output {
    Destination: Destination;
    VertexIndex: number;
    Scale: number;
    Weight: number;
    Type: string;
    Reflect: boolean;
}
export interface Destination {
    Target: string;
    Id: string;
}
export interface Vertice {
    Position: Position;
    Mobility: number;
    Delay: number;
    Acceleration: number;
    Radius: number;
}
export interface Position {
    X: number;
    Y: number;
}
export interface Normalization {
    Position: Position2;
    Angle: Angle;
}
export interface Position2 {
    Minimum: number;
    Default: number;
    Maximum: number;
}
export interface Angle {
    Minimum: number;
    Default: number;
    Maximum: number;
}
//# sourceMappingURL=Physics.d.ts.map